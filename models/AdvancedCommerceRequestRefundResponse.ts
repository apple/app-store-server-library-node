// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AbstractAdvancedCommerceResponse } from './AbstractAdvancedCommerceResponse'
import { Validator } from './Validator'

/**
 * The response body for a transaction refund request.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestrefundresponse RequestRefundResponse}
 */
export interface AdvancedCommerceRequestRefundResponse extends AbstractAdvancedCommerceResponse {
}

export class AdvancedCommerceRequestRefundResponseValidator implements Validator<AdvancedCommerceRequestRefundResponse> {
    validate(obj: any): obj is AdvancedCommerceRequestRefundResponse {
        if ((typeof obj['signedRenewalInfo'] !== 'undefined') && !(typeof obj['signedRenewalInfo'] === "string" || obj['signedRenewalInfo'] instanceof String)) {
            return false
        }
        if (!(typeof obj['signedTransactionInfo'] === "string" || obj['signedTransactionInfo'] instanceof String)) {
            return false
        }
        return true
    }
}
