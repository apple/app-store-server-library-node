// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from '../helper_validation_utils'
import { AdvancedCommerceDescriptors } from './AdvancedCommerceDescriptors'
import { Validator } from './Validator'

/**
 * The description and display name of the subscription to migrate to that you manage.
 * 
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmigratedescriptors SubscriptionMigrateDescriptors}
 */
export interface AdvancedCommerceSubscriptionMigrateDescriptors extends AdvancedCommerceDescriptors {
}

export class AdvancedCommerceSubscriptionMigrateDescriptorsValidator implements Validator<AdvancedCommerceSubscriptionMigrateDescriptors> {
    validate(obj: any): obj is AdvancedCommerceSubscriptionMigrateDescriptors {
        if (!HelperValidationUtils.validateDescription(obj['description'])) {
            return false
        }

        if (!HelperValidationUtils.validateDisplayName(obj['displayName'])) {
            return false
        }

        return true
    }
}
