// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

export interface AbstractAdvancedCommerceResponse {
    /**
     * Subscription renewal information signed by the App Store, in JSON Web Signature (JWS) format.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/jwsrenewalinfo JWSRenewalInfo}
     */
    signedRenewalInfo?: string

    /**
     * Transaction information signed by the App Store, in JWS Compact Serialization format.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/jwstransaction JWSTransaction}
     */
    signedTransactionInfo?: string
}