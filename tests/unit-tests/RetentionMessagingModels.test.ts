// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { Response } from "node-fetch";
import { AppStoreServerAPIClient } from "../../index";
import { BulletPoint, BulletPointValidator } from "../../models/BulletPoint";
import { Environment } from "../../models/Environment";
import { GetImageListResponse } from "../../models/GetImageListResponse";
import { GetMessageListResponse } from "../../models/GetMessageListResponse";
import { HeaderPosition } from "../../models/HeaderPosition";
import { ImageState } from "../../models/ImageState";
import { MessageState } from "../../models/MessageState";
import { PerformanceTestResultResponseValidator } from "../../models/PerformanceTestResultResponse";
import { RealtimeUrlRequestValidator } from "../../models/RealtimeUrlRequest";
import { UploadMessageImageValidator } from "../../models/UploadMessageImage";
import { UploadMessageRequestBody, UploadMessageRequestBodyValidator } from "../../models/UploadMessageRequestBody";
import { AlternateProduct, AlternateProductValidator } from "../../models/AlternateProduct";
import { DefaultConfigurationRequest, DefaultConfigurationRequestValidator } from "../../models/DefaultConfigurationRequest";
import { DefaultConfigurationResponseValidator } from "../../models/DefaultConfigurationResponse";
import { PerformanceTestRequest, PerformanceTestRequestValidator } from "../../models/PerformanceTestRequest";
import { PerformanceTestResponseValidator } from "../../models/PerformanceTestResponse";
import { RealtimeUrlRequest } from "../../models/RealtimeUrlRequest";
import { RealtimeUrlResponseValidator } from "../../models/RealtimeUrlResponse";
import { DecodedRealtimeRequestBodyValidator } from "../../models/DecodedRealtimeRequestBody";
import { UploadMessageImage } from "../../models/UploadMessageImage";
import { Validator } from "../../models/Validator";
import { RealtimeResponseBody, RealtimeResponseBodyValidator } from "../../models/RealtimeResponseBody";
import { Message, MessageValidator } from "../../models/Message";
import { PromotionalOffer, PromotionalOfferValidator } from "../../models/PromotionalOffer";
import { PromotionalOfferSignatureV1, PromotionalOfferSignatureV1Validator } from "../../models/PromotionalOfferSignatureV1";
import { AdvancedCommerceInfo, AdvancedCommerceInfoValidator } from "../../models/AdvancedCommerceInfo";
import { BillingPlanType } from "../../models/BillingPlanType";
import { Equals, expectRequestBodyValidation, readFile, RequiredKeys } from "../util";

class RecordingAppStoreServerAPIClient extends AppStoreServerAPIClient {

    public requestCount = 0
    private body: string

    public constructor(body: string) {
        super(readFile('tests/resources/certs/testSigningKey.p8'), "keyId", "issuerId", "bundleId", Environment.LOCAL_TESTING)
        this.body = body
    }

    protected async makeFetchRequest(path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }): Promise<Response> {
        this.requestCount++
        return Promise.resolve(new Response(this.body, { status: 200 }))
    }
}

function bulletPoint(text: string = "Bullet text", altText: string = "Bullet alt text"): BulletPoint {
    return {
        text: text,
        imageIdentifier: "c3d4e5f6-a7b8-9012-c3d4-e5f6a7b89012",
        altText: altText
    }
}

function promotionalOfferSignatureV1(): PromotionalOfferSignatureV1 {
    return {
        encodedSignature: "base64encodedSignature",
        productId: "com.example.product",
        nonce: "d4e5f6a7-b8c9-0123-d4e5-f6a7b8c90123",
        timestamp: 1698148900000,
        keyId: "keyId123",
        offerIdentifier: "offer123",
        appAccountToken: "e5f6a7b8-c9d0-1234-e5f6-a7b8c9d01234"
    }
}

