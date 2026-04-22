// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

export interface AbstractAdvancedCommerceResponse {
    /**
     * Subscription renewal information, signed by the App Store, in JSON Web Signature (JWS) format.
     * 
     * @see https://developer.apple.com/documentation/appstoreserverapi/jwsrenewalinfo
     */
    signedRenewalInfo?: string

    /**
     * Transaction information signed by the App Store, in JSON Web Signature (JWS) Compact Serialization format.
     *
     * @see https://developer.apple.com/documentation/appstoreserverapi/jwstransaction
     */
    signedTransactionInfo?: string
}