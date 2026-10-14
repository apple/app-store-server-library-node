// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from "../helper_validation_utils"
import { AbstractAdvancedCommerceBaseItem } from "./AbstractAdvancedCommerceBaseItem"
import { Validator } from "./Validator"

/**
 * The data your app provides to change a subscription price.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionpricechangeitem SubscriptionPriceChangeItem}
 */
export interface AdvancedCommerceSubscriptionPriceChangeItem extends AbstractAdvancedCommerceBaseItem {

    /**
     * The product identifier of an Apple In-App Purchase product you manage in your own system.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/sku SKU}
     */
    SKU: string

    /**
     * The product identifier of a dependent SKU in a subscription price change.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/dependentsku dependentSKU}
     */
    dependentSKUs?: string[]

    /**
     * A price, in milliunits of a currency, for an Advanced Commerce API SKU.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/price price}
     */
    price: number
}

export class AdvancedCommerceSubscriptionPriceChangeItemValidator implements Validator<AdvancedCommerceSubscriptionPriceChangeItem> {
    validate(obj: any): obj is AdvancedCommerceSubscriptionPriceChangeItem {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!HelperValidationUtils.validateSku(obj['SKU'])) {
            return false
        }
        if (typeof obj['dependentSKUs'] !== 'undefined') {
            if (!Array.isArray(obj['dependentSKUs'])) {
                return false
            }
            for (const dependentSKU of obj['dependentSKUs']) {
                if (!HelperValidationUtils.validateSku(dependentSKU)) {
                    return false
                }
            }
        }
        if (!(typeof obj['price'] === "number" || obj['price'] instanceof Number)) {
            return false
        }
        return true
    }
}
