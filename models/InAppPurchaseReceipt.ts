// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

/**
 * A decoded in-app purchase attribute from a legacy App Store receipt.
 *
 * {@link https://developer.apple.com/documentation/appstorereceipts/responsebody/receipt/in_app in_app}
 */
export interface InAppPurchaseReceipt {

    /**
     * The number of items purchased.
     *
     * {@link https://developer.apple.com/documentation/appstorereceipts/quantity quantity}
     */
    quantity?: number

    /**
     * The unique identifier of the product purchased.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/productid productId}
     */
    productId?: string

    /**
     * The unique identifier of the transaction.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/transactionid transactionId}
     */
    transactionId?: string

    /**
     * The unique identifier of the original transaction.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/originaltransactionid originalTransactionId}
     */
    originalTransactionId?: string

    /**
     * The time of the purchase, in UNIX time, in milliseconds.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/purchasedate purchaseDate}
     */
    purchaseDate?: number

    /**
     * The time of the original purchase, in UNIX time, in milliseconds.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/originalpurchasedate originalPurchaseDate}
     */
    originalPurchaseDate?: number

    /**
     * The expiration time of the subscription, in UNIX time, in milliseconds.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/expiresdate expiresDate}
     */
    expiresDate?: number

    /**
     * The time Apple customer support canceled the transaction or the subscription was upgraded, in UNIX time, in milliseconds.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/revocationdate revocationDate}
     */
    cancellationDate?: number

    /**
     * The unique identifier of subscription purchase events across devices, including subscription renewals.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/weborderlineitemid webOrderLineItemId}
     */
    webOrderLineItemId?: number

    /**
     * Whether the subscription is in an introductory offer period.
     *
     * {@link https://developer.apple.com/documentation/appstorereceipts/is_in_intro_offer_period is_in_intro_offer_period}
     */
    isInIntroOfferPeriod?: boolean

    /**
     * Attribute types this library does not model, keyed by type, with the verified-but-undecoded value bytes,
     * so fields Apple adds later remain accessible without a library update.
     */
    unknownAttributes: Map<number, Buffer[]>
}
