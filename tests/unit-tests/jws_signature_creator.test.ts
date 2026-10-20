// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceInAppRequest, AdvancedCommerceInAppSignatureCreator, IntroductoryOfferEligibilitySignatureCreator, PromotionalOfferV2SignatureCreator } from "../../jws_signature_creator";
import { AdvancedCommerceEffective } from "../../models/AdvancedCommerceEffective";
import { AdvancedCommerceOneTimeChargeCreateRequest } from "../../models/AdvancedCommerceOneTimeChargeCreateRequest";
import { AdvancedCommerceSubscriptionModifyInAppRequest } from "../../models/AdvancedCommerceSubscriptionModifyInAppRequest";
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

    it('should create an introductory eligibility offer signature', async () => {
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

    it('should create an Advanced Commerce in app signature for a subscription modify request', async () => {
        const signatureCreator = new AdvancedCommerceInAppSignatureCreator(readFile('tests/resources/certs/testSigningKey.p8'), "keyId", "issuerId", "bundleId");
        let request: AdvancedCommerceSubscriptionModifyInAppRequest = {
            operation: "MODIFY_SUBSCRIPTION",
            version: "1",
            requestInfo: {
                requestReferenceId: "550e8400-e29b-41d4-a716-446655440007"
            },
            descriptors: {
                effective: AdvancedCommerceEffective.IMMEDIATELY,
                description: "description",
                displayName: "display name"
            },
            retainBillingCycle: true,
            transactionId: "transactionId"
        }
        const signature = signatureCreator.createSignature(request)
        let payload = JSON.parse(Buffer.from(signature.split('.')[1], 'base64url').toString())
        let parsedRequest = JSON.parse(Buffer.from(payload['request'], 'base64').toString('utf-8'))
        expect(parsedRequest).toEqual({
            operation: "MODIFY_SUBSCRIPTION",
            version: "1",
            requestInfo: {
                requestReferenceId: "550e8400-e29b-41d4-a716-446655440007"
            },
            descriptors: {
                effective: "IMMEDIATELY",
                description: "description",
                displayName: "display name"
            },
            retainBillingCycle: true,
            transactionId: "transactionId"
        })
    })

    it('should not create an Advanced Commerce in app signature for an invalid request', async () => {
        const signatureCreator = new AdvancedCommerceInAppSignatureCreator(readFile('tests/resources/certs/testSigningKey.p8'), "keyId", "issuerId", "bundleId");
        let request: AdvancedCommerceOneTimeChargeCreateRequest = {
            operation: "CREATE_ONE_TIME_CHARGE",
            version: "1",
            requestInfo: {
                requestReferenceId: "550e8400-e29b-41d4-a716-446655440000"
            },
            currency: "USD",
            item: {
                SKU: "a".repeat(129),
                description: "description",
                displayName: "display name",
                price: 10000
            },
            taxCode: "taxCode"
        }
        expect(() => signatureCreator.createSignature(request)).toThrow(Error)
        request.item.SKU = "a".repeat(128)
        expect(signatureCreator.createSignature(request)).toBeTruthy()
    })

    it('should not create a promotional offer signature without required values', async () => {
        const signatureCreator = new PromotionalOfferV2SignatureCreator(readFile('tests/resources/certs/testSigningKey.p8'), "keyId", "issuerId", "bundleId");
        expect(() => signatureCreator.createSignature(null as any, 'offerIdentifier')).toThrow(Error)
        expect(() => signatureCreator.createSignature('productId', undefined as any)).toThrow(Error)
    })

    it('should not create an introductory eligibility offer signature without required values', async () => {
        const signatureCreator = new IntroductoryOfferEligibilitySignatureCreator(readFile('tests/resources/certs/testSigningKey.p8'), "keyId", "issuerId", "bundleId");
        expect(() => signatureCreator.createSignature(null as any, true, 'transactionId')).toThrow(Error)
        expect(() => signatureCreator.createSignature('productId', null as any, 'transactionId')).toThrow(Error)
        expect(() => signatureCreator.createSignature('productId', true, undefined as any)).toThrow(Error)
    })

    it('should not create an Advanced Commerce in app signature without a request', async () => {
        const signatureCreator = new AdvancedCommerceInAppSignatureCreator(readFile('tests/resources/certs/testSigningKey.p8'), "keyId", "issuerId", "bundleId");
        expect(() => signatureCreator.createSignature(null as any)).toThrow(Error)
        expect(() => signatureCreator.createSignature("request" as any)).toThrow(Error)
    })
})