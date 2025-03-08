// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceInAppRequest, AdvancedCommerceInAppSignatureCreator, IntroductoryOfferEligibilitySignatureCreator, PromotionalOfferV2SignatureCreator } from "../../jws_signature_creator";
import { readFile } from "../util"
import jsonwebtoken = require('jsonwebtoken');

interface TestInAppRequest extends AdvancedCommerceInAppRequest {
    testValue: string
}

describe("JWS Signature Creator Checks", () => {
    it('should create a promotional offer signature', async () => {
        const signatureCreator = new PromotionalOfferV2SignatureCreator(readFile('tests/resources/certs/testSigningKey.p8'), "keyId", "issuerId", "bundleId");
        const signature = signatureCreator.createSignature('productId', 'offerIdentifier', 'transactionId')
        expect(signature).toBeTruthy()
        let header = JSON.parse(Buffer.from(signature.split('.')[0], 'base64url').toString())
        let payload = JSON.parse(Buffer.from(signature.split('.')[1], 'base64url').toString())

        // Header
        expect('JWT').toBe(header['typ'])
        expect('ES256').toBe(header['alg'])
        expect('keyId').toBe(header['kid'])
        // Payload
        expect('issuerId').toBe(payload['iss'])
        expect(payload['iat']).toBeTruthy()
        expect(payload['exp']).toBeUndefined()
        expect('promotional-offer').toBe(payload['aud'])
        expect('bundleId').toBe(payload['bid'])
        expect(payload['nonce']).toBeTruthy()
        expect('productId').toBe(payload['productId'])
        expect('offerIdentifier').toBe(payload['offerIdentifier'])
        expect('transactionId').toBe(payload['transactionId'])
    })

    it('should create a promotional offer signature without a transaction id', async () => {
        const signatureCreator = new PromotionalOfferV2SignatureCreator(readFile('tests/resources/certs/testSigningKey.p8'), "keyId", "issuerId", "bundleId");
        const signature = signatureCreator.createSignature('productId', 'offerIdentifier')
        let payload = JSON.parse(Buffer.from(signature.split('.')[1], 'base64url').toString())
        expect(payload['transactionId']).toBeUndefined()
    })

    it('should create a introductory eligibility offer signature', async () => {
        const signatureCreator = new IntroductoryOfferEligibilitySignatureCreator(readFile('tests/resources/certs/testSigningKey.p8'), "keyId", "issuerId", "bundleId");
        const signature = signatureCreator.createSignature('productId', true, 'transactionId')
        expect(signature).toBeTruthy()
        let header = JSON.parse(Buffer.from(signature.split('.')[0], 'base64url').toString())
        let payload = JSON.parse(Buffer.from(signature.split('.')[1], 'base64url').toString())

        // Header
        expect('JWT').toBe(header['typ'])
        expect('ES256').toBe(header['alg'])
        expect('keyId').toBe(header['kid'])
        // Payload
        expect('issuerId').toBe(payload['iss'])
        expect(payload['iat']).toBeTruthy()
        expect(payload['exp']).toBeUndefined()
        expect('introductory-offer-eligibility').toBe(payload['aud'])
        expect('bundleId').toBe(payload['bid'])
        expect(payload['nonce']).toBeTruthy()
        expect('productId').toBe(payload['productId'])
        expect(true).toBe(payload['allowIntroductoryOffer'])
        expect('transactionId').toBe(payload['transactionId'])
    })

    it('should create an Advanced Commerce in app signature', async () => {
        const signatureCreator = new AdvancedCommerceInAppSignatureCreator(readFile('tests/resources/certs/testSigningKey.p8'), "keyId", "issuerId", "bundleId");
        let request: TestInAppRequest = {
            testValue: "testValue"
        }
        const signature = signatureCreator.createSignature(request)
        expect(signature).toBeTruthy()
        let header = JSON.parse(Buffer.from(signature.split('.')[0], 'base64url').toString())
        let payload = JSON.parse(Buffer.from(signature.split('.')[1], 'base64url').toString())

        // Header
        expect('JWT').toBe(header['typ'])
        expect('ES256').toBe(header['alg'])
        expect('keyId').toBe(header['kid'])
        // Payload
        expect('issuerId').toBe(payload['iss'])
        expect(payload['iat']).toBeTruthy()
        expect(payload['exp']).toBeUndefined()
        expect('advanced-commerce-api').toBe(payload['aud'])
        expect('bundleId').toBe(payload['bid'])
        expect(payload['nonce']).toBeTruthy()
        let parsedRequestJson = Buffer.from(payload['request'], 'base64').toString('utf-8')
        let parsedRequest = JSON.parse(parsedRequestJson)
        expect(parsedRequest['testValue']).toBe('testValue')
    })
})