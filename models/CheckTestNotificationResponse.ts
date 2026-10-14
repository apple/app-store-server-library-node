// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { SendAttemptItem, SendAttemptItemValidator } from "./SendAttemptItem"
import { Validator } from "./Validator"

/**
 * A response that contains the contents of the App Store server’s test notification and the result from your server.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/checktestnotificationresponse CheckTestNotificationResponse}
 */
export interface CheckTestNotificationResponse {

    /**
     * An array of information the App Store server records for its attempts to send the TEST notification to your server.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/sendattemptitem sendAttemptItem}
     */
    sendAttempts?: SendAttemptItem[]

    /**
     * The signed payload, in JWS format, that contains the TEST notification that the App Store server sent to your server.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/signedpayload signedPayload}
     */
    signedPayload?: string
}

export class CheckTestNotificationResponseValidator implements Validator<CheckTestNotificationResponse> {
    static readonly sendAttemptItemValidator = new SendAttemptItemValidator()
    validate(obj: any): obj is CheckTestNotificationResponse {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (typeof obj['sendAttempts'] !== 'undefined') {
            if (!Array.isArray(obj['sendAttempts'])) {
                return false
            }
            for (const sendAttempt of obj['sendAttempts']) {
                if (!(CheckTestNotificationResponseValidator.sendAttemptItemValidator.validate(sendAttempt))) {
                    return false
                }
            }
        }
        if ((typeof obj['signedPayload'] !== 'undefined') && !(typeof obj['signedPayload'] === "string" || obj['signedPayload'] instanceof String)) {
            return false
        }
        return true
    }
}
