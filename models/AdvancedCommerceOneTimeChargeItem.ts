// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from "../helper_validation_utils"
import { AbstractAdvancedCommerceItem } from "./AbstractAdvancedCommerceItem"
import { Validator } from "./Validator"

/**
 * The details of a one-time charge product, including its display name, price, SKU, and metadata.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/onetimechargeitem OneTimeChargeItem}
 */
export interface AdvancedCommerceOneTimeChargeItem extends AbstractAdvancedCommerceItem {

    /**
     * The product identifier.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/sku SKU}
     */
    SKU: string

    /**
     * A description of the product that doesn’t display to customers.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/description description}
     */
    description: string

    /**
     * The product name, suitable for display to customers.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/displayname displayName}
     */
    displayName: string

    /**
     * The price, in milliunits of the currency, of the one-time charge product.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/price price}
     */
    price: number
}

export class AdvancedCommerceOneTimeChargeItemValidator implements Validator<AdvancedCommerceOneTimeChargeItem> {
    validate(obj: any): obj is AdvancedCommerceOneTimeChargeItem {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!HelperValidationUtils.validateSku(obj['SKU'])) {
            return false
        }
        if (!HelperValidationUtils.validateDescription(obj['description'])) {
            return false
        }
        if (!HelperValidationUtils.validateDisplayName(obj['displayName'])) {
            return false
        }
        if (!(typeof obj['price'] === "number" || obj['price'] instanceof Number)) {
            return false
        }
        return true
    }
}
