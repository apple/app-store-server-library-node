// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from "../helper_validation_utils"
import { AbstractAdvancedCommerceItem } from "./AbstractAdvancedCommerceItem"
import { AdvancedCommerceOffer, AdvancedCommerceOfferValidator } from "./AdvancedCommerceOffer"
import { Validator } from "./Validator"

/**
 * The data that describes a subscription item.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptioncreateitem SubscriptionCreateItem}
 */
export interface AdvancedCommerceSubscriptionCreateItem extends AbstractAdvancedCommerceItem {

    /**
     * The item’s product identifier, which you define.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/sku SKU}
     */
    SKU: string

    /**
     * A string you provide that describes a SKU.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/description description}
     */
    description: string

    /**
     * A string with a product name that you can localize and is suitable for display to customers.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/displayname displayName}
     */
    displayName: string

    /**
     * A discount offer for an auto-renewable subscription.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/offer Offer}
     */
    offer?: AdvancedCommerceOffer

    /**
     * A price, in milliunits of a currency, for an Advanced Commerce API SKU.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/price price}
     */
    price: number
}

export class AdvancedCommerceSubscriptionCreateItemValidator implements Validator<AdvancedCommerceSubscriptionCreateItem> {
    static readonly offerValidator = new AdvancedCommerceOfferValidator()
    validate(obj: any): obj is AdvancedCommerceSubscriptionCreateItem {
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
        if ((typeof obj['offer'] !== 'undefined') && !(AdvancedCommerceSubscriptionCreateItemValidator.offerValidator.validate(obj['offer']))) {
            return false
        }
        if (!(typeof obj['price'] === "number" || obj['price'] instanceof Number)) {
            return false
        }
        return true
    }
}
