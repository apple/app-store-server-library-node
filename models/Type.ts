// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * The type of In-App Purchase products you can offer in your app.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/type type}
 */
export enum Type {
    /**
     * An auto-renewable subscription
     */
    AUTO_RENEWABLE_SUBSCRIPTION = "Auto-Renewable Subscription",
    /**
     * A non-consumable In-App Purchase
     */
    NON_CONSUMABLE = "Non-Consumable",
    /**
     * A consumable In-App Purchase
     */
    CONSUMABLE = "Consumable",
    /**
     * A non-renewing subscription
     */
    NON_RENEWING_SUBSCRIPTION = "Non-Renewing Subscription",
}

export class TypeValidator extends StringValidator {}
