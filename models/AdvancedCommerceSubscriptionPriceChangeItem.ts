// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceValidationUtils } from '../advanced_commerce_validation_utils'
import { AbstractAdvancedCommerceBaseItem } from './AbstractAdvancedCommerceBaseItem'
import { Validator } from './Validator'

/**
 * The data your app provides to change a subscription price.
 * 
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionpricechangeitem SubscriptionPriceChangeItem}
 */
export interface AdvancedCommerceSubscriptionPriceChangeItem extends AbstractAdvancedCommerceBaseItem {
    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/price price}
     */
    price: number

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/dependentsku dependentSKU}
     */
    dependentSKUs?: String[]
}

export class AdvancedCommerceSubscriptionPriceChangeItemValidator implements Validator<AdvancedCommerceSubscriptionPriceChangeItem> {
    validate(obj: any): obj is AdvancedCommerceSubscriptionPriceChangeItem {
        if (!(typeof obj['SKU'] === "string" || obj['SKU'] instanceof String)) {
            return false
        }
        if (!AdvancedCommerceValidationUtils.validateSku(obj['SKU'])) {
            return false
        }
        if (!(typeof obj['price'] === "number")) {
            return false
        }
        if (typeof obj['dependentSKUs'] !== 'undefined') {
            if (!AdvancedCommerceValidationUtils.validateItems(obj['dependentSKUs'])) {
                return false
            }
            for (const sku of obj['dependentSKUs']) {
                if (!(typeof sku === "string" || sku instanceof String)) {
                    return false
                }
                if (!AdvancedCommerceValidationUtils.validateSku(sku)) {
                    return false
                }
            }
        }
        return true
    }
}
