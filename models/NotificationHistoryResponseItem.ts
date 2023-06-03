// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { SendAttemptItem, SendAttemptItemValidator } from "./SendAttemptItem"
import { Validator } from "./Validator"

/**
 * The App Store server notification history record, including the signed notification payload and the result of the server’s first send attempt.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/notificationhistoryresponseitem notificationHistoryResponseItem}
 */
export interface NotificationHistoryResponseItem {

    /**
     * A cryptographically signed payload, in JSON Web Signature (JWS) format, containing the response body for a version 2 notification.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/signedpayload signedPayload}
     **/
    signedPayload?: string
        
    /**
     * An array of information the App Store server records for its attempts to send a notification to your server. The maximum number of entries in the array is six.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/sendattemptitem sendAttemptItem}
     **/
    sendAttempts?: SendAttemptItem[]
}

export class NotificationHistoryResponseItemValidator implements Validator<NotificationHistoryResponseItem> {
    static readonly sendAttemptItemValidator = new SendAttemptItemValidator()
    validate(obj: any): boolean {
        if ((typeof obj['signedPayload'] !== 'undefined') && !(typeof obj['signedPayload'] === "string" || obj['signedPayload'] instanceof String)) {
            return false
        }
        if (typeof obj['sendAttempts'] !== 'undefined') {
            if (!Array.isArray(obj['sendAttempts'])) {
                return false
            }
            for (const sendAttempt of obj['sendAttempts']) {
                if (!(NotificationHistoryResponseItemValidator.sendAttemptItemValidator.validate(sendAttempt))) {
                    return false
                }
            }
        }
        return true
    }
}
