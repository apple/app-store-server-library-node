// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { InAppOwnershipType } from "./InAppOwnershipType"

export interface TransactionHistoryRequest {

    /**
     * An optional start date of the timespan for the transaction history records you’re requesting. The startDate must precede the endDate if you specify both dates. To be included in results, the transaction’s purchaseDate must be equal to or greater than the startDate.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/startdate startDate}
     */
    startDate?: number

    /**
     * An optional end date of the timespan for the transaction history records you’re requesting. Choose an endDate that’s later than the startDate if you specify both dates. Using an endDate in the future is valid. To be included in results, the transaction’s purchaseDate must be less than the endDate.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/enddate endDate}
     */
    endDate?: number

    /**
     * An optional filter that indicates the product identifier to include in the transaction history. Your query may specify more than one productID.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/productid productId}
     */
    productIds?: string[]

    /**
     * An optional filter that indicates the product type to include in the transaction history. Your query may specify more than one productType.
     */
    productTypes?: ProductType[]

    /**
     * An optional sort order for the transaction history records. The response sorts the transaction records by their recently modified date. The default value is ASCENDING, so you receive the oldest records first.
     */
    sort?: Order

    /**
     * An optional filter that indicates the subscription group identifier to include in the transaction history. Your query may specify more than one subscriptionGroupIdentifier.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/subscriptiongroupidentifier subscriptionGroupIdentifier}
     */
    subscriptionGroupIdentifiers?: string[]

    /**
     * An optional filter that limits the transaction history by the in-app ownership type.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/inappownershiptype inAppOwnershipType}
     */
    inAppOwnershipType?: InAppOwnershipType

    /**
     * An optional Boolean value that indicates whether the response includes only revoked transactions when the value is true, or contains only nonrevoked transactions when the value is false. By default, the request doesn't include this parameter.
     */
    revoked?: boolean
}

export enum ProductType {
    AUTO_RENEWABLE = "AUTO_RENEWABLE",
    NON_RENEWABLE = "NON_RENEWABLE",
    CONSUMABLE = "CONSUMABLE",
    NON_CONSUMABLE = "NON_CONSUMABLE"
}

export enum Order {
    ASCENDING = "ASCENDING",
    DESCENDING = "DESCENDING"
}