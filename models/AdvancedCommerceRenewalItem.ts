// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceOffer, AdvancedCommerceOfferValidator } from "./AdvancedCommerceOffer"
import { AdvancedCommercePriceIncreaseInfo, AdvancedCommercePriceIncreaseInfoValidator } from "./AdvancedCommercePriceIncreaseInfo"
import { Validator } from "./Validator"

/**
 * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercerenewalitem advancedCommerceRenewalItem}
 */
export interface AdvancedCommerceRenewalItem {

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercesku advancedCommerceSKU}
     **/
    SKU?: string

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercedescription advancedCommerceDescription}
     **/
    description?: string

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercedisplayname advancedCommerceDisplayName}
     **/
    displayName?: string

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommerceoffer advancedCommerceOffer}
     **/
    offer?: AdvancedCommerceOffer

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommerceprice advancedCommercePrice}
     **/
    price?: number

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercepriceincreaseinfo advancedCommercePriceIncreaseInfo}
     **/
    priceIncreaseInfo?: AdvancedCommercePriceIncreaseInfo
}

export class AdvancedCommerceRenewalItemValidator implements Validator<AdvancedCommerceRenewalItem> {
    static readonly offerValidator = new AdvancedCommerceOfferValidator()
    static readonly priceIncreaseInfoValidator = new AdvancedCommercePriceIncreaseInfoValidator()
    validate(obj: any): obj is AdvancedCommerceRenewalItem {
        if ((typeof obj['SKU'] !== 'undefined') && !(typeof obj['SKU'] === "string" || obj['SKU'] instanceof String)) {
            return false
        }
        if ((typeof obj['description'] !== 'undefined') && !(typeof obj['description'] === "string" || obj['description'] instanceof String)) {
            return false
        }
        if ((typeof obj['displayName'] !== 'undefined') && !(typeof obj['displayName'] === "string" || obj['displayName'] instanceof String)) {
            return false
        }
        if ((typeof obj['offer'] !== 'undefined') && !(AdvancedCommerceRenewalItemValidator.offerValidator.validate(obj['offer']))) {
            return false
        }
        if ((typeof obj['price'] !== 'undefined') && !(typeof obj['price'] === "number")) {
            return false
        }
        if ((typeof obj['priceIncreaseInfo'] !== 'undefined') && !(AdvancedCommerceRenewalItemValidator.priceIncreaseInfoValidator.validate(obj['priceIncreaseInfo']))) {
            return false
        }
        return true
    }
}
