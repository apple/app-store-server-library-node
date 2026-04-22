// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AbstractAdvancedCommerceResponse } from './AbstractAdvancedCommerceResponse'
import { Validator } from './Validator'

/**
 * The response body for a successful subscription cancellation.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptioncancelresponse SubscriptionCancelResponse}
 */
export interface AdvancedCommerceSubscriptionCancelResponse extends AbstractAdvancedCommerceResponse {
}

export class AdvancedCommerceSubscriptionCancelResponseValidator implements Validator<AdvancedCommerceSubscriptionCancelResponse> {
    validate(obj: any): obj is AdvancedCommerceSubscriptionCancelResponse {
        if (!(typeof obj['signedRenewalInfo'] === "string" || obj['signedRenewalInfo'] instanceof String)) {
            return false
        }
        if (!(typeof obj['signedTransactionInfo'] === "string" || obj['signedTransactionInfo'] instanceof String)) {
            return false
        }
        return true
    }
}
