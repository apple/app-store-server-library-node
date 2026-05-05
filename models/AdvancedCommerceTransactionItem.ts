// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceOffer, AdvancedCommerceOfferValidator } from "./AdvancedCommerceOffer"
import { AdvancedCommerceRefund, AdvancedCommerceRefundValidator } from "./AdvancedCommerceRefund"
import { Validator } from "./Validator"

/**
 * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercetransactionitem advancedCommerceTransactionItem}
 */
export interface AdvancedCommerceTransactionItem {

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
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercerefunds advancedCommerceRefunds}
     **/
    refunds?: AdvancedCommerceRefund[]

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/revocationdate revocationDate}
     **/
    revocationDate?: number
}

export class AdvancedCommerceTransactionItemValidator implements Validator<AdvancedCommerceTransactionItem> {
    static readonly offerValidator = new AdvancedCommerceOfferValidator()
    static readonly refundValidator = new AdvancedCommerceRefundValidator()
    validate(obj: any): obj is AdvancedCommerceTransactionItem {
        if ((typeof obj['SKU'] !== 'undefined') && !(typeof obj['SKU'] === "string" || obj['SKU'] instanceof String)) {
            return false
        }
        if ((typeof obj['description'] !== 'undefined') && !(typeof obj['description'] === "string" || obj['description'] instanceof String)) {
            return false
        }
        if ((typeof obj['displayName'] !== 'undefined') && !(typeof obj['displayName'] === "string" || obj['displayName'] instanceof String)) {
            return false
        }
        if ((typeof obj['offer'] !== 'undefined') && !(AdvancedCommerceTransactionItemValidator.offerValidator.validate(obj['offer']))) {
            return false
        }
        if ((typeof obj['price'] !== 'undefined') && !(typeof obj['price'] === "number")) {
            return false
        }
        if (typeof obj['refunds'] !== 'undefined') {
            if (!Array.isArray(obj['refunds'])) {
                return false
            }
            for (const refund of obj['refunds']) {
                if (!(AdvancedCommerceTransactionItemValidator.refundValidator.validate(refund))) {
                    return false
                }
            }
        }
        if ((typeof obj['revocationDate'] !== 'undefined') && !(typeof obj['revocationDate'] === "number")) {
            return false
        }
        return true
    }
}
