// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from '../helper_validation_utils'
import { AbstractAdvancedCommerceItem } from './AbstractAdvancedCommerceItem'
import { AdvancedCommerceOffer, AdvancedCommerceOfferValidator } from './AdvancedCommerceOffer'
import { Validator } from './Validator'

/**
 * The data that describes a subscription item.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptioncreateitem SubscriptionCreateItem}
 */
export interface AdvancedCommerceSubscriptionCreateItem extends AbstractAdvancedCommerceItem {
    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/offer Offer}
     */
    offer?: AdvancedCommerceOffer

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/price price}
     */
    price: number
}

export class AdvancedCommerceSubscriptionCreateItemValidator implements Validator<AdvancedCommerceSubscriptionCreateItem> {
    static readonly offerValidator = new AdvancedCommerceOfferValidator()

    validate(obj: any): obj is AdvancedCommerceSubscriptionCreateItem {
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

        if (!(typeof obj['price'] === "number")) {
            return false
        }

        return true
    }
}
