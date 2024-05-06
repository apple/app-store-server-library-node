// Copyright (c) 2024 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator";

/**
 * The customer-provided reason for a refund request.
 *
 * {@link https://developer.apple.com/documentation/appstoreservernotifications/consumptionrequestreason consumptionRequestReason}
 */
export enum ConsumptionRequestReason {
    UNINTENDED_PURCHASE = "UNINTENDED_PURCHASE",
    FULFILLMENT_ISSUE = "FULFILLMENT_ISSUE",
    UNSATISFIED_WITH_PURCHASE = "UNSATISFIED_WITH_PURCHASE",
    LEGAL = "LEGAL",
    OTHER = "OTHER",
}

export class ConsumptionRequestReasonValidator extends StringValidator {}