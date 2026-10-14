// Copyright (c) 2024 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * The customer-provided reason for a refund request.
 *
 * {@link https://developer.apple.com/documentation/appstoreservernotifications/consumptionrequestreason consumptionRequestReason}
 */
export enum ConsumptionRequestReason {
    /**
     * The customer didn’t intend to make the in-app purchase.
     */
    UNINTENDED_PURCHASE = "UNINTENDED_PURCHASE",
    /**
     * The customer had issues with receiving or using the in-app purchase.
     */
    FULFILLMENT_ISSUE = "FULFILLMENT_ISSUE",
    /**
     * The customer wasn’t satisfied with the in-app purchase.
     */
    UNSATISFIED_WITH_PURCHASE = "UNSATISFIED_WITH_PURCHASE",
    /**
     * The customer requested a refund based on a legal reason.
     */
    LEGAL = "LEGAL",
    /**
     * The customer requested a refund for other reasons.
     */
    OTHER = "OTHER",
}

export class ConsumptionRequestReasonValidator extends StringValidator {}
