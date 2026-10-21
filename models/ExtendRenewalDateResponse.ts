// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * A response that indicates whether an individual renewal-date extension succeeded, and related details.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/extendrenewaldateresponse ExtendRenewalDateResponse}
 */
export interface ExtendRenewalDateResponse {

    /**
     * The new subscription expiration date of a successful subscription-renewal-date extension.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/effectivedate effectiveDate}
     */
    effectiveDate?: number

    /**
     * The original transaction identifier of the subscription that experienced a service interruption.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/originaltransactionid originalTransactionId}
     */
    originalTransactionId?: string

    /**
     * A Boolean value that indicates whether the subscription-renewal-date extension succeeded.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/success success}
     */
    success?: boolean

    /**
     * A unique ID that identifies subscription-purchase events, including subscription renewals, across devices.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/weborderlineitemid webOrderLineItemId}
     */
    webOrderLineItemId?: string
}

export class ExtendRenewalDateResponseValidator implements Validator<ExtendRenewalDateResponse> {
    validate(obj: any): obj is ExtendRenewalDateResponse {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if ((typeof obj['effectiveDate'] !== 'undefined') && !(typeof obj['effectiveDate'] === "number" || obj['effectiveDate'] instanceof Number)) {
            return false
        }
        if ((typeof obj['originalTransactionId'] !== 'undefined') && !(typeof obj['originalTransactionId'] === "string" || obj['originalTransactionId'] instanceof String)) {
            return false
        }
        if ((typeof obj['success'] !== 'undefined') && !(typeof obj['success'] === "boolean" || obj['success'] instanceof Boolean)) {
            return false
        }
        if ((typeof obj['webOrderLineItemId'] !== 'undefined') && !(typeof obj['webOrderLineItemId'] === "string" || obj['webOrderLineItemId'] instanceof String)) {
            return false
        }
        return true
    }
}
