// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from '../helper_validation_utils'
import { AbstractAdvancedCommerceItem } from './AbstractAdvancedCommerceItem'
import { AdvancedCommerceOffer, AdvancedCommerceOfferValidator } from './AdvancedCommerceOffer'
import { Validator } from './Validator'

/**
 * The data your app provides to add items when it makes changes to an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifyadditem SubscriptionModifyAddItem}
 */
export interface AdvancedCommerceSubscriptionModifyAddItem extends AbstractAdvancedCommerceItem {
    /**
     * A discount offer for an auto-renewable subscription.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/offer Offer}
     */
    offer?: AdvancedCommerceOffer

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/price price}
     */
    price: number

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/proratedprice proratedPrice}
     */
    proratedPrice?: number
}

export class AdvancedCommerceSubscriptionModifyAddItemValidator implements Validator<AdvancedCommerceSubscriptionModifyAddItem> {
    static readonly offerValidator = new AdvancedCommerceOfferValidator()

    validate(obj: any): obj is AdvancedCommerceSubscriptionModifyAddItem {
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

        if (!(typeof obj['price'] === "number")) {
            return false
        }

        if ((typeof obj['proratedPrice'] !== 'undefined') && !(typeof obj['proratedPrice'] === "number")) {
            return false
        }

        return true
    }
}
