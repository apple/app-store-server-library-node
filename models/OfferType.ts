// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator";

/**
 * The type of subscription offer.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/offertype offerType}
 */
export enum OfferType {
    INTRODUCTORY_OFFER = 1,
    PROMOTIONAL_OFFER = 2,
    SUBSCRIPTION_OFFER_CODE = 3,
}

export class OfferTypeValidator implements Validator<OfferType> {
   validate(obj: any): boolean {
        return Object.values(OfferType).includes(obj)
    }
}
