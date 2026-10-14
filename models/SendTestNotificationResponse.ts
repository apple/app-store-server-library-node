// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * A response that contains the test notification token.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/sendtestnotificationresponse SendTestNotificationResponse}
 */
export interface SendTestNotificationResponse {

    /**
     * The test notification token that uniquely identifies the notification test that App Store Server Notifications sends to your server.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/testnotificationtoken testNotificationToken}
     */
    testNotificationToken?: string
}

export class SendTestNotificationResponseValidator implements Validator<SendTestNotificationResponse> {
    validate(obj: any): obj is SendTestNotificationResponse {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if ((typeof obj['testNotificationToken'] !== 'undefined') && !(typeof obj['testNotificationToken'] === "string" || obj['testNotificationToken'] instanceof String)) {
            return false
        }
        return true
    }
}
