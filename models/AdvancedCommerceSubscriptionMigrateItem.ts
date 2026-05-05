// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from '../helper_validation_utils'
import { AbstractAdvancedCommerceItem } from './AbstractAdvancedCommerceItem'
import { Validator } from './Validator'

/**
 * The SKU, description, and display name to use for a migrated subscription item.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmigrateitem SubscriptionMigrateItem}
 */
export interface AdvancedCommerceSubscriptionMigrateItem extends AbstractAdvancedCommerceItem {
}

export class AdvancedCommerceSubscriptionMigrateItemValidator implements Validator<AdvancedCommerceSubscriptionMigrateItem> {
    validate(obj: any): obj is AdvancedCommerceSubscriptionMigrateItem {
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
