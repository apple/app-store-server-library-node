// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from '../helper_validation_utils'
import { AdvancedCommerceRequest } from './AdvancedCommerceRequest'
import { AdvancedCommerceRequestInfoValidator } from './AdvancedCommerceRequestInfo'
import { AdvancedCommerceSubscriptionPriceChangeItem, AdvancedCommerceSubscriptionPriceChangeItemValidator } from './AdvancedCommerceSubscriptionPriceChangeItem'
import { Validator } from './Validator'

/**
 * The request body you use to change the price of an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionpricechangerequest SubscriptionPriceChangeRequest}
 */
export interface AdvancedCommerceSubscriptionPriceChangeRequest extends AdvancedCommerceRequest {
    /**
     * The currency of the prices.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/currency currency}
     */
    currency?: string

    /**
     * An array that contains one or more SKUs and the changed price for each SKU.
     * 
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionpricechangeitem SubscriptionPriceChangeItem}
     */
    items: AdvancedCommerceSubscriptionPriceChangeItem[]

    /**
     * The App Store storefront of the subscription.
     * 
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/storefront storefront}
     */
    storefront?: string
}

export class AdvancedCommerceSubscriptionPriceChangeRequestValidator implements Validator<AdvancedCommerceSubscriptionPriceChangeRequest> {
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()
    static readonly itemValidator = new AdvancedCommerceSubscriptionPriceChangeItemValidator()

    validate(obj: any): obj is AdvancedCommerceSubscriptionPriceChangeRequest {
        if (!(AdvancedCommerceSubscriptionPriceChangeRequestValidator.requestInfoValidator.validate(obj['requestInfo']))) {
            return false
        }
        if ((typeof obj['currency'] !== 'undefined') && !(typeof obj['currency'] === "string" || obj['currency'] instanceof String)) {
            return false
        }
        if (!HelperValidationUtils.validateItems(obj['items'])) {
            return false
        }
        for (const item of obj['items']) {
            if (!AdvancedCommerceSubscriptionPriceChangeRequestValidator.itemValidator.validate(item)) {
                return false
            }
        }
        if ((typeof obj['storefront'] !== 'undefined') && !(typeof obj['storefront'] === "string" || obj['storefront'] instanceof String)) {
            return false
        }
        return true
    }
}
