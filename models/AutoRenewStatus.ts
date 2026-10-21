// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator"

/**
 * The renewal status for an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/autorenewstatus autoRenewStatus}
 */
export enum AutoRenewStatus {
    /**
     * Automatic renewal is off.
     */
    OFF = 0,
    /**
     * Automatic renewal is on.
     */
    ON = 1,
}

export class AutoRenewStatusValidator extends NumberValidator {}
