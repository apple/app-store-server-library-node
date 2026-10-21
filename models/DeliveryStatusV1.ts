// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator"

/**
 * A value that indicates whether the app successfully delivered an In-App Purchase that works properly.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/deliverystatusv1 deliveryStatusV1}
 * @deprecated Use {@link DeliveryStatus} instead.
 */
export enum DeliveryStatusV1 {
    /**
     * The app delivered the consumable In-App Purchase and it’s working properly.
     */
    DELIVERED_AND_WORKING_PROPERLY = 0,
    /**
     * The app didn’t deliver the consumable In-App Purchase due to a quality issue.
     */
    DID_NOT_DELIVER_DUE_TO_QUALITY_ISSUE = 1,
    /**
     * The app delivered the wrong item.
     */
    DELIVERED_WRONG_ITEM = 2,
    /**
     * The app didn’t deliver the consumable In-App Purchase due to a server outage.
     */
    DID_NOT_DELIVER_DUE_TO_SERVER_OUTAGE = 3,
    /**
     * The app didn’t deliver the consumable In-App Purchase due to an in-game currency change.
     */
    DID_NOT_DELIVER_DUE_TO_IN_GAME_CURRENCY_CHANGE = 4,
    /**
     * The app didn’t deliver the consumable In-App Purchase for other reasons.
     */
    DID_NOT_DELIVER_FOR_OTHER_REASON = 5,
}

export class DeliveryStatusV1Validator extends NumberValidator {}
