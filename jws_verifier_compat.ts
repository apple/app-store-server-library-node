// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import type { buildOcspRequest } from '@preeternal/jws-verifier'
import { createHash, verify, X509Certificate } from 'node:crypto'
import { getVerifierModule } from './jws_verifier_loader'

export const APPLE_LEAF_OID = '1.2.840.113635.100.6.11.1'
export const APPLE_INTERMEDIATE_OID = '1.2.840.113635.100.6.2.1'
export const OCSP_TIMEOUT_MS = 30_000
export const MAX_SKEW = 60_000

export function ocspEndpoints(certificate: X509Certificate): string[] {
    return [...(certificate.infoAccess ?? '').matchAll(/^OCSP - URI:(.+)$/gm)]
        .map(match => match[1])
}

type Element = { start: number, value: number, end: number, tag: number }

// The subclass hooks receive certificates already decoded by Node. Read only
// the byte ranges needed by the OCSP codec and the two Apple extension markers.
function readElement(bytes: Buffer, start: number, limit: number, tag?: number): Element {
    if (limit - start < 2 || (bytes[start] & 31) === 31 || (tag !== undefined && bytes[start] !== tag)) {
        throw new Error('Invalid DER element')
    }
    let value = start + 2
    let length = bytes[start + 1]
    if (length >= 128) {
        const count = length & 127
        if (count === 0 || count > 4 || count > limit - value || bytes[value] === 0) {
            throw new Error('Invalid DER length')
        }
        length = 0
        for (let i = 0; i < count; i++) length = length * 256 + bytes[value++]
        if (length < 128) throw new Error('Non-minimal DER length')
    }
    if (length > limit - value) throw new Error('Truncated DER element')
    return { start, value, end: value + length, tag: bytes[start] }
}

function certificateParts(certificate: X509Certificate) {
    const der = certificate.raw
    const outer = readElement(der, 0, der.length, 0x30)
    const tbs = readElement(der, outer.value, outer.end, 0x30)
    let cursor = tbs.value
    if (der[cursor] === 0xa0) cursor = readElement(der, cursor, tbs.end).end
    const serial = readElement(der, cursor, tbs.end, 0x02)
    const algorithm = readElement(der, serial.end, tbs.end, 0x30)
    const issuer = readElement(der, algorithm.end, tbs.end, 0x30)
    const validity = readElement(der, issuer.end, tbs.end, 0x30)
    const subject = readElement(der, validity.end, tbs.end, 0x30)
    const spki = readElement(der, subject.end, tbs.end, 0x30)
    const keyAlgorithm = readElement(der, spki.value, spki.end, 0x30)
    const key = readElement(der, keyAlgorithm.end, spki.end, 0x03)
    if (key.value === key.end || der[key.value] !== 0 || key.end !== spki.end) {
        throw new Error('Invalid subject public key')
    }
    const extensionOids = new Set<string>()
    for (cursor = spki.end; cursor < tbs.end;) {
        const field = readElement(der, cursor, tbs.end)
        cursor = field.end
        if (field.tag !== 0xa3) continue
        const extensions = readElement(der, field.value, field.end, 0x30)
        for (let index = extensions.value; index < extensions.end;) {
            const extension = readElement(der, index, extensions.end, 0x30)
            const oid = readElement(der, extension.value, extension.end, 0x06)
            extensionOids.add(der.toString('hex', oid.value, oid.end))
            index = extension.end
        }
    }
    return { der, certificate, serial, issuer, subject, key, extensionOids }
}

export function hasAppleCertificateMarkers(leaf: X509Certificate, intermediate: X509Certificate): boolean {
    return certificateParts(leaf).extensionOids.has('2a864886f76364060b01')
        && certificateParts(intermediate).extensionOids.has('2a864886f76364060201')
}

type CertificateParts = ReturnType<typeof certificateParts>
type CodecCertificate = Parameters<typeof buildOcspRequest>[0]

