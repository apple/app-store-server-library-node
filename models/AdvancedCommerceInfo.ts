// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

/**
 * A response object you provide to present an offer or switch-plan recommendation message.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/advancedcommerceinfo advancedCommerceInfo}
 */
export interface AdvancedCommerceInfo {

    /**
     * The identifier of the message to display to the customer, along with the offer or switch-plan recommendation provided in advancedCommerceData.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/messageidentifier messageIdentifier}
     **/
    messageIdentifier?: string

    /**
     * A Base64-encoded JSON object which contains a JWS describing an offer or switch-plan recommendation.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/advancedcommercedata advancedCommerceData}
     **/
    advancedCommerceData?: string
}
