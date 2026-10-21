// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from "../helper_validation_utils"
import { AbstractAdvancedCommerceBaseItem } from "./AbstractAdvancedCommerceBaseItem"
import { Validator } from "./Validator"

/**
 * The data your app provides to remove an item from an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifyremoveitem SubscriptionModifyRemoveItem}
 */
export interface AdvancedCommerceSubscriptionModifyRemoveItem extends AbstractAdvancedCommerceBaseItem {

    /**
     * The product identifier of an Apple In-App Purchase product you manage in your own system.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/sku SKU}
     */
    SKU: string
}

export class AdvancedCommerceSubscriptionModifyRemoveItemValidator implements Validator<AdvancedCommerceSubscriptionModifyRemoveItem> {
    validate(obj: any): obj is AdvancedCommerceSubscriptionModifyRemoveItem {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!HelperValidationUtils.validateSku(obj['SKU'])) {
            return false
        }
        return true
    }
}