function forOcspCodec(parts: CertificateParts): CodecCertificate {
    const range = (offset: number, end: number) => ({ offset, length: end - offset })
    // The RC's request codec consumes these three ranges from PreparedCertificate.
    return {
        der: parts.der,
        certificate: parts.certificate,
        metadata: {
            issuer: range(parts.issuer.start, parts.issuer.end),
            serial: { value: range(parts.serial.value, parts.serial.end) },
            subjectPublicKey: { value: range(parts.key.value + 1, parts.key.end) }
        }
    } as unknown as CodecCertificate
}

export type LegacyOcspResult = 'good' | 'invalid-certificate' | 'retryable' | 'invalid-response'

export async function checkLegacyOcsp(cert: X509Certificate, issuer: X509Certificate): Promise<LegacyOcspResult> {
    const endpoint = ocspEndpoints(cert)[0]
    if (endpoint === undefined) return 'invalid-certificate'
    const { buildOcspRequest, fetchOcspResponse, ocspCertIdFor, parseOcspResponse } = getVerifierModule()
    const checked = forOcspCodec(certificateParts(cert))
    const issuerParts = certificateParts(issuer)
    const issuedBy = forOcspCodec(issuerParts)
    const request = buildOcspRequest(checked, issuedBy)
    let bytes: Uint8Array
    try {
        bytes = await fetchOcspResponse(endpoint, request, AbortSignal.timeout(OCSP_TIMEOUT_MS), {
            maxResponseBytes: 256 * 1024
        })
    } catch {
        return 'retryable'
    }
    let response
    try {
        response = parseOcspResponse(bytes).basic
    } catch {
        return 'invalid-response'
    }
    if (response === undefined || response.signatureAlgorithm.hash === 'sha1'
        || response.criticalExtensionOids.length !== 0) return 'invalid-response'
    const now = Date.now()
    const candidates = [issuer, ...response.certificates.map(der => new X509Certificate(der))]
    let matched = false
    let authorized = false
    let validSignature = false
    for (const candidate of candidates) {
        const parts = candidate === issuer ? issuerParts : certificateParts(candidate)
        const responder = response.responderId
        const matches = responder.kind === 'key'
            ? createHash('sha1').update(parts.der.subarray(parts.key.value + 1, parts.key.end)).digest().equals(responder.value)
            : parts.der.subarray(responder.implicit ? parts.subject.value : parts.subject.start, parts.subject.end).equals(responder.value)
        if (!matches) continue
        matched = true
        if (!candidate.raw.equals(issuer.raw) && (
            candidate.issuer !== issuer.subject || !candidate.verify(issuer.publicKey) || candidate.ca
            || !candidate.keyUsage?.includes('1.3.6.1.5.5.7.3.9')
            || new Date(candidate.validFrom).getTime() > now + MAX_SKEW
            || new Date(candidate.validTo).getTime() < now - MAX_SKEW
        )) continue
        authorized = true
        if (candidate.publicKey.asymmetricKeyType === response.signatureAlgorithm.key
            && verify(response.signatureAlgorithm.hash, response.tbsResponseData, candidate.publicKey, response.signature)) {
            validSignature = true
            break
        }
    }
    if (!validSignature) return matched && !authorized ? 'invalid-certificate' : 'invalid-response'
    const expected = ocspCertIdFor(checked, issuedBy)
    const matching = response.responses.filter(({ certId }) =>
        certId.hashAlgorithm === expected.hashAlgorithm
        && Buffer.from(certId.serialNumber).equals(expected.serialNumber)
        && Buffer.from(certId.issuerNameHash).equals(expected.issuerNameHash)
        && Buffer.from(certId.issuerKeyHash).equals(expected.issuerKeyHash))
    const result = matching[0]
    return matching.length === 1 && result.status === 'good' && result.criticalExtensionOids.length === 0
        && response.producedAtMs <= now + MAX_SKEW && result.thisUpdateMs <= now + MAX_SKEW
        && result.nextUpdateMs !== undefined && result.nextUpdateMs >= result.thisUpdateMs
        && result.nextUpdateMs >= now - MAX_SKEW ? 'good' : 'invalid-response'
}
