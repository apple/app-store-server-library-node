// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

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
     */
    messageIdentifier?: string
}

export class MessageValidator implements Validator<Message> {
    validate(obj: any): obj is Message {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if ((typeof obj['messageIdentifier'] !== 'undefined') && !(typeof obj['messageIdentifier'] === "string" || obj['messageIdentifier'] instanceof String)) {
            return false
        }
        return true
    }
}
