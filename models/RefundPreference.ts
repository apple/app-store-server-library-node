// Copyright (c) 2024 Apple Inc. Licensed under MIT License.

/**
 * A value that indicates your preferred outcome for the refund request.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/refundpreference refundPreference}
 */
export enum RefundPreference {
    UNDECLARED = 0,
    PREFER_GRANT = 1,
    PREFER_DECLINE = 2,
    NO_PREFERENCE = 3,
}
