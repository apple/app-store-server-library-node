// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { AlternateProduct } from "./AlternateProduct"
import { Message } from "./Message"
import { PromotionalOffer } from "./PromotionalOffer"

/**
 * A response you provide to choose, in real time, a retention message the system displays to the customer.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/realtimeresponsebody RealtimeResponseBody}
 */
export interface RealtimeResponseBody {

    /**
     * A retention message that's text-based and can include an optional image.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/message message}
     **/
    message?: Message

    /**
     * A retention message with a switch-plan option.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/alternateproduct alternateProduct}
     **/
    alternateProduct?: AlternateProduct

    /**
     * A retention message that includes a promotional offer.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/promotionaloffer promotionalOffer}
     **/
    promotionalOffer?: PromotionalOffer
}
