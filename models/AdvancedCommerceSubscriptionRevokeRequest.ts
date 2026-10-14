// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceRefundReason, AdvancedCommerceRefundReasonValidator } from "./AdvancedCommerceRefundReason"
import { AdvancedCommerceRefundType, AdvancedCommerceRefundTypeValidator } from "./AdvancedCommerceRefundType"
import { AdvancedCommerceRequest } from "./AdvancedCommerceRequest"
import { AdvancedCommerceRequestInfo, AdvancedCommerceRequestInfoValidator } from "./AdvancedCommerceRequestInfo"
import { Validator } from "./Validator"

/**
 * The request body you provide to terminate a subscription and all its items immediately.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionrevokerequest SubscriptionRevokeRequest}
 */
export interface AdvancedCommerceSubscriptionRevokeRequest extends AdvancedCommerceRequest {

    /**
     * The metadata to include in server requests.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestinfo RequestInfo}
     */
    requestInfo: AdvancedCommerceRequestInfo

    /**
     * A reason to request a refund.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/refundreason refundReason}
     */
    refundReason: AdvancedCommerceRefundReason | string

    /**
     * A Boolean value that indicates whether the App Store asks you for consumption data to help inform the refund decision.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/refundriskingpreference refundRiskingPreference}
     */
    refundRiskingPreference: boolean

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionrevokerequest SubscriptionRevokeRequest}
     */
    refundType: AdvancedCommerceRefundType | string

    /**
     * A three-letter code that represents the country or region associated with the App Store storefront.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/storefront storefront}
     */
    storefront?: string
}

export class AdvancedCommerceSubscriptionRevokeRequestValidator implements Validator<AdvancedCommerceSubscriptionRevokeRequest> {
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()
    static readonly refundReasonValidator = new AdvancedCommerceRefundReasonValidator()
    static readonly refundTypeValidator = new AdvancedCommerceRefundTypeValidator()
    validate(obj: any): obj is AdvancedCommerceSubscriptionRevokeRequest {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(AdvancedCommerceSubscriptionRevokeRequestValidator.requestInfoValidator.validate(obj['requestInfo']))) {
            return false
        }
        if (!(AdvancedCommerceSubscriptionRevokeRequestValidator.refundReasonValidator.validate(obj['refundReason']))) {
            return false
        }
        if (!(typeof obj['refundRiskingPreference'] === "boolean" || obj['refundRiskingPreference'] instanceof Boolean)) {
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
