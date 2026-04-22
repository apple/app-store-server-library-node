// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * The duration of a single cycle of an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/period period}
 */
export enum AdvancedCommercePeriod {
    P1W = "P1W",
    P1M = "P1M",
    P2M = "P2M",
    P3M = "P3M",
    P6M = "P6M",
    P1Y = "P1Y"
}

export class AdvancedCommercePeriodValidator extends StringValidator {}