function realtimeResponseBody(): RealtimeResponseBody {
    return {
        message: { messageIdentifier: "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890" },
        alternateProduct: { messageIdentifier: "b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901", productId: "com.example.alternate.product", billingPlanType: BillingPlanType.MONTHLY },
        promotionalOffer: { messageIdentifier: "c3d4e5f6-a7b8-9012-c3d4-e5f6a7b89012", promotionalOfferSignatureV2: "signatureV2", promotionalOfferSignatureV1: promotionalOfferSignatureV1() },
        advancedCommerceInfo: { messageIdentifier: "f6a7b8c9-d0e1-2345-f6a7-b8c9d0e12345", advancedCommerceData: "eyJzaWduZWREYXRhIjoiLi4uIn0=" }
    }
}

function performanceTestResultResponse(): any {
    return JSON.parse(readFile("tests/resources/models/performanceTestResultResponse.json"))
}

describe('Retention Messaging models', () => {

    it('should use the documented PENDING value for ImageState and MessageState', () => {
        expect(ImageState.PENDING).toBe("PENDING")
        expect(ImageState.APPROVED).toBe("APPROVED")
        expect(ImageState.REJECTED).toBe("REJECTED")
        expect(MessageState.PENDING).toBe("PENDING")
        expect(MessageState.APPROVED).toBe("APPROVED")
        expect(MessageState.REJECTED).toBe("REJECTED")
    })

    it('should decode a pending image from getImageList', async () => {
        const client = new RecordingAppStoreServerAPIClient(JSON.stringify({
            imageIdentifiers: [
                { imageIdentifier: "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890", imageState: "PENDING", imageSize: "BULLET_POINT" },
                { imageIdentifier: "b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901", imageState: "REJECTED" }
            ]
        }))

        const response: GetImageListResponse = await client.getImageList()

        expect(response.imageIdentifiers?.length).toBe(2)
        expect(response.imageIdentifiers?.[0].imageState).toBe(ImageState.PENDING)
        expect(response.imageIdentifiers?.[1].imageState).toBe(ImageState.REJECTED)
    })

    it('should decode a pending message from getMessageList', async () => {
        const client = new RecordingAppStoreServerAPIClient(JSON.stringify({
            messageIdentifiers: [
                { messageIdentifier: "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890", messageState: "PENDING" },
                { messageIdentifier: "b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901", messageState: "APPROVED" }
            ]
        }))

        const response: GetMessageListResponse = await client.getMessageList()

        expect(response.messageIdentifiers?.length).toBe(2)
        expect(response.messageIdentifiers?.[0].messageState).toBe(MessageState.PENDING)
        expect(response.messageIdentifiers?.[1].messageState).toBe(MessageState.APPROVED)
    })

    it('should validate a PerformanceTestResultResponse with failures', () => {
        const validator = new PerformanceTestResultResponseValidator()
        expect(validator.validate(performanceTestResultResponse())).toBe(true)

        const emptyFailures = performanceTestResultResponse()
        emptyFailures.failures = {}
        expect(validator.validate(emptyFailures)).toBe(true)
    })

    it('should reject a PerformanceTestResultResponse with missing or malformed failures', () => {
        const validator = new PerformanceTestResultResponseValidator()

        const missingFailures = performanceTestResultResponse()
        delete missingFailures.failures
        expect(validator.validate(missingFailures)).toBe(false)

        const nullFailures = performanceTestResultResponse()
        nullFailures.failures = null
        expect(validator.validate(nullFailures)).toBe(false)

        const arrayFailures = performanceTestResultResponse()
        arrayFailures.failures = [1]
        expect(validator.validate(arrayFailures)).toBe(false)

        const nonNumericFailures = performanceTestResultResponse()
        nonNumericFailures.failures = { "TIMED_OUT": "1" }
        expect(validator.validate(nonNumericFailures)).toBe(false)
    })

    it('should reject getPerformanceTestResults responses without failures', async () => {
        const response = performanceTestResultResponse()
        delete response.failures
        const client = new RecordingAppStoreServerAPIClient(JSON.stringify(response))

        await expect(client.getPerformanceTestResults("c4b87a1d-2e3f-4a5b-9c6d-7e8f9a0b1c2d")).rejects.toThrow("Unexpected response body format")
    })

    it('should validate UploadMessageRequestBody limits', () => {
        const validator = new UploadMessageRequestBodyValidator()
        const valid: UploadMessageRequestBody = {
            header: "h".repeat(66),
            body: "b".repeat(144),
            headerPosition: HeaderPosition.ABOVE_IMAGE,
            image: {
                imageIdentifier: "b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901",
                altText: "a".repeat(150)
            },
            bulletPoints: [bulletPoint(), bulletPoint(), bulletPoint(), bulletPoint(), bulletPoint("t".repeat(66), "a".repeat(150))]
        }
        expect(validator.validate(valid)).toBe(true)
        expect(validator.validate({ header: "Header text", body: "Body text" })).toBe(true)
        expect(validator.validate({ header: "Header text", body: "Body text", bulletPoints: [] })).toBe(true)

        expect(validator.validate({ ...valid, header: "h".repeat(67) })).toBe(false)
        expect(validator.validate({ ...valid, body: "b".repeat(145) })).toBe(false)
        expect(validator.validate({ ...valid, image: { imageIdentifier: "b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901", altText: "a".repeat(151) } })).toBe(false)
        expect(validator.validate({ ...valid, bulletPoints: [bulletPoint(), bulletPoint(), bulletPoint(), bulletPoint(), bulletPoint(), bulletPoint()] })).toBe(false)
        expect(validator.validate({ ...valid, bulletPoints: [bulletPoint("t".repeat(67))] })).toBe(false)
        expect(validator.validate({ ...valid, bulletPoints: [bulletPoint("Bullet text", "a".repeat(151))] })).toBe(false)
        expect(validator.validate({ ...valid, bulletPoints: "not an array" })).toBe(false)
        expect(validator.validate({ ...valid, headerPosition: 1 })).toBe(false)
        expect(validator.validate({ body: "Body text" })).toBe(false)
        expect(validator.validate({ header: "Header text" })).toBe(false)
    })

    it('should count Unicode code points when validating lengths', () => {
        const validator = new UploadMessageRequestBodyValidator()
        expect(validator.validate({ header: "\u{1F600}".repeat(66), body: "Body text" })).toBe(true)
        expect(validator.validate({ header: "\u{1F600}".repeat(67), body: "Body text" })).toBe(false)
    })

    it('should validate BulletPoint and UploadMessageImage required fields', () => {
        const bulletPointValidator = new BulletPointValidator()
        expect(bulletPointValidator.validate(bulletPoint())).toBe(true)
        expect(bulletPointValidator.validate({ text: "Bullet text", altText: "Bullet alt text" })).toBe(false)
        expect(bulletPointValidator.validate({ imageIdentifier: "c3d4e5f6-a7b8-9012-c3d4-e5f6a7b89012", altText: "Bullet alt text" })).toBe(false)
        expect(bulletPointValidator.validate({ text: "Bullet text", imageIdentifier: "c3d4e5f6-a7b8-9012-c3d4-e5f6a7b89012" })).toBe(false)

        const uploadMessageImageValidator = new UploadMessageImageValidator()
        expect(uploadMessageImageValidator.validate({ imageIdentifier: "b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901", altText: "Alt text" })).toBe(true)
        expect(uploadMessageImageValidator.validate({ imageIdentifier: "b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901" })).toBe(false)
        expect(uploadMessageImageValidator.validate({ altText: "Alt text" })).toBe(false)
    })

    it('should validate RealtimeUrlRequest limits', () => {
        const validator = new RealtimeUrlRequestValidator()
        const prefix = "https://example.com/"
        expect(validator.validate({ realtimeURL: prefix + "a".repeat(256 - prefix.length) })).toBe(true)
        expect(validator.validate({ realtimeURL: prefix + "a".repeat(257 - prefix.length) })).toBe(false)
        expect(validator.validate({})).toBe(false)
    })

    it('should not send uploadMessage requests that exceed documented limits', async () => {
        const client = new RecordingAppStoreServerAPIClient("")

        await expect(client.uploadMessage("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890", { header: "h".repeat(67), body: "Body text" })).rejects.toThrow("Unexpected request body format")
        await expect(client.uploadMessage("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890", {
            header: "Header text",
            body: "Body text",
            bulletPoints: [bulletPoint(), bulletPoint(), bulletPoint(), bulletPoint(), bulletPoint(), bulletPoint()]
        })).rejects.toThrow("Unexpected request body format")
        expect(client.requestCount).toBe(0)

        await client.uploadMessage("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890", { header: "h".repeat(66), body: "b".repeat(144), bulletPoints: [bulletPoint()] })
        expect(client.requestCount).toBe(1)
    })

    it('should not send configureRealtimeURL requests that exceed documented limits', async () => {
        const client = new RecordingAppStoreServerAPIClient("")

        await expect(client.configureRealtimeURL({ realtimeURL: "https://example.com/" + "a".repeat(237) })).rejects.toThrow("Unexpected request body format")
        expect(client.requestCount).toBe(0)

        await client.configureRealtimeURL({ realtimeURL: "https://example.com/" + "a".repeat(236) })
        expect(client.requestCount).toBe(1)
    })

    it('should require the fields the documentation marks as required in request bodies', () => {
        const defaultConfigurationRequest: Equals<RequiredKeys<DefaultConfigurationRequest>, 'messageIdentifier'> = true
        const alternateProduct: Equals<RequiredKeys<AlternateProduct>, 'messageIdentifier' | 'productId'> = true
        const uploadMessageRequestBody: Equals<RequiredKeys<UploadMessageRequestBody>, 'header' | 'body'> = true
        const uploadMessageImage: Equals<RequiredKeys<UploadMessageImage>, 'imageIdentifier' | 'altText'> = true
        const bulletPointRequired: Equals<RequiredKeys<BulletPoint>, 'text' | 'imageIdentifier' | 'altText'> = true
        const realtimeUrlRequest: Equals<RequiredKeys<RealtimeUrlRequest>, 'realtimeURL'> = true
        const performanceTestRequest: Equals<RequiredKeys<PerformanceTestRequest>, 'originalTransactionId'> = true

        expect([defaultConfigurationRequest, alternateProduct, uploadMessageRequestBody, uploadMessageImage, bulletPointRequired, realtimeUrlRequest, performanceTestRequest]).not.toContain(false)
    })

    it('should not build a DefaultConfigurationRequest or an AlternateProduct without their required fields', () => {
        // @ts-expect-error
        const defaultConfigurationRequest: DefaultConfigurationRequest = {}
        // @ts-expect-error
        const alternateProduct: AlternateProduct = {
            messageIdentifier: "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890"
        }

        expect(defaultConfigurationRequest.messageIdentifier).toBeUndefined()
        expect(alternateProduct.productId).toBeUndefined()
    })

    it.each([
        ['DefaultConfigurationResponse', new DefaultConfigurationResponseValidator(), 'getDefaultMessageResponse.json', ['messageIdentifier']],
        ['RealtimeUrlResponse', new RealtimeUrlResponseValidator(), 'getRealtimeUrlResponse.json', ['realtimeURL']],
        ['PerformanceTestResponse', new PerformanceTestResponseValidator(), 'performanceTestResponse.json', ['config', 'requestId', 'config.maxConcurrentRequests', 'config.totalRequests', 'config.totalDuration', 'config.responseTimeThreshold', 'config.successRateThreshold']],
        ['PerformanceTestResultResponse', new PerformanceTestResultResponseValidator(), 'performanceTestResultResponse.json', ['config', 'target', 'result', 'successRate', 'numPending', 'responseTimes', 'failures', 'responseTimes.average', 'responseTimes.p50', 'responseTimes.p90', 'responseTimes.p95', 'responseTimes.p99']],
        ['DecodedRealtimeRequestBody', new DecodedRealtimeRequestBodyValidator(), 'decodedRealtimeRequest.json', ['originalTransactionId', 'appAppleId', 'productId', 'userLocale', 'requestIdentifier', 'signedDate', 'environment']],
    ] as [string, Validator<unknown>, string, string[]][])('should reject a %s that lacks a required field', (name, validator, fixture, requiredKeys) => {
        expect(validator.validate(JSON.parse(readFile('tests/resources/models/' + fixture)))).toBe(true)
        for (const requiredKey of requiredKeys) {
            const decoded = JSON.parse(readFile('tests/resources/models/' + fixture))
            const path = requiredKey.split('.')
            const parent = path.slice(0, -1).reduce((obj, key) => obj[key], decoded)
            expect(parent).toHaveProperty(path[path.length - 1])
            delete parent[path[path.length - 1]]
            expect([requiredKey, validator.validate(decoded)]).toEqual([requiredKey, false])
        }
    })
})

