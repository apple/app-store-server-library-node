// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { SendAttemptItem, SendAttemptItemValidator } from "./SendAttemptItem";
import { Validator } from "./Validator";

/**
 * A response that contains the contents of the test notification sent by the App Store server and the result from your server.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/checktestnotificationresponse CheckTestNotificationResponse}
 */
export interface CheckTestNotificationResponse {

    /**
     * A cryptographically signed payload, in JSON Web Signature (JWS) format, containing the response body for a version 2 notification.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/signedpayload signedPayload}
     **/
    signedPayload?: string
        
    /**
     * An array of information the App Store server records for its attempts to send the TEST notification to your server. The array may contain a maximum of six sendAttemptItem objects.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/sendattemptitem sendAttemptItem}
     **/
    sendAttempts?: SendAttemptItem[]
}

export class CheckTestNotificationResponseValidator implements Validator<CheckTestNotificationResponse> {
    static readonly sendAttemptItemValidator = new SendAttemptItemValidator()
    validate(obj: any): obj is CheckTestNotificationResponse {
        if ((typeof obj['signedPayload'] !== 'undefined') && !(typeof obj['signedPayload'] === "string" || obj['signedPayload'] instanceof String)) {
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
        return true
    }
}