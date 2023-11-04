// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator";

/**
 * The payment mode you configure for an introductory offer, promotional offer, or offer code on an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/offerdiscounttype offerDiscountType}
 */
export enum OfferDiscountType {
    FREE_TRIAL = "FREE_TRIAL",
    PAY_AS_YOU_GO = "PAY_AS_YOU_GO",
    PAY_UP_FRONT = "PAY_UP_FRONT"
}

export class OfferDiscountTypeValidator implements Validator<OfferDiscountType> {
   validate(obj: any): obj is OfferDiscountType {
        return Object.values(OfferDiscountType).includes(obj)
    }
}
