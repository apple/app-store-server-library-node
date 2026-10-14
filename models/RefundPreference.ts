// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * A value that indicates your preferred outcome for the refund request.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/refundpreference refundPreference}
 */
export enum RefundPreference {
    /**
     * You prefer that the App Store declines the refund.
     */
    DECLINE = "DECLINE",
    /**
     * You prefer that the App Store grants the refund in full.
     */
    GRANT_FULL = "GRANT_FULL",
    /**
     * You prefer that the App Store grants a prorated refund.
     */
    GRANT_PRORATED = "GRANT_PRORATED",
}

export class RefundPreferenceValidator extends StringValidator {}
