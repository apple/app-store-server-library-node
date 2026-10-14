// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator"

/**
 * The status of an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/status status}
 */
export enum Status {
    /**
     * The auto-renewable subscription is active.
     */
    ACTIVE = 1,
    /**
     * The auto-renewable subscription is expired.
     */
    EXPIRED = 2,
    /**
     * The auto-renewable subscription is in a billing retry period.
     */
    BILLING_RETRY = 3,
    /**
     * The auto-renewable subscription is in a Billing Grace Period.
     */
    BILLING_GRACE_PERIOD = 4,
    /**
     * The auto-renewable subscription is revoked.
     */
    REVOKED = 5,
}

export class StatusValidator extends NumberValidator {}
