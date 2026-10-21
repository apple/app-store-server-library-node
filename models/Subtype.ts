// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * A string that provides details about select notification types in version 2.
 *
 * {@link https://developer.apple.com/documentation/appstoreservernotifications/subtype subtype}
 */
export enum Subtype {
    /**
     * Applies to the SUBSCRIBED notificationType.
     */
    INITIAL_BUY = "INITIAL_BUY",
    /**
     * Applies to the SUBSCRIBED notificationType.
     */
    RESUBSCRIBE = "RESUBSCRIBE",
    /**
     * Applies to the DID_CHANGE_RENEWAL_PREF and OFFER_REDEEMED notificationType.
     */
    DOWNGRADE = "DOWNGRADE",
    /**
     * Applies to the DID_CHANGE_RENEWAL_PREF and OFFER_REDEEMED notificationType.
     */
    UPGRADE = "UPGRADE",
    /**
     * Applies to the DID_CHANGE_RENEWAL_STATUS notificationType.
     */
    AUTO_RENEW_ENABLED = "AUTO_RENEW_ENABLED",
    /**
     * Applies to the DID_CHANGE_RENEWAL_STATUS notificationType.
     */
    AUTO_RENEW_DISABLED = "AUTO_RENEW_DISABLED",
    /**
     * Applies to the EXPIRED notificationType.
     */
    VOLUNTARY = "VOLUNTARY",
    /**
     * Applies to the EXPIRED notificationType.
     */
    BILLING_RETRY = "BILLING_RETRY",
    /**
     * Applies to the EXPIRED notificationType.
     */
    PRICE_INCREASE = "PRICE_INCREASE",
    /**
     * Applies to the DID_FAIL_TO_RENEW notificationType.
     */
    GRACE_PERIOD = "GRACE_PERIOD",
    /**
     * Applies to the PRICE_INCREASE notificationType.
     */
    PENDING = "PENDING",
    /**
     * Applies to the PRICE_INCREASE notificationType.
     */
    ACCEPTED = "ACCEPTED",
    /**
     * Applies to the DID_RENEW notificationType.
     */
    BILLING_RECOVERY = "BILLING_RECOVERY",
    /**
     * Applies to the EXPIRED notificationType.
     */
    PRODUCT_NOT_FOR_SALE = "PRODUCT_NOT_FOR_SALE",
    /**
     * Applies to the RENEWAL_EXTENSION notificationType.
     */
    SUMMARY = "SUMMARY",
    /**
     * Applies to the RENEWAL_EXTENSION notificationType.
     */
    FAILURE = "FAILURE",
    /**
     * Applies to the EXTERNAL_PURCHASE_TOKEN notificationType.
     */
    UNREPORTED = "UNREPORTED",
    /**
     * Applies to the EXTERNAL_PURCHASE_TOKEN notificationType.
     */
    CREATED = "CREATED",
    /**
     * Applies to the EXTERNAL_PURCHASE_TOKEN notificationType.
     */
    ACTIVE_TOKEN_REMINDER = "ACTIVE_TOKEN_REMINDER",
}

export class SubtypeValidator extends StringValidator {}
