// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { MessageState, MessageStateValidator } from "./MessageState"
import { Validator } from "./Validator"

/**
 * A message identifier and status information for a message.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/getmessagelistresponseitem GetMessageListResponseItem}
 */
export interface GetMessageListResponseItem {

    /**
     * The identifier of the message.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/messageidentifier messageIdentifier}
     **/
    messageIdentifier?: string

    /**
     * The current state of the message.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/messagestate messageState}
     **/
    messageState?: MessageState | string
}

export class GetMessageListResponseItemValidator implements Validator<GetMessageListResponseItem> {
    static readonly messageStateValidator = new MessageStateValidator()
    validate(obj: any): obj is GetMessageListResponseItem {
        if ((typeof obj['messageIdentifier'] !== 'undefined') && !(typeof obj['messageIdentifier'] === "string" || obj['messageIdentifier'] instanceof String)) {
            return false
        }
        if ((typeof obj['messageState'] !== 'undefined') && !(GetMessageListResponseItemValidator.messageStateValidator.validate(obj['messageState']))) {
            return false
        }
        return true
    }
}
