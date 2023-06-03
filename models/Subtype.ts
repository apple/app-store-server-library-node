// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator";

/**
 * A notification subtype value that App Store Server Notifications 2 uses.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/notificationsubtype notificationSubtype}
 */
export enum Subtype {
    INITIAL_BUY = "INITIAL_BUY",
    RESUBSCRIBE = "RESUBSCRIBE",
    DOWNGRADE = "DOWNGRADE",
    UPGRADE = "UPGRADE",
    AUTO_RENEW_ENABLED = "AUTO_RENEW_ENABLED",
    AUTO_RENEW_DISABLED = "AUTO_RENEW_DISABLED",
    VOLUNTARY = "VOLUNTARY",
    BILLING_RETRY = "BILLING_RETRY",
    PRICE_INCREASE = "PRICE_INCREASE",
    GRACE_PERIOD = "GRACE_PERIOD",
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    BILLING_RECOVERY = "BILLING_RECOVERY",
    PRODUCT_NOT_FOR_SALE = "PRODUCT_NOT_FOR_SALE",
    SUMMARY = "SUMMARY",
    FAILURE = "FAILURE",
}

export class SubtypeValidator implements Validator<Subtype> {
   validate(obj: any): boolean {
        return Object.values(Subtype).includes(obj)
    }
}
