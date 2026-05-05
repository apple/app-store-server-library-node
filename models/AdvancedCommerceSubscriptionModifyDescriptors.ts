// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from '../helper_validation_utils'
import { AdvancedCommerceEffective, AdvancedCommerceEffectiveValidator } from './AdvancedCommerceEffective'
import { Validator } from './Validator'

/**
 * The data your app provides to change the description and display name of an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifydescriptors SubscriptionModifyDescriptors}
 */
export interface AdvancedCommerceSubscriptionModifyDescriptors {
    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/effective effective}
     */
    effective: AdvancedCommerceEffective | string

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/description description}
     */
    description?: string

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/displayname displayName}
     */
    displayName?: string
}

export class AdvancedCommerceSubscriptionModifyDescriptorsValidator implements Validator<AdvancedCommerceSubscriptionModifyDescriptors> {
    static readonly effectiveValidator = new AdvancedCommerceEffectiveValidator()

    validate(obj: any): obj is AdvancedCommerceSubscriptionModifyDescriptors {
        if (!(AdvancedCommerceSubscriptionModifyDescriptorsValidator.effectiveValidator.validate(obj['effective']))) {
            return false
        }

        if (typeof obj['description'] !== 'undefined' && !HelperValidationUtils.validateDescription(obj['description'])) {
            return false
        }

        if (typeof obj['displayName'] !== 'undefined' && !HelperValidationUtils.validateDisplayName(obj['displayName'])) {
            return false
        }

        return true
    }
}
