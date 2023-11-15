// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator";

/**
 * The status of an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/status status}
 */
export enum Status {
    ACTIVE = 1,
    EXPIRED = 2,
    BILLING_RETRY = 3,
    BILLING_GRACE_PERIOD = 4,
    REVOKED = 5,
}

export class StatusValidator extends NumberValidator {}