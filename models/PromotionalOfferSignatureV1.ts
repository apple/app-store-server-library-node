// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

/**
 * The promotional offer signature you generate using an earlier signature version.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/promotionaloffersignaturev1 promotionalOfferSignatureV1}
 */
export interface PromotionalOfferSignatureV1 {

    /**
     * The Base64-encoded cryptographic signature you generate using the offer parameters.
     **/
    encodedSignature: string

    /**
     * The subscription's product identifier.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/productid productId}
     **/
    productId: string

    /**
     * A one-time-use UUID antireplay value you generate.
     *
     * **Note: Use lowercase.**
     **/
    nonce: string

    /**
     * The UNIX time, in milliseconds, when you generate the signature.
     **/
    timestamp: number

    /**
     * A string that identifies the private key you use to generate the signature.
     *
     * @return keyId
     **/
    keyId: string

    /**
     * The subscription offer identifier that you set up in App Store Connect.
     **/
    offerIdentifier: string

    /**
     * A UUID that you provide to associate with the transaction if the customer accepts the promotional offer.
     *
     * **Note: Use lowercase.**
     **/
    appAccountToken?: string
}
