// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AbstractAdvancedCommerceResponse } from './AbstractAdvancedCommerceResponse'
import { Validator } from './Validator'

/**
 * A response that contains signed JWS renewal and JWS transaction information after a subscription price change request.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionpricechangeresponse SubscriptionPriceChangeResponse}
 */
export interface AdvancedCommerceSubscriptionPriceChangeResponse extends AbstractAdvancedCommerceResponse {
}

export class AdvancedCommerceSubscriptionPriceChangeResponseValidator implements Validator<AdvancedCommerceSubscriptionPriceChangeResponse> {
    validate(obj: any): obj is AdvancedCommerceSubscriptionPriceChangeResponse {
        if (!(typeof obj['signedRenewalInfo'] === "string" || obj['signedRenewalInfo'] instanceof String)) {
            return false
        }
        if (!(typeof obj['signedTransactionInfo'] === "string" || obj['signedTransactionInfo'] instanceof String)) {
            return false
        }
        return true
    }
}
