// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from "../helper_validation_utils"
import { AdvancedCommerceRequest } from "./AdvancedCommerceRequest"
import { AdvancedCommerceRequestInfo, AdvancedCommerceRequestInfoValidator } from "./AdvancedCommerceRequestInfo"
import { AdvancedCommerceRequestRefundItem, AdvancedCommerceRequestRefundItemValidator } from "./AdvancedCommerceRequestRefundItem"
import { Validator } from "./Validator"

/**
 * The request body for requesting a refund for a transaction.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestrefundrequest RequestRefundRequest}
 */
export interface AdvancedCommerceRequestRefundRequest extends AdvancedCommerceRequest {

    /**
     * The metadata to include in server requests.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestinfo RequestInfo}
     */
    requestInfo: AdvancedCommerceRequestInfo

    /**
     * The currency of the transaction.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/currency currency}
     */
    currency?: string

    /**
     * Information about the refund request for an item, such as its SKU, the refund amount, reason, and type.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestrefunditem RequestRefundItem}
     */
    items: AdvancedCommerceRequestRefundItem[]

    /**
     * A Boolean value that indicates whether the App Store asks you for consumption data to help inform the refund decision.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/refundriskingpreference refundRiskingPreference}
     */
    refundRiskingPreference: boolean

    /**
     * A three-letter code that represents the country or region associated with the App Store storefront.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/storefront storefront}
     */
    storefront?: string
}

export class AdvancedCommerceRequestRefundRequestValidator implements Validator<AdvancedCommerceRequestRefundRequest> {
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()
    static readonly itemValidator = new AdvancedCommerceRequestRefundItemValidator()
    validate(obj: any): obj is AdvancedCommerceRequestRefundRequest {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
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
            if (!(AdvancedCommerceRequestRefundRequestValidator.itemValidator.validate(item))) {
                return false
            }
        }
        if (!(typeof obj['refundRiskingPreference'] === "boolean" || obj['refundRiskingPreference'] instanceof Boolean)) {
            return false
        }
        if ((typeof obj['storefront'] !== 'undefined') && !(typeof obj['storefront'] === "string" || obj['storefront'] instanceof String)) {
            return false
        }
        return true
    }
}