describe('Retention Messaging request body validators', () => {
    it.each([
        ['DefaultConfigurationRequest', new DefaultConfigurationRequestValidator(), (): DefaultConfigurationRequest => ({ messageIdentifier: "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890" }), ['messageIdentifier']],
        ['PerformanceTestRequest', new PerformanceTestRequestValidator(), (): PerformanceTestRequest => ({ originalTransactionId: "70000500092808" }), ['originalTransactionId']],
        ['RealtimeResponseBody', new RealtimeResponseBodyValidator(), realtimeResponseBody, []],
        ['Message', new MessageValidator(), (): Message => ({ messageIdentifier: "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890" }), []],
        ['AlternateProduct', new AlternateProductValidator(), (): AlternateProduct => ({ messageIdentifier: "b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901", productId: "com.example.alternate.product", billingPlanType: BillingPlanType.MONTHLY }), ['messageIdentifier', 'productId']],
        ['PromotionalOffer', new PromotionalOfferValidator(), (): PromotionalOffer => realtimeResponseBody().promotionalOffer!, []],
        ['PromotionalOfferSignatureV1', new PromotionalOfferSignatureV1Validator(), promotionalOfferSignatureV1, ['encodedSignature', 'productId', 'nonce', 'timestamp', 'keyId', 'offerIdentifier']],
        ['AdvancedCommerceInfo', new AdvancedCommerceInfoValidator(), (): AdvancedCommerceInfo => realtimeResponseBody().advancedCommerceInfo!, []],
    ] as [string, Validator<unknown>, () => object, string[]][])('should reject a %s that lacks a required field or has a field of the wrong type', (_, validator, completeBody, requiredKeys) => {
        expectRequestBodyValidation(validator, completeBody, requiredKeys)
    })

    it.each([
        ['alternateProduct.productId'],
        ['alternateProduct.messageIdentifier'],
        ['promotionalOffer.promotionalOfferSignatureV1.nonce'],
        ['promotionalOffer.promotionalOfferSignatureV1.timestamp'],
    ])('should reject a RealtimeResponseBody whose nested value lacks the required %s', (requiredKey) => {
        const body: any = realtimeResponseBody()
        const path = requiredKey.split('.')
        const parent = path.slice(0, -1).reduce((obj, key) => obj[key], body)
        expect(parent).toHaveProperty(path[path.length - 1])
        delete parent[path[path.length - 1]]
        expect(new RealtimeResponseBodyValidator().validate(body)).toBe(false)
    })

    it('should accept a RealtimeResponseBody with only one retention message', () => {
        const validator = new RealtimeResponseBodyValidator()
        expect(validator.validate({ message: { messageIdentifier: "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890" } })).toBe(true)
        expect(validator.validate({ alternateProduct: { messageIdentifier: "b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901", productId: "com.example.alternate.product", billingPlanType: "NEW_PLAN_TYPE" } })).toBe(true)
        expect(validator.validate({ promotionalOffer: { promotionalOfferSignatureV2: "signatureV2" } })).toBe(true)
        expect(validator.validate({})).toBe(true)
    })

    it('should not send configureDefaultMessage or initiatePerformanceTest requests without their required fields', async () => {
        const client = new RecordingAppStoreServerAPIClient("")

        await expect(client.configureDefaultMessage("com.example.product", "en-US", {} as DefaultConfigurationRequest)).rejects.toThrow("Unexpected request body format")
        await expect(client.configureDefaultMessage("com.example.product", "en-US", { messageIdentifier: 1 } as unknown as DefaultConfigurationRequest)).rejects.toThrow("Unexpected request body format")
        await expect(client.initiatePerformanceTest({} as PerformanceTestRequest)).rejects.toThrow("Unexpected request body format")
        await expect(client.initiatePerformanceTest(null as unknown as PerformanceTestRequest)).rejects.toThrow("Unexpected request body format")
        expect(client.requestCount).toBe(0)

        await client.configureDefaultMessage("com.example.product", "en-US", { messageIdentifier: "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890" })
        expect(client.requestCount).toBe(1)
    })
})
