// Copyright (c) 2024 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator";

/**
 * A value that indicates your preferred outcome for the refund request.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/refundpreferencev1 RefundPreferenceV1}
 * @deprecated Use {@link RefundPreference} instead.
 */
export enum RefundPreferenceV1 {
    UNDECLARED = 0,
    PREFER_GRANT = 1,
    PREFER_DECLINE = 2,
    NO_PREFERENCE = 3,
}
