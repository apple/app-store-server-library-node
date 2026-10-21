// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator"

/**
 * A value that indicates whether the order ID in the request is valid for your app.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/orderlookupstatus OrderLookupStatus}
 */
export enum OrderLookupStatus {
    /**
     * The orderId that you provided in the Look Up Order ID request is valid and contains at least one in-app purchase for your app.
     */
    VALID = 0,
    /**
     * The orderId is invalid or doesn’t contain any in-app purchases for your app.
     */
    INVALID = 1,
}

export class OrderLookupStatusValidator extends NumberValidator {}
