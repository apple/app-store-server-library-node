// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceRefundReason, AdvancedCommerceRefundReasonValidator } from "./AdvancedCommerceRefundReason"
import { AdvancedCommerceRefundType, AdvancedCommerceRefundTypeValidator } from "./AdvancedCommerceRefundType"
import { Validator } from "./Validator"

/**
 * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercerefund advancedCommerceRefund}
 */
export interface AdvancedCommerceRefund {

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercerefundamount advancedCommerceRefundAmount}
     **/
    refundAmount?: number

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercerefunddate advancedCommerceRefundDate}
     **/
    refundDate?: number

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercerefundreason advancedCommerceRefundReason}
     **/
    refundReason?: AdvancedCommerceRefundReason | string

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercerefundtype advancedCommerceRefundType}
     **/
    refundType?: AdvancedCommerceRefundType | string
}

export class AdvancedCommerceRefundValidator implements Validator<AdvancedCommerceRefund> {
    static readonly refundReasonValidator = new AdvancedCommerceRefundReasonValidator()
    static readonly refundTypeValidator = new AdvancedCommerceRefundTypeValidator()
    validate(obj: any): obj is AdvancedCommerceRefund {
        if ((typeof obj['refundAmount'] !== 'undefined') && !(typeof obj['refundAmount'] === "number")) {
            return false
        }
        if ((typeof obj['refundDate'] !== 'undefined') && !(typeof obj['refundDate'] === "number")) {
            return false
        }
        if ((typeof obj['refundReason'] !== 'undefined') && !(AdvancedCommerceRefundValidator.refundReasonValidator.validate(obj['refundReason']))) {
            return false
        }
        if ((typeof obj['refundType'] !== 'undefined') && !(AdvancedCommerceRefundValidator.refundTypeValidator.validate(obj['refundType']))) {
            return false
        }
        return true
    }
}
