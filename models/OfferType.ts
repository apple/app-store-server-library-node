// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator";

/**
 * The type of subscription offer.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/offertype offerType}
 */
export enum OfferType {
    INTRODUCTORY_OFFER = 1,
    PROMOTIONAL_OFFER = 2,
    SUBSCRIPTION_OFFER_CODE = 3,
    WIN_BACK_OFFER = 4,
}

export class OfferTypeValidator extends NumberValidator {}