// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * The promotional-offer signature you generate using an earlier signature version.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/promotionaloffersignaturev1 promotionalOfferSignatureV1}
 */
export interface PromotionalOfferSignatureV1 {

    /**
     * The Base64-encoded cryptographic signature you generate using the offer parameters.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/promotionaloffersignaturev1 promotionalOfferSignatureV1}
     */
    encodedSignature: string

    /**
     * The subscription’s product identifier.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/productid productId}
     */
    productId: string

    /**
     * A one-time-use UUID antireplay value you generate.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/promotionaloffersignaturev1 promotionalOfferSignatureV1}
     */
    nonce: string

    /**
     * The UNIX time, in milliseconds, when you generate the signature.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/promotionaloffersignaturev1 promotionalOfferSignatureV1}
     */
    timestamp: number

    /**
     * A string that identifies the private key you use to generate the signature.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/promotionaloffersignaturev1 promotionalOfferSignatureV1}
     */
    keyId: string

    /**
     * The subscription offer identifier that you set up in App Store Connect.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/promotionaloffersignaturev1 promotionalOfferSignatureV1}
     */
    offerIdentifier: string

    /**
     * A UUID that you provide to associate with the transaction if the customer accepts the promotional offer.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/promotionaloffersignaturev1 promotionalOfferSignatureV1}
     */
    appAccountToken?: string
}

export class PromotionalOfferSignatureV1Validator implements Validator<PromotionalOfferSignatureV1> {
    validate(obj: any): obj is PromotionalOfferSignatureV1 {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(typeof obj['encodedSignature'] === "string" || obj['encodedSignature'] instanceof String)) {
            return false
        }
        if (!(typeof obj['productId'] === "string" || obj['productId'] instanceof String)) {
            return false
        }
        if (!(typeof obj['nonce'] === "string" || obj['nonce'] instanceof String)) {
            return false
        }
        if (!(typeof obj['timestamp'] === "number" || obj['timestamp'] instanceof Number)) {
            return false
        }
        if (!(typeof obj['keyId'] === "string" || obj['keyId'] instanceof String)) {
            return false
        }
        if (!(typeof obj['offerIdentifier'] === "string" || obj['offerIdentifier'] instanceof String)) {
            return false
        }
        if ((typeof obj['appAccountToken'] !== 'undefined') && !(typeof obj['appAccountToken'] === "string" || obj['appAccountToken'] instanceof String)) {
            return false
        }
        return true
    }
}
