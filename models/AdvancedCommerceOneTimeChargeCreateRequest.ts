// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AbstractAdvancedCommerceInAppRequest } from "./AbstractAdvancedCommerceInAppRequest"
import { AdvancedCommerceOneTimeChargeItem, AdvancedCommerceOneTimeChargeItemValidator } from "./AdvancedCommerceOneTimeChargeItem"
import { AdvancedCommerceRequestInfo, AdvancedCommerceRequestInfoValidator } from "./AdvancedCommerceRequestInfo"
import { Validator } from "./Validator"

/**
 * The request data your app provides when a customer purchases a one-time-charge product.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/onetimechargecreaterequest OneTimeChargeCreateRequest}
 */
export interface AdvancedCommerceOneTimeChargeCreateRequest extends AbstractAdvancedCommerceInAppRequest {

    /**
     * The metadata of the request.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestinfo RequestInfo}
     */
    requestInfo: AdvancedCommerceRequestInfo

    /**
     * The currency of the price of the product.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/currency currency}
     */
    currency: string

    /**
     * The details of the product for purchase.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/onetimechargeitem OneTimeChargeItem}
     */
    item: AdvancedCommerceOneTimeChargeItem

    /**
     * The constant that represents the operation of this request.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/onetimechargecreaterequest OneTimeChargeCreateRequest}
     */
    operation: "CREATE_ONE_TIME_CHARGE"

    /**
     * The storefront for the transaction.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/storefront storefront}
     */
    storefront?: string

    /**
     * The tax code for this product.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/taxcode taxCode}
     */
    taxCode: string

    /**
     * The version number of the API.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/version version}
     */
    version: "1"
}

export class AdvancedCommerceOneTimeChargeCreateRequestValidator implements Validator<AdvancedCommerceOneTimeChargeCreateRequest> {
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()
    static readonly itemValidator = new AdvancedCommerceOneTimeChargeItemValidator()
    validate(obj: any): obj is AdvancedCommerceOneTimeChargeCreateRequest {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
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
        if (obj['operation'] !== "CREATE_ONE_TIME_CHARGE") {
            return false
        }
        if ((typeof obj['storefront'] !== 'undefined') && !(typeof obj['storefront'] === "string" || obj['storefront'] instanceof String)) {
            return false
        }
        if (!(typeof obj['taxCode'] === "string" || obj['taxCode'] instanceof String)) {
            return false
        }
        if (obj['version'] !== "1") {
            return false
        }
        return true
    }
}
