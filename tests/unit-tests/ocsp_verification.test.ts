// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AsnParser, AsnSerializer, OctetString } from '@peculiar/asn1-schema';
import { ExtendedKeyUsage, KeyUsage, KeyUsageFlags } from '@peculiar/asn1-x509';
import { BasicOCSPResponse, CertStatus, OCSPRequest, OCSPResponse, OCSPResponseStatus, ResponseData, RevokedInfo } from '@peculiar/asn1-ocsp';
import { X509Certificate, generateKeyPairSync, sign } from 'crypto';
import { BitString, Constructed, Integer, fromBER } from 'asn1js';
import { Response } from 'node-fetch';
import jsonwebtoken = require('jsonwebtoken');
import { SignedDataVerifier, VerificationStatus } from '../../jws_verification';
import { Environment } from '../../models/Environment';
import { OCSP_TEST_DATE, createOCSPFixtures, createTestCertificate, extension, signOCSPResponse, testCertID, testResponseData } from '../ocsp_fixtures';

const mockFetch = jest.spyOn(require('node-fetch') as typeof import('node-fetch'), 'default')

class OCSPVerifier extends SignedDataVerifier {
    public checkOCSPStatus(cert: X509Certificate, issuer: X509Certificate): Promise<void> {
        return super.checkOCSPStatus(cert, issuer)
    }
}

