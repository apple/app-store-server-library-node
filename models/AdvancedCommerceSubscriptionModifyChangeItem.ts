// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceValidationUtils } from '../advanced_commerce_validation_utils'
import { AbstractAdvancedCommerceItem } from './AbstractAdvancedCommerceItem'
import { AdvancedCommerceEffective, AdvancedCommerceEffectiveValidator } from './AdvancedCommerceEffective'
import { AdvancedCommerceOffer, AdvancedCommerceOfferValidator } from './AdvancedCommerceOffer'
import { AdvancedCommerceReason, AdvancedCommerceReasonValidator } from './AdvancedCommerceReason'
import { Validator } from './Validator'

/**
 * The data your app provides to change an item of an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifychangeitem SubscriptionModifyChangeItem}
 */
export interface AdvancedCommerceSubscriptionModifyChangeItem extends AbstractAdvancedCommerceItem {
    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/sku SKU}
     */
    currentSKU: string

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/effective effective}
     */
    effective: AdvancedCommerceEffective | string

    /**
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

    reason: AdvancedCommerceReason | string
}

export class AdvancedCommerceSubscriptionModifyChangeItemValidator implements Validator<AdvancedCommerceSubscriptionModifyChangeItem> {
    static readonly effectiveValidator = new AdvancedCommerceEffectiveValidator()
    static readonly offerValidator = new AdvancedCommerceOfferValidator()
    static readonly reasonValidator = new AdvancedCommerceReasonValidator()

    validate(obj: any): obj is AdvancedCommerceSubscriptionModifyChangeItem {
        if (!AdvancedCommerceValidationUtils.validateSku(obj['SKU'])) {
            return false
        }

        if (!AdvancedCommerceValidationUtils.validateDescription(obj['description'])) {
            return false
        }

        if (!AdvancedCommerceValidationUtils.validateDisplayName(obj['displayName'])) {
            return false
        }

        if (!AdvancedCommerceValidationUtils.validateSku(obj['currentSKU'])) {
            return false
        }

        if (!(AdvancedCommerceSubscriptionModifyChangeItemValidator.effectiveValidator.validate(obj['effective']))) {
            return false
        }

        if ((typeof obj['offer'] !== 'undefined') && !(AdvancedCommerceSubscriptionModifyChangeItemValidator.offerValidator.validate(obj['offer']))) {
            return false
        }

        if (!(typeof obj['price'] === "number")) {
            return false
        }

        if ((typeof obj['proratedPrice'] !== 'undefined') && !(typeof obj['proratedPrice'] === "number")) {
            return false
        }

        if (!(AdvancedCommerceSubscriptionModifyChangeItemValidator.reasonValidator.validate(obj['reason']))) {
            return false
        }

        return true
    }
}
