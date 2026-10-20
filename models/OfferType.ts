// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator"

/**
 * The type of offer.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/offertype offerType}
 */
export enum OfferType {
    /**
     * An introductory offer.
     */
    INTRODUCTORY_OFFER = 1,
    /**
     * A promotional offer.
     */
    PROMOTIONAL_OFFER = 2,
    /**
     * An offer with an offer code.
     */
    OFFER_CODE = 3,
    /**
     * A win-back offer.
     */
    WIN_BACK_OFFER = 4,
}

export class OfferTypeValidator extends NumberValidator {}
