// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator";

/**
 * A value that indicates the total amount, in USD, of in-app purchases the customer has made in your app, across all platforms.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/lifetimedollarspurchased lifetimeDollarsPurchased}
 */
export enum LifetimeDollarsPurchased {
    UNDECLARED = 0,
    ZERO_DOLLARS = 1,
    ONE_CENT_TO_FORTY_NINE_DOLLARS_AND_NINETY_NINE_CENTS = 2,
    FIFTY_DOLLARS_TO_NINETY_NINE_DOLLARS_AND_NINETY_NINE_CENTS = 3,
    ONE_HUNDRED_DOLLARS_TO_FOUR_HUNDRED_NINETY_NINE_DOLLARS_AND_NINETY_NINE_CENTS = 4,
    FIVE_HUNDRED_DOLLARS_TO_NINE_HUNDRED_NINETY_NINE_DOLLARS_AND_NINETY_NINE_CENTS = 5,
    ONE_THOUSAND_DOLLARS_TO_ONE_THOUSAND_NINE_HUNDRED_NINETY_NINE_DOLLARS_AND_NINETY_NINE_CENTS = 6,
    TWO_THOUSAND_DOLLARS_OR_GREATER = 7,
}

export class LifetimeDollarsPurchasedValidator implements Validator<LifetimeDollarsPurchased> {
   validate(obj: any): boolean {
        return Object.values(LifetimeDollarsPurchased).includes(obj)
    }
}
