// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { createPublicKey, createVerify } from "crypto";
import { PromotionalOfferSignatureCreator } from "../../promotional_offer";
import { readFile } from "../util"


describe('Promotional Offer Signature Creation Test', () => {
    it('should create a non-null signature', async () => {
        const signatureCreator = new PromotionalOfferSignatureCreator(readFile('tests/resources/certs/testSigningKey.p8'), "keyId", "bundleId");
        const signature = signatureCreator.createSignature('productId', 'offerId', 'appAccountToken', "20fba8a0-2b80-4a7d-a17f-85c1854727f8", 1698148900000)
        expect(signature).toBeTruthy()
    })

    it('should create a signature that verifies with the public key', async () => {
        const signingKey = readFile('tests/resources/certs/testSigningKey.p8')
        const signatureCreator = new PromotionalOfferSignatureCreator(signingKey, "keyId", "bundleId");
        const signature = signatureCreator.createSignature('productId', 'offerId', 'C8F4F5A2-8A3E-4D8C-9B5E-1F2A3B4C5D6E', "20FBA8A0-2B80-4A7D-A17F-85C1854727F8", 1698148900000)
        const payload = 'bundleId' + '\u2063' +
            'keyId' + '\u2063' +
            'productId' + '\u2063' +
            'offerId' + '\u2063' +
            'c8f4f5a2-8a3e-4d8c-9b5e-1f2a3b4c5d6e' + '\u2063' +
            '20fba8a0-2b80-4a7d-a17f-85c1854727f8' + '\u2063' +
            '1698148900000'
        const verifier = createVerify('SHA256')
        verifier.update(payload)
        verifier.end()
        expect(verifier.verify(createPublicKey(signingKey), Buffer.from(signature, 'base64'))).toBe(true)
    })
})