// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from '../helper_validation_utils'
import { AbstractAdvancedCommerceBaseItem } from './AbstractAdvancedCommerceBaseItem'
import { Validator } from './Validator'

/**
 * An item in a subscription to reactive.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionreactivateitem SubscriptionReactivateItem}
 */
export interface AdvancedCommerceSubscriptionReactivateItem extends AbstractAdvancedCommerceBaseItem {
}

export class AdvancedCommerceSubscriptionReactivateItemValidator implements Validator<AdvancedCommerceSubscriptionReactivateItem> {
    validate(obj: any): obj is AdvancedCommerceSubscriptionReactivateItem {
        if (!HelperValidationUtils.validateSku(obj['SKU'])) {
            return false
        }
        return true
    }
}
