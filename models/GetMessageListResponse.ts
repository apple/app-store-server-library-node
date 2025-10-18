// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { GetMessageListResponseItem, GetMessageListResponseItemValidator } from "./GetMessageListResponseItem"
import { Validator } from "./Validator"

/**
 * A response that contains status information for all messages.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/getmessagelistresponse GetMessageListResponse}
 */
export interface GetMessageListResponse {

    /**
     * An array of all message identifiers and their message state.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/getmessagelistresponseitem messageIdentifiers}
     **/
    messageIdentifiers?: GetMessageListResponseItem[]
}

export class GetMessageListResponseValidator implements Validator<GetMessageListResponse> {
    static readonly getMessageListResponseItemValidator = new GetMessageListResponseItemValidator()
    validate(obj: any): obj is GetMessageListResponse {
        if (typeof obj['messageIdentifiers'] !== 'undefined') {
            if (!Array.isArray(obj['messageIdentifiers'])) {
                return false
            }
            for (const messageIdentifier of obj['messageIdentifiers']) {
                if (!(GetMessageListResponseValidator.getMessageListResponseItemValidator.validate(messageIdentifier))) {
                    return false
                }
            }
        }
        return true
    }
}
