// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator";

/**
 * A value that indicates whether the app successfully delivered an In-App Purchase that works properly.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/deliverystatus deliveryStatus}
 */
export enum DeliveryStatus {
    DELIVERED = "DELIVERED",
    UNDELIVERED_QUALITY_ISSUE = "UNDELIVERED_QUALITY_ISSUE",
    UNDELIVERED_WRONG_ITEM = "UNDELIVERED_WRONG_ITEM",
    UNDELIVERED_SERVER_OUTAGE = "UNDELIVERED_SERVER_OUTAGE",
    UNDELIVERED_OTHER = "UNDELIVERED_OTHER",
}


export class DeliveryStatusValidator extends StringValidator {}
