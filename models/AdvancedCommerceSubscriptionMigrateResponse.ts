// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AbstractAdvancedCommerceResponse } from './AbstractAdvancedCommerceResponse'
import { Validator } from './Validator'

/**
 * A response that contains signed renewal and transaction information after a subscription successfully migrates to the Advanced Commerce API.
 * 
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmigrateresponse SubscriptionMigrateResponse}
 */
export interface AdvancedCommerceSubscriptionMigrateResponse extends AbstractAdvancedCommerceResponse {
}

export class AdvancedCommerceSubscriptionMigrateResponseValidator implements Validator<AdvancedCommerceSubscriptionMigrateResponse> {
    validate(obj: any): obj is AdvancedCommerceSubscriptionMigrateResponse {
        if (!(typeof obj['signedRenewalInfo'] === "string" || obj['signedRenewalInfo'] instanceof String)) {
            return false
        }
        if (!(typeof obj['signedTransactionInfo'] === "string" || obj['signedTransactionInfo'] instanceof String)) {
            return false
        }
        return true
    }
}
