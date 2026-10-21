// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * A value that indicates whether the app successfully delivered an In-App Purchase that works properly.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/deliverystatus deliveryStatus}
 */
export enum DeliveryStatus {
    /**
     * The app delivered the In-App Purchase and it’s working properly.
     */
    DELIVERED = "DELIVERED",
    /**
     * The app didn’t deliver the In-App Purchase due to a quality issue.
     */
    UNDELIVERED_QUALITY_ISSUE = "UNDELIVERED_QUALITY_ISSUE",
    /**
     * The app delivered the wrong item.
     */
    UNDELIVERED_WRONG_ITEM = "UNDELIVERED_WRONG_ITEM",
    /**
     * The app didn’t deliver the In-App Purchase due to a server outage.
     */
    UNDELIVERED_SERVER_OUTAGE = "UNDELIVERED_SERVER_OUTAGE",
    /**
     * The app didn’t deliver the In-App Purchase for other reasons.
     */
    UNDELIVERED_OTHER = "UNDELIVERED_OTHER",
}

export class DeliveryStatusValidator extends StringValidator {}
