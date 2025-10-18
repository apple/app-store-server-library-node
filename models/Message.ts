// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

/**
 * A message identifier you provide in a real-time response to your Get Retention Message endpoint.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/message message}
 */
export interface Message {

    /**
     * The identifier of the message to display to the customer.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/messageidentifier messageIdentifier}
     **/
    messageIdentifier?: string
}
