// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { RealtimeResponseBody } from "../../models/RealtimeResponseBody";
import { Message } from "../../models/Message";
import { AlternateProduct } from "../../models/AlternateProduct";
import { PromotionalOffer } from "../../models/PromotionalOffer";
import { PromotionalOfferSignatureV1 } from "../../models/PromotionalOfferSignatureV1";

describe('RealtimeResponseBody', () => {
    it('should serialize RealtimeResponseBody with Message', () => {
        // Create a RealtimeResponseBody with a Message
        const messageId = "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890"
        const message: Message = {
            messageIdentifier: messageId
        }
        const responseBody: RealtimeResponseBody = {
            message: message
        }

        // Serialize to JSON
        const json = JSON.stringify(responseBody)
        const jsonObj = JSON.parse(json)

        // Validate JSON structure
        expect(jsonObj).toHaveProperty("message")
        expect(jsonObj.message).toHaveProperty("messageIdentifier")
        expect(jsonObj.message.messageIdentifier).toBe("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890")
        expect(jsonObj).not.toHaveProperty("alternateProduct")
        expect(jsonObj).not.toHaveProperty("promotionalOffer")

        // Deserialize back
        const deserialized: RealtimeResponseBody = JSON.parse(json)

        // Verify
        expect(deserialized.message).toBeDefined()
        expect(deserialized.message?.messageIdentifier).toBe(messageId)
        expect(deserialized.alternateProduct).toBeUndefined()
        expect(deserialized.promotionalOffer).toBeUndefined()
    })

    it('should serialize RealtimeResponseBody with AlternateProduct', () => {
        // Create a RealtimeResponseBody with an AlternateProduct
        const messageId = "b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901"
        const productId = "com.example.alternate.product"
        const alternateProduct: AlternateProduct = {
            messageIdentifier: messageId,
            productId: productId
        }
        const responseBody: RealtimeResponseBody = {
            alternateProduct: alternateProduct
        }

        // Serialize to JSON
        const json = JSON.stringify(responseBody)
        const jsonObj = JSON.parse(json)

        // Validate JSON structure
        expect(jsonObj).toHaveProperty("alternateProduct")
        expect(jsonObj.alternateProduct).toHaveProperty("messageIdentifier")
        expect(jsonObj.alternateProduct).toHaveProperty("productId")
        expect(jsonObj.alternateProduct.messageIdentifier).toBe("b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901")
        expect(jsonObj.alternateProduct.productId).toBe("com.example.alternate.product")
        expect(jsonObj).not.toHaveProperty("message")
        expect(jsonObj).not.toHaveProperty("promotionalOffer")

        // Deserialize back
        const deserialized: RealtimeResponseBody = JSON.parse(json)

        // Verify
        expect(deserialized.message).toBeUndefined()
        expect(deserialized.alternateProduct).toBeDefined()
        expect(deserialized.alternateProduct?.messageIdentifier).toBe(messageId)
        expect(deserialized.alternateProduct?.productId).toBe(productId)
        expect(deserialized.promotionalOffer).toBeUndefined()
    })

    it('should serialize RealtimeResponseBody with PromotionalOffer V2', () => {
        // Create a RealtimeResponseBody with a PromotionalOffer (V2 signature)
        const messageId = "c3d4e5f6-a789-0123-c3d4-e5f6a7890123"
        const signatureV2 = "signature2"
        const promotionalOffer: PromotionalOffer = {
            messageIdentifier: messageId,
            promotionalOfferSignatureV2: signatureV2
        }
        const responseBody: RealtimeResponseBody = {
            promotionalOffer: promotionalOffer
        }

        // Serialize to JSON
        const json = JSON.stringify(responseBody)
        const jsonObj = JSON.parse(json)

        // Validate JSON structure
        expect(jsonObj).toHaveProperty("promotionalOffer")
        expect(jsonObj.promotionalOffer).toHaveProperty("messageIdentifier")
        expect(jsonObj.promotionalOffer).toHaveProperty("promotionalOfferSignatureV2")
        expect(jsonObj.promotionalOffer.messageIdentifier).toBe("c3d4e5f6-a789-0123-c3d4-e5f6a7890123")
        expect(jsonObj.promotionalOffer.promotionalOfferSignatureV2).toBe("signature2")
        expect(jsonObj.promotionalOffer).not.toHaveProperty("promotionalOfferSignatureV1")
        expect(jsonObj).not.toHaveProperty("message")
        expect(jsonObj).not.toHaveProperty("alternateProduct")

        // Deserialize back
        const deserialized: RealtimeResponseBody = JSON.parse(json)

        // Verify
        expect(deserialized.message).toBeUndefined()
        expect(deserialized.alternateProduct).toBeUndefined()
        expect(deserialized.promotionalOffer).toBeDefined()
        expect(deserialized.promotionalOffer?.messageIdentifier).toBe(messageId)
        expect(deserialized.promotionalOffer?.promotionalOfferSignatureV2).toBe(signatureV2)
        expect(deserialized.promotionalOffer?.promotionalOfferSignatureV1).toBeUndefined()
    })

    it('should serialize RealtimeResponseBody with PromotionalOffer V1', () => {
        // Create a RealtimeResponseBody with a PromotionalOffer (V1 signature)
        const messageId = "d4e5f6a7-8901-2345-d4e5-f6a789012345"
        const nonce = "e5f6a789-0123-4567-e5f6-a78901234567"
        const appAccountToken = "f6a78901-2345-6789-f6a7-890123456789"
        const signatureV1: PromotionalOfferSignatureV1 = {
            encodedSignature: "base64encodedSignature",
            productId: "com.example.product",
            nonce: nonce,
            timestamp: 1698148900000,
            keyId: "keyId123",
            offerIdentifier: "offer123",
            appAccountToken: appAccountToken
        }

        const promotionalOffer: PromotionalOffer = {
            messageIdentifier: messageId,
            promotionalOfferSignatureV1: signatureV1
        }
        const responseBody: RealtimeResponseBody = {
            promotionalOffer: promotionalOffer
        }

        // Serialize to JSON
        const json = JSON.stringify(responseBody)
        const jsonObj = JSON.parse(json)

        // Validate JSON structure
        expect(jsonObj).toHaveProperty("promotionalOffer")
        expect(jsonObj.promotionalOffer).toHaveProperty("messageIdentifier")
        expect(jsonObj.promotionalOffer).toHaveProperty("promotionalOfferSignatureV1")
        expect(jsonObj.promotionalOffer.messageIdentifier).toBe("d4e5f6a7-8901-2345-d4e5-f6a789012345")

        const v1Node = jsonObj.promotionalOffer.promotionalOfferSignatureV1
        expect(v1Node).toHaveProperty("encodedSignature")
        expect(v1Node).toHaveProperty("productId")
        expect(v1Node).toHaveProperty("nonce")
        expect(v1Node).toHaveProperty("timestamp")
        expect(v1Node).toHaveProperty("keyId")
        expect(v1Node).toHaveProperty("offerIdentifier")
        expect(v1Node).toHaveProperty("appAccountToken")
        expect(v1Node.encodedSignature).toBe("base64encodedSignature")
        expect(v1Node.productId).toBe("com.example.product")
        expect(v1Node.nonce).toBe("e5f6a789-0123-4567-e5f6-a78901234567")
        expect(v1Node.timestamp).toBe(1698148900000)
        expect(v1Node.keyId).toBe("keyId123")
        expect(v1Node.offerIdentifier).toBe("offer123")
        expect(v1Node.appAccountToken).toBe("f6a78901-2345-6789-f6a7-890123456789")

        expect(jsonObj.promotionalOffer).not.toHaveProperty("promotionalOfferSignatureV2")
        expect(jsonObj).not.toHaveProperty("message")
        expect(jsonObj).not.toHaveProperty("alternateProduct")

        // Deserialize back
        const deserialized: RealtimeResponseBody = JSON.parse(json)

        // Verify
        expect(deserialized.message).toBeUndefined()
        expect(deserialized.alternateProduct).toBeUndefined()
        expect(deserialized.promotionalOffer).toBeDefined()
        expect(deserialized.promotionalOffer?.messageIdentifier).toBe(messageId)
        expect(deserialized.promotionalOffer?.promotionalOfferSignatureV2).toBeUndefined()
        expect(deserialized.promotionalOffer?.promotionalOfferSignatureV1).toBeDefined()

        const deserializedV1 = deserialized.promotionalOffer?.promotionalOfferSignatureV1
        expect(deserializedV1?.productId).toBe("com.example.product")
        expect(deserializedV1?.offerIdentifier).toBe("offer123")
        expect(deserializedV1?.nonce).toBe(nonce)
        expect(deserializedV1?.timestamp).toBe(1698148900000)
        expect(deserializedV1?.keyId).toBe("keyId123")
        expect(deserializedV1?.appAccountToken).toBe(appAccountToken)
        expect(deserializedV1?.encodedSignature).toBe("base64encodedSignature")
    })

    it('should serialize RealtimeResponseBody with correct field names', () => {
        // Test that JSON serialization uses correct field names
        const messageId = "12345678-1234-1234-1234-123456789012"
        const message: Message = {
            messageIdentifier: messageId
        }
        const responseBody: RealtimeResponseBody = {
            message: message
        }

        const json = JSON.stringify(responseBody)

        // Verify JSON contains correct field names
        expect(json).toContain('"message"')
        expect(json).toContain('"messageIdentifier"')
        expect(json).toContain('"12345678-1234-1234-1234-123456789012"')
    })
})
