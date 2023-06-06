// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator";

/**
 * A value that indicates whether the order ID in the request is valid for your app.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/orderlookupstatus OrderLookupStatus}
 */
export enum OrderLookupStatus {
    VALID = 0,
    INVALID = 1,
}

export class OrderLookupStatusValidator implements Validator<OrderLookupStatus> {
   validate(obj: any): obj is OrderLookupStatus {
        return Object.values(OrderLookupStatus).includes(obj)
    }
}
