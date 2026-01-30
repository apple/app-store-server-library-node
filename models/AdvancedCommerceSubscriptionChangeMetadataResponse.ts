// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AbstractAdvancedCommerceResponse } from './AbstractAdvancedCommerceResponse'
import { Validator } from './Validator'

/**
 * The response body for a successful subscription metadata change.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionchangemetadataresponse SubscriptionChangeMetadataResponse}
 */
export interface AdvancedCommerceSubscriptionChangeMetadataResponse extends AbstractAdvancedCommerceResponse {
}

export class AdvancedCommerceSubscriptionChangeMetadataResponseValidator implements Validator<AdvancedCommerceSubscriptionChangeMetadataResponse> {
    validate(obj: any): obj is AdvancedCommerceSubscriptionChangeMetadataResponse {
        if (!(typeof obj['signedRenewalInfo'] === "string" || obj['signedRenewalInfo'] instanceof String)) {
            return false
        }
        if (!(typeof obj['signedTransactionInfo'] === "string" || obj['signedTransactionInfo'] instanceof String)) {
            return false
        }
        return true
    }
}
