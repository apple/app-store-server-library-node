// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AsnParser } from '@peculiar/asn1-schema';
import { OCSPRequest } from '@peculiar/asn1-ocsp';
import { KeyObject, X509Certificate } from 'crypto';
import { Response } from 'node-fetch';
import { Environment } from '../../models/Environment';
import { SignedDataVerifier, VerificationStatus } from '../../jws_verification';
import { OCSP_TEST_DATE, createOCSPFixtures, signOCSPResponse, testResponseData } from '../ocsp_fixtures';

const mockFetch = jest.spyOn(require('node-fetch') as typeof import('node-fetch'), 'default')

class CacheVerifier extends SignedDataVerifier {
    public verifyCertificateChainWithoutCaching(roots: X509Certificate[], leaf: X509Certificate, intermediate: X509Certificate, date: Date): Promise<KeyObject> {
        return super.verifyCertificateChainWithoutCaching(roots, leaf, intermediate, date)
    }
    public check(roots: X509Certificate[], leaf: X509Certificate, intermediate: X509Certificate): Promise<KeyObject> {
        return this.verifyCertificateChain(roots, leaf, intermediate, new Date())
    }
    public seedCache(publicKey: KeyObject, expired: boolean) {
        for (let i = 0; i < 32; i++) this.verifiedPublicKeyCache['seed' + i] = { publicKey, cacheExpiry: Date.now() + (expired ? -1 : 3_600_000) }
    }
    public cacheSize() { return Object.keys(this.verifiedPublicKeyCache).length }
}

describe('Verified certificate cache', () => {
    const { root, intermediate, leaf, responder } = createOCSPFixtures()
    let verifier: CacheVerifier
    beforeEach(() => {
        jest.useFakeTimers().setSystemTime(OCSP_TEST_DATE)
        mockFetch.mockReset()
        verifier = new CacheVerifier([root.certificate.raw], true, Environment.SANDBOX, 'com.example')
        mockFetch.mockImplementation(async (_, options) => {
            const request = AsnParser.parse(options!.body as Buffer, OCSPRequest)
            const isLeaf = Buffer.from(request.tbsRequest.requestList[0].reqCert.serialNumber).equals(Buffer.from(leaf.asn.tbsCertificate.serialNumber))
            const data = isLeaf ? testResponseData(leaf, intermediate, responder) : testResponseData(intermediate, root)
            data.responses[0].nextUpdate = new Date(OCSP_TEST_DATE.getTime() + 120_000)
            return new Response(signOCSPResponse(data, isLeaf ? responder : root, isLeaf))
        })
    })
    afterEach(() => jest.useRealTimers())

    function check() { return verifier.check([root.certificate], leaf.certificate, intermediate.certificate) }

    it('rechecks OCSP after nextUpdate plus allowed skew, before the 15 minute TTL', async () => {
        await check()
        jest.setSystemTime(OCSP_TEST_DATE.getTime() + 179_999)
        await check()
        expect(mockFetch).toHaveBeenCalledTimes(2)
        jest.setSystemTime(OCSP_TEST_DATE.getTime() + 180_001)
        await expect(check()).rejects.toMatchObject({ status: VerificationStatus.FAILURE })
        expect(mockFetch).toHaveBeenCalledTimes(4)
    })

    it.each([false, true])('bounds the cache and evicts expired=%s entries without an index lookup error', async expired => {
        verifier.seedCache(leaf.certificate.publicKey, expired)
        await expect(check()).resolves.toBeDefined()
        expect(verifier.cacheSize()).toBeLessThanOrEqual(32)
        if (expired) expect(verifier.cacheSize()).toEqual(1)
    })

    it('does not reuse verification with different trusted roots', async () => {
        await check()
        await expect(verifier.check([], leaf.certificate, intermediate.certificate)).rejects.toMatchObject({ status: VerificationStatus.VERIFICATION_FAILURE })
    })

    it('does not reuse verification past certificate expiration', async () => {
        jest.spyOn(verifier, 'verifyCertificateChainWithoutCaching').mockResolvedValue(leaf.certificate.publicKey)
        const expires = new Date(leaf.certificate.validTo).getTime() + 60_000
        jest.setSystemTime(expires - 1)
        await check()
        jest.setSystemTime(expires + 1)
        await check()
        expect(verifier.verifyCertificateChainWithoutCaching).toHaveBeenCalledTimes(2)
    })
})
