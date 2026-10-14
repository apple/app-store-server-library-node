// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from "../helper_validation_utils"
import { AbstractAdvancedCommerceItem } from "./AbstractAdvancedCommerceItem"
import { AdvancedCommerceOffer, AdvancedCommerceOfferValidator } from "./AdvancedCommerceOffer"
import { Validator } from "./Validator"

/**
 * The data your app provides to add items when it makes changes to an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifyadditem SubscriptionModifyAddItem}
 */
export interface AdvancedCommerceSubscriptionModifyAddItem extends AbstractAdvancedCommerceItem {

    /**
     * The product identifier of an Apple In-App Purchase product you manage in your own system.
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

    /**
     * A prorated price, in milliunits of a currency, for an Advanced Commerce API SKU.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/proratedprice proratedPrice}
     */
    proratedPrice?: number
}

export class AdvancedCommerceSubscriptionModifyAddItemValidator implements Validator<AdvancedCommerceSubscriptionModifyAddItem> {
    static readonly offerValidator = new AdvancedCommerceOfferValidator()
    validate(obj: any): obj is AdvancedCommerceSubscriptionModifyAddItem {
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
        if ((typeof obj['offer'] !== 'undefined') && !(AdvancedCommerceSubscriptionModifyAddItemValidator.offerValidator.validate(obj['offer']))) {
            return false
        }
        if (!(typeof obj['price'] === "number" || obj['price'] instanceof Number)) {
            return false
        }
        if ((typeof obj['proratedPrice'] !== 'undefined') && !(typeof obj['proratedPrice'] === "number" || obj['proratedPrice'] instanceof Number)) {
            return false
        }
        return true
    }
}
