// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator";

/**
 * The reason an auto-renewable subscription expired.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/expirationintent expirationIntent}
 */
export enum ExpirationIntent {
    CUSTOMER_CANCELLED = 1,
    BILLING_ERROR = 2,
    CUSTOMER_DID_NOT_CONSENT_TO_PRICE_INCREASE = 3,
    PRODUCT_NOT_AVAILABLE = 4,
    OTHER = 5,
}

export class ExpirationIntentValidator extends NumberValidator {}