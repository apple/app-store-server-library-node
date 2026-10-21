// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AbstractAdvancedCommerceResponse } from "./AbstractAdvancedCommerceResponse"
import { Validator } from "./Validator"

/**
 * A response that contains signed JWS renewal and JWS transaction information after a subscription price change request.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionpricechangeresponse SubscriptionPriceChangeResponse}
 */
export interface AdvancedCommerceSubscriptionPriceChangeResponse extends AbstractAdvancedCommerceResponse {

    /**
     * Subscription renewal information signed by the App Store, in JSON Web Signature (JWS) format.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/jwsrenewalinfo JWSRenewalInfo}
     */
    signedRenewalInfo: string

    /**
     * Transaction information signed by the App Store, in JWS Compact Serialization format.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/jwstransaction JWSTransaction}
     */
    signedTransactionInfo: string
}

export class AdvancedCommerceSubscriptionPriceChangeResponseValidator implements Validator<AdvancedCommerceSubscriptionPriceChangeResponse> {
    validate(obj: any): obj is AdvancedCommerceSubscriptionPriceChangeResponse {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(typeof obj['signedRenewalInfo'] === "string" || obj['signedRenewalInfo'] instanceof String)) {
            return false
        }
        if (!(typeof obj['signedTransactionInfo'] === "string" || obj['signedTransactionInfo'] instanceof String)) {
            return false
        }
        return true
    }
}
