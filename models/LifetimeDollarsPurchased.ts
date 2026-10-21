// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator"

/**
 * A value that indicates the dollar amount of in-app purchases the customer has made in your app, since purchasing the app, across all platforms.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/lifetimedollarspurchased lifetimeDollarsPurchased}
 */
export enum LifetimeDollarsPurchased {
    /**
     * Lifetime purchase amount is undeclared.
     */
    UNDECLARED = 0,
    /**
     * Lifetime purchase amount is 0 USD.
     */
    ZERO_DOLLARS = 1,
    /**
     * Lifetime purchase amount is between 0.01–49.99 USD.
     */
    ONE_CENT_TO_FORTY_NINE_DOLLARS_AND_NINETY_NINE_CENTS = 2,
    /**
     * Lifetime purchase amount is between 50–99.99 USD.
     */
    FIFTY_DOLLARS_TO_NINETY_NINE_DOLLARS_AND_NINETY_NINE_CENTS = 3,
    /**
     * Lifetime purchase amount is between 100–499.99 USD.
     */
    ONE_HUNDRED_DOLLARS_TO_FOUR_HUNDRED_NINETY_NINE_DOLLARS_AND_NINETY_NINE_CENTS = 4,
    /**
     * Lifetime purchase amount is between 500–999.99 USD.
     */
    FIVE_HUNDRED_DOLLARS_TO_NINE_HUNDRED_NINETY_NINE_DOLLARS_AND_NINETY_NINE_CENTS = 5,
    /**
     * Lifetime purchase amount is between 1000–1999.99 USD.
     */
    ONE_THOUSAND_DOLLARS_TO_ONE_THOUSAND_NINE_HUNDRED_NINETY_NINE_DOLLARS_AND_NINETY_NINE_CENTS = 6,
    /**
     * Lifetime purchase amount is over 2000 USD.
     */
    TWO_THOUSAND_DOLLARS_OR_GREATER = 7,
}

export class LifetimeDollarsPurchasedValidator extends NumberValidator {}
