// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

/**
 * A switch-plan message and product ID you provide in a real-time response to your Get Retention Message endpoint.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/alternateproduct alternateProduct}
 */
export interface AlternateProduct {

    /**
     * The message identifier of the text to display in the switch-plan retention message.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/messageidentifier messageIdentifier}
     **/
    messageIdentifier?: string

    /**
     * The product identifier of the subscription the retention message suggests for your customer to switch to.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/productid productId}
     **/
    productId?: string
}
