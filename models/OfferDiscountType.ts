// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * The payment mode for a discount offer on an In-App Purchase.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/offerdiscounttype offerDiscountType}
 */
export enum OfferDiscountType {
    /**
     * A payment mode of a discount for auto-renewable subscriptions that indicates a free trial.
     */
    FREE_TRIAL = "FREE_TRIAL",
    /**
     * A payment mode of a discount for auto-renewable subscriptions that customers pay over a single or multiple billing periods.
     */
    PAY_AS_YOU_GO = "PAY_AS_YOU_GO",
    /**
     * A payment mode of a discount for auto-renewable subscriptions that customers pay up front.
     */
    PAY_UP_FRONT = "PAY_UP_FRONT",
    /**
     * A payment mode for a discount for In-App Purchase types including consumable, non-consumable, and non-renewing subscription.
     */
    ONE_TIME = "ONE_TIME",
}

export class OfferDiscountTypeValidator extends StringValidator {}
