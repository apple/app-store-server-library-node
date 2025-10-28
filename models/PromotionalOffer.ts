// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { PromotionalOfferSignatureV1 } from "./PromotionalOfferSignatureV1"

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
     **/
    messageIdentifier?: string

    /**
     * The promotional offer signature in V2 format.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/promotionaloffersignaturev2 promotionalOfferSignatureV2}
     **/
    promotionalOfferSignatureV2?: string

    /**
     * The promotional offer signature in V1 format.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/promotionaloffersignaturev1 promotionalOfferSignatureV1}
     **/
    promotionalOfferSignatureV1?: PromotionalOfferSignatureV1
}
