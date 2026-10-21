// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * A response that indicates the current status of a request to extend the subscription renewal date to all eligible subscribers.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/massextendrenewaldatestatusresponse MassExtendRenewalDateStatusResponse}
 */
export interface MassExtendRenewalDateStatusResponse {

    /**
     * The UUID that represents your request for a subscription-renewal-date extension.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/requestidentifier requestIdentifier}
     */
    requestIdentifier?: string

    /**
     * A Boolean value that’s TRUE to indicate that the App Store completed your request to extend a subscription renewal date for all eligible subscribers.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/complete complete}
     */
    complete?: boolean

    /**
     * The date that the App Store completes the request.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/completedate completeDate}
     */
    completeDate?: number

    /**
     * The final count of subscribers that fail to receive a subscription-renewal-date extension.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/failedcount failedCount}
     */
    failedCount?: number

    /**
     * The final count of subscribers that successfully receive a subscription-renewal-date extension.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/succeededcount succeededCount}
     */
    succeededCount?: number
}

export class MassExtendRenewalDateStatusResponseValidator implements Validator<MassExtendRenewalDateStatusResponse> {
    private static readonly MAXIMUM_REQUEST_IDENTIFIER_LENGTH = 128
    validate(obj: any): obj is MassExtendRenewalDateStatusResponse {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if ((typeof obj['requestIdentifier'] !== 'undefined') && !((typeof obj['requestIdentifier'] === "string" || obj['requestIdentifier'] instanceof String) && [...obj['requestIdentifier']].length <= MassExtendRenewalDateStatusResponseValidator.MAXIMUM_REQUEST_IDENTIFIER_LENGTH)) {
            return false
        }
        if ((typeof obj['complete'] !== 'undefined') && !(typeof obj['complete'] === "boolean" || obj['complete'] instanceof Boolean)) {
            return false
        }
        if ((typeof obj['completeDate'] !== 'undefined') && !(typeof obj['completeDate'] === "number" || obj['completeDate'] instanceof Number)) {
            return false
        }
        if ((typeof obj['failedCount'] !== 'undefined') && !(typeof obj['failedCount'] === "number" || obj['failedCount'] instanceof Number)) {
            return false
        }
        if ((typeof obj['succeededCount'] !== 'undefined') && !(typeof obj['succeededCount'] === "number" || obj['succeededCount'] instanceof Number)) {
            return false
        }
        return true
    }
}
