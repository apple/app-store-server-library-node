// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { SendAttemptResult, SendAttemptResultValidator } from "./SendAttemptResult";
import { Validator } from "./Validator"

/**
 * The success or error information and the date the App Store server records when it attempts to send a server notification to your server.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/sendattemptitem sendAttemptItem}
 */
export interface SendAttemptItem {

    /**
     * The date the App Store server attempts to send a notification.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/attemptdate attemptDate}
     **/
    attemptDate?: number
    
    /**
     * The success or error information the App Store server records when it attempts to send an App Store server notification to your server.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/sendattemptresult sendAttemptResult}
     **/
    sendAttemptResult?: SendAttemptResult
}

export class SendAttemptItemValidator implements Validator<SendAttemptItem> {
    static readonly sendAttemptResultValidator = new SendAttemptResultValidator()
    validate(obj: any): boolean {
        if ((typeof obj['attemptDate'] !== 'undefined') && !(typeof obj['attemptDate'] === "number")) {
            return false
        }
        if ((typeof obj['sendAttemptResult'] !== 'undefined') && !SendAttemptItemValidator.sendAttemptResultValidator.validate(obj['sendAttemptResult'])) {
            return false
        }
        return true
    }
}
