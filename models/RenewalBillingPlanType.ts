// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * {@link https://developer.apple.com/documentation/appstoreserverapi/renewalbillingplantype renewalBillingPlanType}
 */
export enum RenewalBillingPlanType {
    BILLED_UPFRONT = "BILLED_UPFRONT",
    MONTHLY = "MONTHLY",
}

export class RenewalBillingPlanTypeValidator extends StringValidator {}
