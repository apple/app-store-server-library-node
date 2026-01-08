// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { StringValidator, Validator } from "./Validator";

/**
 * The type that describes the in-app purchase or external purchase event for which the App Store sends the version 2 notification.
 *
 * {@link https://developer.apple.com/documentation/appstoreservernotifications/notificationtype notificationType}
 */
export enum NotificationTypeV2 {
    SUBSCRIBED = "SUBSCRIBED",
    DID_CHANGE_RENEWAL_PREF = "DID_CHANGE_RENEWAL_PREF",
    DID_CHANGE_RENEWAL_STATUS = "DID_CHANGE_RENEWAL_STATUS",
    OFFER_REDEEMED = "OFFER_REDEEMED",
    DID_RENEW = "DID_RENEW",
    EXPIRED = "EXPIRED",
    DID_FAIL_TO_RENEW = "DID_FAIL_TO_RENEW",
    GRACE_PERIOD_EXPIRED = "GRACE_PERIOD_EXPIRED",
    PRICE_INCREASE = "PRICE_INCREASE",
    REFUND = "REFUND",
    REFUND_DECLINED = "REFUND_DECLINED",
    CONSUMPTION_REQUEST = "CONSUMPTION_REQUEST",
    RENEWAL_EXTENDED = "RENEWAL_EXTENDED",
    REVOKE = "REVOKE",
    TEST = "TEST",
    RENEWAL_EXTENSION = "RENEWAL_EXTENSION",
    REFUND_REVERSED = "REFUND_REVERSED",
    EXTERNAL_PURCHASE_TOKEN = "EXTERNAL_PURCHASE_TOKEN",
    ONE_TIME_CHARGE = "ONE_TIME_CHARGE",
    RESCIND_CONSENT = "RESCIND_CONSENT",
}

export class NotificationTypeV2Validator extends StringValidator {}