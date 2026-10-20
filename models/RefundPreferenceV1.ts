// Copyright (c) 2024 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator"

/**
 * A value that indicates your preferred outcome for the refund request.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/refundpreferencev1 refundPreferenceV1}
 * @deprecated Use {@link RefundPreference} instead.
 */
export enum RefundPreferenceV1 {
    /**
     * The refund preference is undeclared.
     */
    UNDECLARED = 0,
    /**
     * You prefer that the App Store grants the refund.
     */
    PREFER_GRANT = 1,
    /**
     * You prefer that the App Store declines the refund.
     */
    PREFER_DECLINE = 2,
    /**
     * You have no preference whether the App Store grants or declines the refund.
     */
    NO_PREFERENCE = 3,
}

export class RefundPreferenceV1Validator extends NumberValidator {}
