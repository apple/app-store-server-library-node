// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceValidationUtils } from '../advanced_commerce_validation_utils'
import { AbstractAdvancedCommerceBaseItem } from './AbstractAdvancedCommerceBaseItem'
import { AdvancedCommerceRefundReason, AdvancedCommerceRefundReasonValidator } from './AdvancedCommerceRefundReason'
import { AdvancedCommerceRefundType, AdvancedCommerceRefundTypeValidator } from './AdvancedCommerceRefundType'
import { Validator } from './Validator'

/**
 * Information about the refund request for an item, such as its SKU, the refund amount, reason, and type.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestrefunditem RequestRefundItem}
 */
export interface AdvancedCommerceRequestRefundItem extends AbstractAdvancedCommerceBaseItem {
    /**
     * The refund amount you're requesting for the SKU, in milliunits of the currency.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/refundamount refundAmount}
     **/
    refundAmount?: number

    /**
     * The reason for the refund request.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/refundreason refundReason}
     **/
    refundReason: AdvancedCommerceRefundReason | string

    /**
     * The type of refund requested.
     **/
    refundType: AdvancedCommerceRefundType | string

    revoke: boolean
}

export class AdvancedCommerceRequestRefundItemValidator implements Validator<AdvancedCommerceRequestRefundItem> {
    static readonly refundReasonValidator = new AdvancedCommerceRefundReasonValidator()
    static readonly refundTypeValidator = new AdvancedCommerceRefundTypeValidator()

    validate(obj: any): obj is AdvancedCommerceRequestRefundItem {
        if (!AdvancedCommerceValidationUtils.validateSku(obj['SKU'])) {
            return false
        }

        if ((typeof obj['refundAmount'] !== 'undefined') && !(typeof obj['refundAmount'] === "number")) {
            return false
        }

        if (!(AdvancedCommerceRequestRefundItemValidator.refundReasonValidator.validate(obj['refundReason']))) {
            return false
        }

        if (!(AdvancedCommerceRequestRefundItemValidator.refundTypeValidator.validate(obj['refundType']))) {
            return false
        }

        if (!(typeof obj['revoke'] === "boolean" || obj['revoke'] instanceof Boolean)) {
            return false
        }

        return true
    }
}
