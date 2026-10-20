// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from "../helper_validation_utils"
import { AbstractAdvancedCommerceItem } from "./AbstractAdvancedCommerceItem"
import { AdvancedCommerceEffective, AdvancedCommerceEffectiveValidator } from "./AdvancedCommerceEffective"
import { AdvancedCommerceOffer, AdvancedCommerceOfferValidator } from "./AdvancedCommerceOffer"
import { AdvancedCommerceReason, AdvancedCommerceReasonValidator } from "./AdvancedCommerceReason"
import { Validator } from "./Validator"

/**
 * The data your app provides to change an item of an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifychangeitem SubscriptionModifyChangeItem}
 */
export interface AdvancedCommerceSubscriptionModifyChangeItem extends AbstractAdvancedCommerceItem {

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
     * The product identifier of an Apple In-App Purchase product you manage in your own system.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/sku SKU}
     */
    currentSKU: string

    /**
     * A string value that indicates when a requested change to an auto-renewable subscription goes into effect.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/effective effective}
     */
    effective: AdvancedCommerceEffective | string

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

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifychangeitem SubscriptionModifyChangeItem}
     */
    reason: AdvancedCommerceReason | string
}

export class AdvancedCommerceSubscriptionModifyChangeItemValidator implements Validator<AdvancedCommerceSubscriptionModifyChangeItem> {
    static readonly effectiveValidator = new AdvancedCommerceEffectiveValidator()
    static readonly offerValidator = new AdvancedCommerceOfferValidator()
    static readonly reasonValidator = new AdvancedCommerceReasonValidator()
    validate(obj: any): obj is AdvancedCommerceSubscriptionModifyChangeItem {
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
        if (!HelperValidationUtils.validateSku(obj['currentSKU'])) {
            return false
        }
        if (!(AdvancedCommerceSubscriptionModifyChangeItemValidator.effectiveValidator.validate(obj['effective']))) {
            return false
        }
        if ((typeof obj['offer'] !== 'undefined') && !(AdvancedCommerceSubscriptionModifyChangeItemValidator.offerValidator.validate(obj['offer']))) {
            return false
        }
        if (!(typeof obj['price'] === "number" || obj['price'] instanceof Number)) {
            return false
        }
        if ((typeof obj['proratedPrice'] !== 'undefined') && !(typeof obj['proratedPrice'] === "number" || obj['proratedPrice'] instanceof Number)) {
            return false
        }
        if (!(AdvancedCommerceSubscriptionModifyChangeItemValidator.reasonValidator.validate(obj['reason']))) {
            return false
        }
        return true
    }
}
