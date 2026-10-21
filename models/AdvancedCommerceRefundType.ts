// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * The type of refund requested.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestrefunditem RequestRefundItem}
 */
export enum AdvancedCommerceRefundType {
    FULL = "FULL",
    PRORATED = "PRORATED",
    CUSTOM = "CUSTOM",
}

export class AdvancedCommerceRefundTypeValidator extends StringValidator {}
