// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceValidationUtils } from '../advanced_commerce_validation_utils'
import { AbstractAdvancedCommerceBaseItem } from './AbstractAdvancedCommerceBaseItem'
import { Validator } from './Validator'

/**
 * The data your app provides to remove an item from an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifyremoveitem SubscriptionModifyRemoveItem}
 */
export interface AdvancedCommerceSubscriptionModifyRemoveItem extends AbstractAdvancedCommerceBaseItem {
}

export class AdvancedCommerceSubscriptionModifyRemoveItemValidator implements Validator<AdvancedCommerceSubscriptionModifyRemoveItem> {
    validate(obj: any): obj is AdvancedCommerceSubscriptionModifyRemoveItem {
        if (!AdvancedCommerceValidationUtils.validateSku(obj['SKU'])) {
            return false
        }
        return true
    }
}
