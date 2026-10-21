// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AbstractAdvancedCommerceResponse } from "./AbstractAdvancedCommerceResponse"
import { Validator } from "./Validator"

/**
 * The response body for a successful subscription metadata change.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionchangemetadataresponse SubscriptionChangeMetadataResponse}
 */
export interface AdvancedCommerceSubscriptionChangeMetadataResponse extends AbstractAdvancedCommerceResponse {

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

export class AdvancedCommerceSubscriptionChangeMetadataResponseValidator implements Validator<AdvancedCommerceSubscriptionChangeMetadataResponse> {
    validate(obj: any): obj is AdvancedCommerceSubscriptionChangeMetadataResponse {
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
