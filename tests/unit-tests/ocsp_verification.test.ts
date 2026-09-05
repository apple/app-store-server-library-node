// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { X509Certificate } from 'crypto';
import { KEYUTIL, KJUR } from 'jsrsasign';
import * as nodeFetch from 'node-fetch';
import { SignedDataVerifier, VerificationException, VerificationStatus } from '../../jws_verification';
import { Environment } from '../../models/Environment';

class OCSPVerifierTest extends SignedDataVerifier {
    public async checkOCSPStatus(cert: X509Certificate, issuer: X509Certificate): Promise<void> {
        return super.checkOCSPStatus(cert, issuer)
    }
}

describe('OCSP date parsing', () => {
    const verifier = new SignedDataVerifier([], true, Environment.SANDBOX, 'com.example')

    it.each([
        ['20260905033451Z', '2026-09-05T03:34:51.000Z'],
        ['20240229000000Z', '2024-02-29T00:00:00.000Z'],
        ['20000229000000Z', '2000-02-29T00:00:00.000Z'],
        ['00990101000000Z', '0099-01-01T00:00:00.000Z']
    ])('should parse %s in UTC', (input, expected) => {
        expect(verifier['parseX509Date'](input).toISOString()).toBe(expected)
    })

    it.each([
        undefined, null, 20260905033451, '', 'invalid',
        '20260905033451', '20260905033451+0000', '20260905033451.123Z',
        '202609050334Z', '260905033451Z', '20260905033451Z\n',
        '20260005033451Z', '20261305033451Z', '20260900033451Z',
        '20260431033451Z', '20260229033451Z', '21000229000000Z',
        '20260905240000Z', '20260905036000Z', '20260905033460Z'
    ])('should reject invalid GeneralizedTime %p', input => {
        expect(() => verifier['parseX509Date'](input)).toThrow(VerificationException)
        expect(() => verifier['parseX509Date'](input)).toThrow(
            expect.objectContaining({ status: VerificationStatus.FAILURE })
        )
    })
})

describe('OCSP response freshness', () => {
    const now = new Date('2026-09-05T12:00:00Z')
    const responderKeys = KEYUTIL.generateKeypair('EC', 'secp256r1')
    let issuer: X509Certificate
    let leaf: X509Certificate
    let responderPEM: string
    let verifier: OCSPVerifierTest

    beforeAll(() => {
        const issuerKeys = KEYUTIL.generateKeypair('EC', 'secp256r1')
        const leafKeys = KEYUTIL.generateKeypair('EC', 'secp256r1')
        const common = {
            sigalg: 'SHA256withECDSA',
            issuer: { str: '/CN=OCSP Test Issuer' },
            notbefore: '20200101000000Z',
            notafter: '20400101000000Z',
            cakey: issuerKeys.prvKeyObj
        }
        issuer = new X509Certificate(new KJUR.asn1.x509.Certificate({
            ...common,
            serial: { int: 1 },
            subject: { str: '/CN=OCSP Test Issuer' },
            sbjpubkey: issuerKeys.pubKeyObj,
            ext: [{ extname: 'basicConstraints', cA: true }]
        }).getPEM())
        leaf = new X509Certificate(new KJUR.asn1.x509.Certificate({
            ...common,
            serial: { int: 2 },
            subject: { str: '/CN=OCSP Test Leaf' },
            sbjpubkey: leafKeys.pubKeyObj,
            ext: [{ extname: 'authorityInfoAccess', array: [{ ocsp: 'http://ocsp.example.test' }] }]
        }).getPEM())
        responderPEM = new KJUR.asn1.x509.Certificate({
            ...common,
            serial: { int: 3 },
            subject: { str: '/CN=OCSP Test Responder' },
            sbjpubkey: responderKeys.pubKeyObj,
            ext: [{ extname: 'extKeyUsage', array: ['ocspSigning'] }]
        }).getPEM()
    })

    beforeEach(() => {
        jest.useFakeTimers()
        jest.setSystemTime(now)
        jest.spyOn(nodeFetch, 'default')
        verifier = new OCSPVerifierTest([], true, Environment.SANDBOX, 'com.example')
    })

    afterEach(() => {
        jest.useRealTimers()
        jest.restoreAllMocks()
    })

    function mockResponse(thisupdate: string, nextupdate?: string, status = 'good') {
        // Exercise real ASN.1 decoding, responder authorization, and signature verification.
        const response = new (KJUR.asn1.ocsp as any).OCSPResponse({
            resstatus: 0,
            restype: 'ocspBasic',
            respid: { name: { str: '/CN=OCSP Test Responder' } },
            prodat: '20260905120000Z',
            array: [{
                certid: { issuerCert: issuer.toString(), subjectCert: leaf.toString(), alg: 'sha256' },
                status: { status, time: '20260901000000Z' },
                thisupdate,
                nextupdate
            }],
            sigalg: 'SHA256withECDSA',
            reskey: responderKeys.prvKeyObj,
            certs: [responderPEM]
        })
        jest.mocked(nodeFetch.default).mockResolvedValue(new nodeFetch.Response(Buffer.from(response.tohex(), 'hex')))
    }

    it.each([
        ['20260905110000Z', '20260905130000Z'],
        ['20260905120100Z', '20260905130000Z'],
        ['20260905110000Z', '20260905115900Z']
    ])('should accept good responses within clock skew (%s, %s)', async (thisupdate, nextupdate) => {
        mockResponse(thisupdate, nextupdate)
        await expect(verifier.checkOCSPStatus(leaf, issuer)).resolves.toBeUndefined()
    })

    it.each([
        ['expired', '20260905110000Z', '20260905115859Z'],
        ['future-dated', '20260905120101Z', '20260905130000Z'],
        ['invalid thisUpdate', '20260230000000Z', '20260905130000Z'],
        ['invalid nextUpdate', '20260905110000Z', '20260931000000Z'],
        ['missing nextUpdate', '20260905110000Z', undefined]
    ])('should reject %s responses', async (_, thisupdate, nextupdate) => {
        mockResponse(thisupdate as string, nextupdate)
        await expect(verifier.checkOCSPStatus(leaf, issuer)).rejects.toMatchObject({
            status: VerificationStatus.FAILURE
        })
    })

    it.each(['revoked', 'unknown'])('should reject %s status with fresh dates', async status => {
        mockResponse('20260905110000Z', '20260905130000Z', status)
        await expect(verifier.checkOCSPStatus(leaf, issuer)).rejects.toMatchObject({
            status: VerificationStatus.FAILURE
        })
    })
})
