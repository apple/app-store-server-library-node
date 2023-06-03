// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * A response that indicates whether an individual renewal-date extension succeeded, and related details.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/extendrenewaldateresponse ExtendRenewalDateResponse}
 */
export interface ExtendRenewalDateResponse {

    /**
     * The original transaction identifier of a purchase.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/originaltransactionid originalTransactionId}
     **/
    originalTransactionId?: string
        
    /**
     * The unique identifier of subscription-purchase events across devices, including renewals.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/weborderlineitemid webOrderLineItemId}
     **/
    webOrderLineItemId?: string
        
    /**
     * A Boolean value that indicates whether the subscription-renewal-date extension succeeded.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/success success}
     **/
    success?: boolean
        
    /**
     * The new subscription expiration date for a subscription-renewal extension.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/effectivedate effectiveDate}
     **/
    effectiveDate?: number
}


export class ExtendRenewalDateResponseValidator implements Validator<ExtendRenewalDateResponse> {
    validate(obj: any): boolean {
        if ((typeof obj['originalTransactionId'] !== 'undefined') && !(typeof obj['originalTransactionId'] === "string" || obj['originalTransactionId'] instanceof String)) {
            return false
        }
        if ((typeof obj['webOrderLineItemId'] !== 'undefined') && !(typeof obj['webOrderLineItemId'] === "string" || obj['webOrderLineItemId'] instanceof String)) {
            return false
        }
        if ((typeof obj['success'] !== 'undefined') && !(typeof obj['success'] === "boolean" || obj['success'] instanceof Boolean)) {
            return false
        }
        if ((typeof obj['effectiveDate'] !== 'undefined') && !(typeof obj['effectiveDate'] === "number")) {
            return false
        }
        return true
    }
}
