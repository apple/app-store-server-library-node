// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator"

/**
 * The status that indicates whether an auto-renewable subscription is subject to a price increase.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/priceincreasestatus priceIncreaseStatus}
 */
export enum PriceIncreaseStatus {
    /**
     * The customer hasn’t yet responded to an auto-renewable subscription price increase that requires customer consent.
     */
    CUSTOMER_HAS_NOT_RESPONDED = 0,
    /**
     * The customer consented to an auto-renewable subscription price increase that requires customer consent, or the App Store has notified the customer of an auto-renewable subscription price increase that doesn’t require consent.
     */
    CUSTOMER_CONSENTED_OR_WAS_NOTIFIED_WITHOUT_NEEDING_CONSENT = 1,
}

export class PriceIncreaseStatusValidator extends NumberValidator {}
