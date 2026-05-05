// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from '../helper_validation_utils'
import { AbstractAdvancedCommerceItem } from './AbstractAdvancedCommerceItem'
import { Validator } from './Validator'

/**
 * The item information that replaces a migrated subscription item when the subscription renews.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmigraterenewalitem SubscriptionMigrateRenewalItem}
 */
export interface AdvancedCommerceSubscriptionMigrateRenewalItem extends AbstractAdvancedCommerceItem {
}

export class AdvancedCommerceSubscriptionMigrateRenewalItemValidator implements Validator<AdvancedCommerceSubscriptionMigrateRenewalItem> {
    validate(obj: any): obj is AdvancedCommerceSubscriptionMigrateRenewalItem {
        if (!HelperValidationUtils.validateSku(obj['SKU'])) {
            return false
        }

        if (!HelperValidationUtils.validateDescription(obj['description'])) {
            return false
        }

        if (!HelperValidationUtils.validateDisplayName(obj['displayName'])) {
            return false
        }

        return true
    }
}
