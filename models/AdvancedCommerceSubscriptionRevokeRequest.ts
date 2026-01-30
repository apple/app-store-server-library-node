// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceRequest } from './AdvancedCommerceRequest'
import { AdvancedCommerceRequestInfoValidator } from './AdvancedCommerceRequestInfo'
import { AdvancedCommerceRefundReason, AdvancedCommerceRefundReasonValidator } from './AdvancedCommerceRefundReason'
import { AdvancedCommerceRefundType, AdvancedCommerceRefundTypeValidator } from './AdvancedCommerceRefundType'
import { Validator } from './Validator'

/**
 * The request body you provide to terminate a subscription and all its items immediately.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionrevokerequest SubscriptionRevokeRequest}
 */
export interface AdvancedCommerceSubscriptionRevokeRequest extends AdvancedCommerceRequest {
    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/refundreason refundReason}
     */
    refundReason: AdvancedCommerceRefundReason | string

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/refundriskingpreference refundRiskingPreference}
     */
    refundRiskingPreference: boolean

    refundType: AdvancedCommerceRefundType | string

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/storefront storefront}
     */
    storefront?: string
}

export class AdvancedCommerceSubscriptionRevokeRequestValidator implements Validator<AdvancedCommerceSubscriptionRevokeRequest> {
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()
    static readonly refundReasonValidator = new AdvancedCommerceRefundReasonValidator()
    static readonly refundTypeValidator = new AdvancedCommerceRefundTypeValidator()

    validate(obj: any): obj is AdvancedCommerceSubscriptionRevokeRequest {
        if (!(AdvancedCommerceSubscriptionRevokeRequestValidator.requestInfoValidator.validate(obj['requestInfo']))) {
            return false
        }
        if (!(AdvancedCommerceSubscriptionRevokeRequestValidator.refundReasonValidator.validate(obj['refundReason']))) {
            return false
        }
        if (!(typeof obj['refundRiskingPreference'] === "boolean")) {
            return false
        }
        if (!(AdvancedCommerceSubscriptionRevokeRequestValidator.refundTypeValidator.validate(obj['refundType']))) {
            return false
        }
        if ((typeof obj['storefront'] !== 'undefined') && !(typeof obj['storefront'] === "string" || obj['storefront'] instanceof String)) {
            return false
        }
        return true
    }
}
