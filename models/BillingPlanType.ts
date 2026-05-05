// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * {@link https://developer.apple.com/documentation/appstoreserverapi/billingplantype billingPlanType}
 */
export enum BillingPlanType {
    BILLED_UPFRONT = "BILLED_UPFRONT",
    MONTHLY = "MONTHLY",
}

export class BillingPlanTypeValidator extends StringValidator {}
