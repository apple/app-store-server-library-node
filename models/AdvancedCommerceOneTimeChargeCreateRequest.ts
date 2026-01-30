// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AbstractAdvancedCommerceInAppRequest } from './AbstractAdvancedCommerceInAppRequest'
import { AdvancedCommerceOneTimeChargeItem, AdvancedCommerceOneTimeChargeItemValidator } from './AdvancedCommerceOneTimeChargeItem'
import { AdvancedCommerceRequestInfoValidator } from './AdvancedCommerceRequestInfo'
import { Validator } from './Validator'

/**
 * The request data your app provides when a customer purchases a one-time-charge product.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/onetimechargecreaterequest OneTimeChargeCreateRequest}
 */
export interface AdvancedCommerceOneTimeChargeCreateRequest extends AbstractAdvancedCommerceInAppRequest {
    /**
     * The constant that represents the operation of this request.
     */
    operation: "CREATE_ONE_TIME_CHARGE"

    /**
     * The version number of the API.
     */
    version: "1"

    /**
     * The currency of the price of the product.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/currency currency}
     **/
    currency: string

    /**
     * The details of the product for purchase.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/onetimechargeitem OneTimeChargeItem}
     **/
    item: AdvancedCommerceOneTimeChargeItem

    /**
     * The storefront for the transaction.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/storefront storefront}
     **/
    storefront?: string

    /**
     * The tax code for this product.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/taxCode taxCode}
     **/
    taxCode: string
}

export class AdvancedCommerceOneTimeChargeCreateRequestValidator implements Validator<AdvancedCommerceOneTimeChargeCreateRequest> {
    static readonly itemValidator = new AdvancedCommerceOneTimeChargeItemValidator()
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()

    validate(obj: any): obj is AdvancedCommerceOneTimeChargeCreateRequest {
        if (!(typeof obj['operation'] === "string" || obj['operation'] instanceof String)) {
            return false
        }

        if (!(typeof obj['version'] === "string" || obj['version'] instanceof String)) {
            return false
        }

        if (!(AdvancedCommerceOneTimeChargeCreateRequestValidator.requestInfoValidator.validate(obj['requestInfo']))) {
            return false
        }

        if (!(typeof obj['currency'] === "string" || obj['currency'] instanceof String)) {
            return false
        }

        if (!(AdvancedCommerceOneTimeChargeCreateRequestValidator.itemValidator.validate(obj['item']))) {
            return false
        }

        if ((typeof obj['storefront'] !== 'undefined') && !(typeof obj['storefront'] === "string" || obj['storefront'] instanceof String)) {
            return false
        }

        if (!(typeof obj['taxCode'] === "string" || obj['taxCode'] instanceof String)) {
            return false
        }

        return true
    }
}
