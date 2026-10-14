// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from "../helper_validation_utils"
import { AbstractAdvancedCommerceBaseItem } from "./AbstractAdvancedCommerceBaseItem"
import { Validator } from "./Validator"

/**
 * An item in a subscription to reactivate.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionreactivateitem SubscriptionReactivateItem}
 */
export interface AdvancedCommerceSubscriptionReactivateItem extends AbstractAdvancedCommerceBaseItem {

    /**
     * The SKU of the item to reactivate.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/sku SKU}
     */
    SKU: string
}

export class AdvancedCommerceSubscriptionReactivateItemValidator implements Validator<AdvancedCommerceSubscriptionReactivateItem> {
    validate(obj: any): obj is AdvancedCommerceSubscriptionReactivateItem {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!HelperValidationUtils.validateSku(obj['SKU'])) {
            return false
        }
        return true
    }
}
