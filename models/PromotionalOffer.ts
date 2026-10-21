// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { PromotionalOfferSignatureV1, PromotionalOfferSignatureV1Validator } from "./PromotionalOfferSignatureV1"
import { Validator } from "./Validator"

/**
 * A promotional offer and message you provide in a real-time response to your Get Retention Message endpoint.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/promotionaloffer promotionalOffer}
 */
export interface PromotionalOffer {

    /**
     * The identifier of the message to display to the customer, along with the promotional offer.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/messageidentifier messageIdentifier}
     */
    messageIdentifier?: string

    /**
     * The promotional offer signature in V2 format.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/promotionaloffersignaturev2 promotionalOfferSignatureV2}
     */
    promotionalOfferSignatureV2?: string

    /**
     * The promotional offer signature in V1 format.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/promotionaloffersignaturev1 promotionalOfferSignatureV1}
     */
    promotionalOfferSignatureV1?: PromotionalOfferSignatureV1
}

export class PromotionalOfferValidator implements Validator<PromotionalOffer> {
    static readonly promotionalOfferSignatureV1Validator = new PromotionalOfferSignatureV1Validator()
    validate(obj: any): obj is PromotionalOffer {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if ((typeof obj['messageIdentifier'] !== 'undefined') && !(typeof obj['messageIdentifier'] === "string" || obj['messageIdentifier'] instanceof String)) {
            return false
        }
        if ((typeof obj['promotionalOfferSignatureV2'] !== 'undefined') && !(typeof obj['promotionalOfferSignatureV2'] === "string" || obj['promotionalOfferSignatureV2'] instanceof String)) {
            return false
        }
        if ((typeof obj['promotionalOfferSignatureV1'] !== 'undefined') && !(PromotionalOfferValidator.promotionalOfferSignatureV1Validator.validate(obj['promotionalOfferSignatureV1']))) {
            return false
        }
        return true
    }
}