describe('OCSP verification', () => {
    const fixtures = createOCSPFixtures()
    const { root, intermediate, leaf, responder } = fixtures
    const rsaResponder = createTestCertificate('RSA responder', 8, intermediate, [extension('2.5.29.37', AsnSerializer.serialize(new ExtendedKeyUsage(['1.3.6.1.5.5.7.3.9'])))], generateKeyPairSync('rsa', { modulusLength: 2048 }))
    let verifier: OCSPVerifier
    let data: ResponseData

    beforeEach(() => {
        jest.useFakeTimers().setSystemTime(OCSP_TEST_DATE)
        mockFetch.mockReset()
        verifier = new OCSPVerifier([root.certificate.raw], true, Environment.SANDBOX, 'com.example')
        data = testResponseData(leaf, intermediate, responder)
    })
    afterEach(() => jest.useRealTimers())

    function respond(buffer: Buffer) {
        mockFetch.mockResolvedValue(new Response(buffer))
    }
    function check() {
        return verifier.checkOCSPStatus(leaf.certificate, intermediate.certificate)
    }

    it.each([false, true])('accepts a delegated responder, byName=%s', async byName => {
        data = testResponseData(leaf, intermediate, responder, byName)
        respond(signOCSPResponse(data, responder))
        await expect(check()).resolves.toBeUndefined()
        const request = AsnParser.parse(mockFetch.mock.calls[0][1]?.body as Buffer, OCSPRequest)
        expect(request.tbsRequest.requestList).toHaveLength(1)
        expect(Buffer.from(AsnSerializer.serialize(request.tbsRequest.requestList[0].reqCert))).toEqual(Buffer.from(AsnSerializer.serialize(testCertID(leaf, intermediate))))
    })

    it.each([false, true])('accepts an issuer signature without embedded certificates, byName=%s', async byName => {
        respond(signOCSPResponse(testResponseData(leaf, intermediate, intermediate, byName), intermediate, false))
        await expect(check()).resolves.toBeUndefined()
    })

    it.each(['sha256', 'sha384', 'sha512'] as const)('preserves EC and RSA OCSP signatures using %s', async hash => {
        for (const signer of [responder, rsaResponder]) {
            respond(signOCSPResponse(testResponseData(leaf, intermediate, signer), signer, true, hash))
            await expect(check()).resolves.toBeUndefined()
        }
    })

    it('verifies the original signed ResponseData rather than its re-encoding', async () => {
        const outer = AsnParser.parse(signOCSPResponse(data, responder), OCSPResponse)
        const basic = fromBER(outer.responseBytes!.response.buffer).result as Constructed
        const responseData = basic.valueBlock.value[0] as Constructed
        // An explicitly encoded default version is omitted when the schema is re-encoded.
        responseData.valueBlock.value.unshift(new Constructed({ idBlock: { tagClass: 3, tagNumber: 0 }, value: [new Integer({ value: 0 })] }))
        basic.valueBlock.value[2] = new BitString({ valueHex: new Uint8Array(sign('sha256', Buffer.from(responseData.toBER()), responder.privateKey)).buffer })
        outer.responseBytes!.response = new OctetString(basic.toBER())
        respond(Buffer.from(AsnSerializer.serialize(outer)))
        await expect(check()).resolves.toBeUndefined()
    })

    it.each(['revoked', 'unknown'])('rejects %s status', async status => {
        data.responses[0].certStatus = status === 'revoked' ? new CertStatus({ revoked: new RevokedInfo({ revocationTime: OCSP_TEST_DATE }) }) : new CertStatus({ unknown: null })
        respond(signOCSPResponse(data, responder))
        await expect(check()).rejects.toMatchObject({ status: VerificationStatus.FAILURE })
    })

    it.each(['serialNumber', 'issuerNameHash', 'issuerKeyHash', 'hashAlgorithm'])('rejects a mismatched CertID %s', async field => {
        const id = data.responses[0].certID
        if (field === 'serialNumber') id.serialNumber = new Uint8Array([99]).buffer
        if (field === 'issuerNameHash') id.issuerNameHash = new OctetString(new Uint8Array(32))
        if (field === 'issuerKeyHash') id.issuerKeyHash = new OctetString(new Uint8Array(32))
        if (field === 'hashAlgorithm') id.hashAlgorithm.algorithm = '1.3.14.3.2.26'
        respond(signOCSPResponse(data, responder))
        await expect(check()).rejects.toMatchObject({ status: VerificationStatus.FAILURE })
    })

    it.each(['stale', 'future', 'missing nextUpdate', 'reversed interval', 'future producedAt'])('rejects %s freshness', async condition => {
        const single = data.responses[0]
        if (condition === 'stale') single.nextUpdate = new Date(OCSP_TEST_DATE.getTime() - 60_001)
        if (condition === 'future') single.thisUpdate = new Date(OCSP_TEST_DATE.getTime() + 60_001)
        if (condition === 'missing nextUpdate') single.nextUpdate = undefined
        if (condition === 'reversed interval') single.nextUpdate = new Date(single.thisUpdate.getTime() - 1)
        if (condition === 'future producedAt') data.producedAt = new Date(OCSP_TEST_DATE.getTime() + 60_001)
        respond(signOCSPResponse(data, responder))
        await expect(check()).rejects.toMatchObject({ status: VerificationStatus.FAILURE })
    })

    it.each([-60_000, 60_000])('accepts the clock skew boundary %s', async offset => {
        data.responses[0].thisUpdate = new Date(OCSP_TEST_DATE.getTime() + offset)
        if (offset < 0) data.responses[0].nextUpdate = new Date(OCSP_TEST_DATE.getTime() + offset)
        respond(signOCSPResponse(data, responder))
        await expect(check()).resolves.toBeUndefined()
    })

    it.each(['unrelated issuer', 'missing EKU', 'wrong EKU', 'wrong key usage', 'expired'])('rejects responder with %s', async condition => {
        const eku = extension('2.5.29.37', AsnSerializer.serialize(new ExtendedKeyUsage(['1.3.6.1.5.5.7.3.9'])))
        const extensions = condition === 'missing EKU' ? [] : [eku]
        if (condition === 'wrong EKU') eku.extnValue = new OctetString(AsnSerializer.serialize(new ExtendedKeyUsage(['1.3.6.1.5.5.7.3.1'])))
        if (condition === 'wrong key usage') extensions.push(extension('2.5.29.15', AsnSerializer.serialize(new KeyUsage(KeyUsageFlags.keyEncipherment))))
        const signer = createTestCertificate('Unauthorized', 9, condition === 'unrelated issuer' ? root : intermediate, extensions)
        data = testResponseData(leaf, intermediate, signer)
        respond(signOCSPResponse(data, signer))
        if (condition === 'expired') jest.setSystemTime(new Date('2034-01-01T00:00:00Z'))
        await expect(check()).rejects.toMatchObject({ status: VerificationStatus.INVALID_CERTIFICATE })
    })

    it('rejects duplicate extensions in an already decoded embedded responder certificate', async () => {
        const eku = extension('2.5.29.37', AsnSerializer.serialize(new ExtendedKeyUsage(['1.3.6.1.5.5.7.3.9'])))
        const duplicate = extension('1.2.3.4', new Uint8Array([5, 0]).buffer)
        const signer = createTestCertificate('Duplicate responder', 11, intermediate, [eku, duplicate, duplicate])
        respond(signOCSPResponse(testResponseData(leaf, intermediate, signer), signer))
        await expect(check()).rejects.toMatchObject({ status: VerificationStatus.FAILURE })
    })

    it.each(['wrong signature', 'unsupported algorithm', 'unsuccessful', 'wrong response type', 'missing responder', 'critical extension'])('rejects %s', async condition => {
        const encoded = AsnParser.parse(signOCSPResponse(data, responder), OCSPResponse)
        const basic = AsnParser.parse(encoded.responseBytes!.response.buffer, BasicOCSPResponse)
        if (condition === 'wrong signature') new Uint8Array(basic.signature)[10] ^= 1
        if (condition === 'unsupported algorithm') basic.signatureAlgorithm.algorithm = '1.2.840.10045.4.1'
        if (condition === 'unsuccessful') encoded.responseStatus = OCSPResponseStatus.tryLater
        if (condition === 'wrong response type') encoded.responseBytes!.responseType = '1.2.3.4'
        if (condition === 'missing responder') basic.certs = undefined
        if (condition === 'critical extension') {
            const critical = extension('1.2.3.4', new Uint8Array([5, 0]).buffer)
            critical.critical = true
            data.responseExtensions = [critical]
            respond(signOCSPResponse(data, responder))
        } else {
            encoded.responseBytes!.response = new OctetString(AsnSerializer.serialize(basic))
            respond(Buffer.from(AsnSerializer.serialize(encoded)))
        }
        await expect(check()).rejects.toMatchObject({ status: VerificationStatus.FAILURE })
    })

    it.each(['truncated', 'trailing bytes', 'invalid calendar'])('rejects %s ASN.1', async condition => {
        let buffer = signOCSPResponse(data, responder)
        if (condition === 'truncated') buffer = buffer.subarray(0, buffer.length - 1)
        if (condition === 'trailing bytes') buffer = Buffer.concat([buffer, Buffer.from([0])])
        if (condition === 'invalid calendar') buffer = Buffer.from(buffer.toString('hex').replace(Buffer.from('20261014120000Z').toString('hex'), Buffer.from('20260230120000Z').toString('hex')), 'hex')
        respond(buffer)
        await expect(check()).rejects.toMatchObject({ status: VerificationStatus.FAILURE })
    })

    it.each(['fetch', 'HTTP', 'body', 'timeout'])('classifies %s network failure as retryable', async condition => {
        if (condition === 'fetch' || condition === 'timeout') mockFetch.mockRejectedValue(new Error(condition))
        if (condition === 'HTTP') mockFetch.mockResolvedValue(new Response('', { status: 503 }))
        if (condition === 'body') mockFetch.mockResolvedValue({ ok: true, arrayBuffer: () => Promise.reject(new Error('connection reset')) } as Response)
        await expect(check()).rejects.toMatchObject({ status: VerificationStatus.RETRYABLE_VERIFICATION_FAILURE })
    })

    it.each(['malformed', 'duplicate'])('rejects a signed leaf with a %s Apple extension', async condition => {
        const oid = '1.2.840.113635.100.6.11.1'
        const extensions = [...leaf.asn.tbsCertificate.extensions!].filter(ext => ext.extnID !== oid)
        extensions.push(extension(oid, new Uint8Array(condition === 'malformed' ? [5] : [5, 0]).buffer))
        if (condition === 'duplicate') extensions.push(extension(oid, new Uint8Array([5, 0]).buffer))
        const badLeaf = createTestCertificate('Bad leaf', 10, intermediate, extensions)
        const jwt = jsonwebtoken.sign({ bundleId: 'com.example', environment: Environment.SANDBOX, signedDate: OCSP_TEST_DATE.getTime() }, badLeaf.privateKey,
            { algorithm: 'ES256', header: { alg: 'ES256', x5c: [badLeaf, intermediate, root].map(c => c.certificate.raw.toString('base64')) } })
        const offline = new SignedDataVerifier([root.certificate.raw], false, Environment.SANDBOX, 'com.example')
        await expect(offline.verifyAndDecodeTransaction(jwt)).rejects.toMatchObject({ status: VerificationStatus.VERIFICATION_FAILURE })
    })

    it('verifies a complete signed transaction including both OCSP responses and the cache', async () => {
        mockFetch.mockImplementation(async (_, options) => {
            const request = AsnParser.parse(options!.body as Buffer, OCSPRequest)
            const leafRequest = Buffer.from(request.tbsRequest.requestList[0].reqCert.serialNumber).equals(Buffer.from(leaf.asn.tbsCertificate.serialNumber))
            return new Response(leafRequest ? signOCSPResponse(testResponseData(leaf, intermediate, responder), responder) : signOCSPResponse(testResponseData(intermediate, root), root, false))
        })
        const jwt = jsonwebtoken.sign({ bundleId: 'com.example', environment: Environment.SANDBOX, signedDate: OCSP_TEST_DATE.getTime() }, leaf.privateKey, { algorithm: 'ES256', header: { alg: 'ES256', x5c: [leaf, intermediate, root].map(c => c.certificate.raw.toString('base64')) } })
        await expect(verifier.verifyAndDecodeTransaction(jwt)).resolves.toMatchObject({ bundleId: 'com.example' })
        await expect(verifier.verifyAndDecodeTransaction(jwt)).resolves.toMatchObject({ bundleId: 'com.example' })
        expect(mockFetch).toHaveBeenCalledTimes(2)
        const wrongSignature = jsonwebtoken.sign({ bundleId: 'com.example', environment: Environment.SANDBOX }, responder.privateKey, { algorithm: 'ES256', header: { alg: 'ES256', x5c: [leaf, intermediate, root].map(c => c.certificate.raw.toString('base64')) } })
        await expect(verifier.verifyAndDecodeTransaction(wrongSignature)).rejects.toMatchObject({ status: VerificationStatus.VERIFICATION_FAILURE })
    })

    it('supports a callable CommonJS fetch shim and standard arrayBuffer response bodies', async () => {
        const actual = jest.requireActual('node-fetch') as typeof import('node-fetch')
        const shim = jest.fn(async (url: string, options: import('node-fetch').RequestInit) => {
            if (url.startsWith('https://')) return new actual.Response('{}')
            const request = AsnParser.parse(options.body as Buffer, OCSPRequest)
            const leafRequest = Buffer.from(request.tbsRequest.requestList[0].reqCert.serialNumber).equals(Buffer.from(leaf.asn.tbsCertificate.serialNumber))
            const response = new actual.Response(leafRequest ? signOCSPResponse(testResponseData(leaf, intermediate, responder), responder) : signOCSPResponse(testResponseData(intermediate, root), root, false))
            // Web-standard Response does not implement node-fetch's buffer() extension.
            return { ok: true, arrayBuffer: () => response.arrayBuffer() }
        })
        jest.doMock('node-fetch', () => Object.assign(shim, { Headers: actual.Headers }))
        try {
            await jest.isolateModulesAsync(async () => {
                const { SignedDataVerifier } = await import('../../jws_verification')
                const { AppStoreServerAPIClient } = await import('../../index')
                const verifier = new SignedDataVerifier([root.certificate.raw], true, Environment.SANDBOX, 'com.example')
                const jwt = jsonwebtoken.sign({ bundleId: 'com.example', environment: Environment.SANDBOX }, leaf.privateKey,
                    { algorithm: 'ES256', header: { alg: 'ES256', x5c: [leaf, intermediate, root].map(c => c.certificate.raw.toString('base64')) } })
                await expect(verifier.verifyAndDecodeTransaction(jwt)).resolves.toMatchObject({ bundleId: 'com.example' })
                class Client extends AppStoreServerAPIClient {
                    public request() { return this.makeFetchRequest('/test', new URLSearchParams(), 'GET', undefined, {}) }
                }
                const client = new Client(leaf.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(), 'key', 'issuer', 'com.example', Environment.SANDBOX)
                await expect((await client.request()).json()).resolves.toEqual({})
                expect(shim).toHaveBeenCalledTimes(3)
            })
        } finally {
            jest.dontMock('node-fetch')
        }
    })
})
