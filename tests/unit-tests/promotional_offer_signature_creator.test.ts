// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { PromotionalOfferSignatureCreator } from "../../promotional_offer";
import { readFile } from "../util"


describe('Promotional Offer Signature Creation Test', () => {
    it('should create a non-null signature', async () => {
        const signatureCreator = new PromotionalOfferSignatureCreator(readFile('tests/resources/certs/testSigningKey.p8'), "keyId", "bundleId");
        const signature = signatureCreator.createSignature('productId', 'offerId', 'appAccountToken', "20fba8a0-2b80-4a7d-a17f-85c1854727f8", 1698148900000)
        expect(signature).toBeTruthy()
    })
})