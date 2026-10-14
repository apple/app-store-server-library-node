// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import type { Certificate } from '@peculiar/asn1-x509';
import { AsnType, BitString, Boolean, Constructed, GeneralizedTime, ObjectIdentifier, OctetString, Sequence, UTCTime, fromBER } from 'asn1js';

export function parseASN1(data: Uint8Array, der: boolean = true): AsnType {
    const decoded = fromBER(data)
    if (decoded.offset !== data.byteLength || decoded.result.error) {
        throw new Error('Invalid ASN.1 encoding')
    }
    if (der) {
        checkDER(decoded.result)
    }
    return decoded.result
}

function checkDER(value: AsnType): void {
    if (value.lenBlock.isIndefiniteForm) {
        throw new Error('Indefinite length in DER')
    }
    const bytes = value.valueBeforeDecodeView
    const lengthOffset = value.idBlock.blockLength
    if (bytes[lengthOffset] > 0x80 &&
        (bytes[lengthOffset + 1] === 0 || value.lenBlock.length < 128)) {
        throw new Error('Non-minimal DER length')
    }
    if (value.idBlock.tagClass === 1) {
        const tag = value.idBlock.tagNumber
        const contentOffset = lengthOffset + value.lenBlock.blockLength
        if ((value.idBlock.isConstructed && tag !== 16 && tag !== 17) ||
            (tag === 5 && value.lenBlock.length !== 0) ||
            ((tag === 2 || tag === 10) && (value.lenBlock.length === 0 ||
                (value.lenBlock.length > 1 && ((bytes[contentOffset] === 0 && bytes[contentOffset + 1] < 128) ||
                (bytes[contentOffset] === 255 && bytes[contentOffset + 1] >= 128)))))) {
            throw new Error('Invalid DER value')
        }
    }
    if (value instanceof BitString && value.valueBlock.unusedBits !== 0) {
        const bits = value.valueBlock.valueHexView
        if (bits.length === 0 || (bits[bits.length - 1] & ((1 << value.valueBlock.unusedBits) - 1)) !== 0) {
            throw new Error('Invalid BIT STRING padding')
        }
    }
    if (value instanceof GeneralizedTime || value instanceof UTCTime) {
        const text = Buffer.from(value.valueBlock.valueHexView).toString('ascii')
        const generalized = value instanceof GeneralizedTime
        if (!(generalized ? /^\d{14}Z$/ : /^\d{12}Z$/).test(text)) {
            throw new Error('Invalid ASN.1 time')
        }
        // ASN1.js normalizes invalid calendar dates; compare to the original value.
        const date = value.toDate()
        const encoded = date.toISOString().replace(/[-:T]/g, '').replace('.000Z', 'Z')
        if ((generalized ? encoded : encoded.slice(2)) !== text) {
            throw new Error('Invalid ASN.1 calendar date')
        }
    }
    if (value.idBlock.isConstructed) {
        for (const child of asn1Children(value)) {
            checkDER(child)
        }
    }
}

export function parseCertificate(data: Uint8Array): Certificate {
    const { AsnParser } = require('@peculiar/asn1-schema') as typeof import('@peculiar/asn1-schema')
    const { Certificate } = require('@peculiar/asn1-x509') as typeof import('@peculiar/asn1-x509')
    const cert = AsnParser.fromASN(parseASN1(data), Certificate)
    const extensions = cert.tbsCertificate.extensions ?? []
    const identifiers = new Set<string>()
    for (const extension of extensions) {
        if (identifiers.has(extension.extnID)) {
            throw new Error('Duplicate X.509 extension')
        }
        identifiers.add(extension.extnID)
    }
    return cert
}

// Node's X509Certificate already handles the certificate itself. Only decode the
// extension envelope here, without initializing the complete X.509 schema set.
export function certificateExtensions(data: Uint8Array): Map<string, Uint8Array> {
    const certificate = parseASN1(data)
    const tbs = asn1Children(certificate)[0]
    const extensions = asn1Children(tbs).find(value => value.idBlock.tagClass === 3 && value.idBlock.tagNumber === 3)
    const result = new Map<string, Uint8Array>()
    if (extensions === undefined) {
        return result
    }
    const sequence = asn1Children(extensions)
    if (sequence.length !== 1 || !(sequence[0] instanceof Sequence)) {
        throw new Error('Invalid X.509 extensions')
    }
    for (const extension of asn1Children(sequence[0])) {
        const fields = asn1Children(extension)
        const value = fields[fields.length - 1]
        if (!(extension instanceof Sequence) || !(fields[0] instanceof ObjectIdentifier) || !(value instanceof OctetString) ||
            (fields.length !== 2 && (fields.length !== 3 || !(fields[1] instanceof Boolean)))) {
            throw new Error('Invalid X.509 extension')
        }
        const oid = fields[0].valueBlock.toString()
        if (result.has(oid)) {
            throw new Error('Duplicate X.509 extension')
        }
        result.set(oid, value.valueBlock.valueHexView)
    }
    return result
}

export function asn1Children(value: AsnType): AsnType[] {
    if (!value.idBlock.isConstructed || !('value' in value.valueBlock && Array.isArray(value.valueBlock.value))) {
        throw new Error('Expected constructed ASN.1 value')
    }
    return (value as Constructed).valueBlock.value
}
