// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceInfo, AdvancedCommerceInfoValidator } from "./AdvancedCommerceInfo"
import { AlternateProduct, AlternateProductValidator } from "./AlternateProduct"
import { Message, MessageValidator } from "./Message"
import { PromotionalOffer, PromotionalOfferValidator } from "./PromotionalOffer"
import { Validator } from "./Validator"

/**
 * A response you provide to choose, in real time, a retention message the system displays to the customer.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/realtimeresponsebody RealtimeResponseBody}
 */
export interface RealtimeResponseBody {

    /**
     * A retention message that’s text-based and can include an optional image.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/message message}
     */
    message?: Message

    /**
     * A retention message with a switch-plan option.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/alternateproduct alternateProduct}
     */
    alternateProduct?: AlternateProduct

    /**
     * A retention message that includes a promotional offer.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/promotionaloffer promotionalOffer}
     */
    promotionalOffer?: PromotionalOffer

    /**
     * A retention offer or switch plan option.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/advancedcommerceinfo advancedCommerceInfo}
     */
    advancedCommerceInfo?: AdvancedCommerceInfo
}

export class RealtimeResponseBodyValidator implements Validator<RealtimeResponseBody> {
    static readonly messageValidator = new MessageValidator()
    static readonly alternateProductValidator = new AlternateProductValidator()
    static readonly promotionalOfferValidator = new PromotionalOfferValidator()
    static readonly advancedCommerceInfoValidator = new AdvancedCommerceInfoValidator()
    validate(obj: any): obj is RealtimeResponseBody {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if ((typeof obj['message'] !== 'undefined') && !(RealtimeResponseBodyValidator.messageValidator.validate(obj['message']))) {
            return false
        }
        if ((typeof obj['alternateProduct'] !== 'undefined') && !(RealtimeResponseBodyValidator.alternateProductValidator.validate(obj['alternateProduct']))) {
            return false
        }
        if ((typeof obj['promotionalOffer'] !== 'undefined') && !(RealtimeResponseBodyValidator.promotionalOfferValidator.validate(obj['promotionalOffer']))) {
            return false
        }
        if ((typeof obj['advancedCommerceInfo'] !== 'undefined') && !(RealtimeResponseBodyValidator.advancedCommerceInfoValidator.validate(obj['advancedCommerceInfo']))) {
            return false
        }
        return true
    }
}
