// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator";

/**
 * The payment mode for a discount offer on an In-App Purchase.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/offerdiscounttype offerDiscountType}
 */
export enum OfferDiscountType {
    FREE_TRIAL = "FREE_TRIAL",
    PAY_AS_YOU_GO = "PAY_AS_YOU_GO",
    PAY_UP_FRONT = "PAY_UP_FRONT",
    ONE_TIME = "ONE_TIME"
}

export class OfferDiscountTypeValidator extends StringValidator {}