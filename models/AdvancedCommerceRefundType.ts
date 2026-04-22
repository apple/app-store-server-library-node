// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * Information about the refund request for an item, such as its SKU, the refund amount, reason, and type.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestrefunditem RequestRefundItem}
 */
export enum AdvancedCommerceRefundType {
    FULL = "FULL",
    PRORATED = "PRORATED",
    CUSTOM = "CUSTOM"
}

export class AdvancedCommerceRefundTypeValidator extends StringValidator {}