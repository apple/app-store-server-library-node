// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceEffective, AdvancedCommerceEffectiveValidator } from './AdvancedCommerceEffective'
import { AdvancedCommercePeriod, AdvancedCommercePeriodValidator } from './AdvancedCommercePeriod'
import { Validator } from './Validator'

/**
 * The data your app provides to change the period of an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifyperiodchange SubscriptionModifyPeriodChange}
 */
export interface AdvancedCommerceSubscriptionModifyPeriodChange {
    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/effective effective}
     */
    effective: AdvancedCommerceEffective | string

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/period Period}
     */
    period: AdvancedCommercePeriod | string
}

export class AdvancedCommerceSubscriptionModifyPeriodChangeValidator implements Validator<AdvancedCommerceSubscriptionModifyPeriodChange> {
    static readonly effectiveValidator = new AdvancedCommerceEffectiveValidator()
    static readonly periodValidator = new AdvancedCommercePeriodValidator()

    validate(obj: any): obj is AdvancedCommerceSubscriptionModifyPeriodChange {
        if (!(AdvancedCommerceSubscriptionModifyPeriodChangeValidator.effectiveValidator.validate(obj['effective']))) {
            return false
        }
        if (!(AdvancedCommerceSubscriptionModifyPeriodChangeValidator.periodValidator.validate(obj['period']))) {
            return false
        }
        return true
    }
}
