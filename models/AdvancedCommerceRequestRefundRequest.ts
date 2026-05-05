// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from '../helper_validation_utils'
import { AdvancedCommerceRequest } from './AdvancedCommerceRequest'
import { AdvancedCommerceRequestInfoValidator } from './AdvancedCommerceRequestInfo'
import { AdvancedCommerceRequestRefundItem, AdvancedCommerceRequestRefundItemValidator } from './AdvancedCommerceRequestRefundItem'
import { Validator } from './Validator'

/**
 * The request body for requesting a refund for a transaction.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestrefundrequest RequestRefundRequest}
 */
export interface AdvancedCommerceRequestRefundRequest extends AdvancedCommerceRequest {
    /**
     * The currency of the transaction.
     * 
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/currency currency}
     **/
    currency?: string

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestrefunditem RequestRefundItem}
     **/
    items: AdvancedCommerceRequestRefundItem[]

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/refundriskingpreference RefundRiskingPreference}
     **/
    refundRiskingPreference: boolean

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/storefront storefront}
     **/
    storefront?: string
}

export class AdvancedCommerceRequestRefundRequestValidator implements Validator<AdvancedCommerceRequestRefundRequest> {
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()
    static readonly itemValidator = new AdvancedCommerceRequestRefundItemValidator()

    validate(obj: any): obj is AdvancedCommerceRequestRefundRequest {
        if (!(AdvancedCommerceRequestRefundRequestValidator.requestInfoValidator.validate(obj['requestInfo']))) {
            return false
        }
        if ((typeof obj['currency'] !== 'undefined') && !(typeof obj['currency'] === "string" || obj['currency'] instanceof String)) {
            return false
        }
        if (!HelperValidationUtils.validateItems(obj['items'])) {
            return false
        }
        for (const item of obj['items']) {
            if (!AdvancedCommerceRequestRefundRequestValidator.itemValidator.validate(item)) {
                return false
            }
        }
        if (!(typeof obj['refundRiskingPreference'] === "boolean")) {
            return false
        }
        if ((typeof obj['storefront'] !== 'undefined') && !(typeof obj['storefront'] === "string" || obj['storefront'] instanceof String)) {
            return false
        }
        return true
    }
}
