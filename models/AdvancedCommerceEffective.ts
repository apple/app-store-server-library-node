// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * A string value that indicates when a requested change to an auto-renewable subscription goes into effect.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/effective effective}
 */
export enum AdvancedCommerceEffective {
    /**
     * The requested change goes into effect immediately.
     */
    IMMEDIATELY = "IMMEDIATELY",
    /**
     * The requested change goes into effect at the start of the next billing cycle.
     */
    NEXT_BILL_CYCLE = "NEXT_BILL_CYCLE",
}

export class AdvancedCommerceEffectiveValidator extends StringValidator {}
