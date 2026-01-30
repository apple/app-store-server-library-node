// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * A string value that indicates when a requested change to an auto-renewable subscription goes into effect.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/effective effective}
 */
export enum AdvancedCommerceEffective {
    IMMEDIATELY = "IMMEDIATELY",
    NEXT_BILL_CYCLE = "NEXT_BILL_CYCLE"
}

export class AdvancedCommerceEffectiveValidator extends StringValidator {}