// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * A reason to request a refund.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/refundreason refundReason}
 */
export enum AdvancedCommerceRefundReason {
    UNINTENDED_PURCHASE = "UNINTENDED_PURCHASE",
    FULFILLMENT_ISSUE = "FULFILLMENT_ISSUE",
    UNSATISFIED_WITH_PURCHASE = "UNSATISFIED_WITH_PURCHASE",
    LEGAL = "LEGAL",
    OTHER = "OTHER",
    MODIFY_ITEMS_REFUND = "MODIFY_ITEMS_REFUND",
    SIMULATE_REFUND_DECLINE = "SIMULATE_REFUND_DECLINE"
}

export class AdvancedCommerceRefundReasonValidator extends StringValidator {}