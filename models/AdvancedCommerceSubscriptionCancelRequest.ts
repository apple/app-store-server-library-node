// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceRequest } from "./AdvancedCommerceRequest"
import { AdvancedCommerceRequestInfo, AdvancedCommerceRequestInfoValidator } from "./AdvancedCommerceRequestInfo"
import { Validator } from "./Validator"

/**
 * The request body for turning off automatic renewal of a subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptioncancelrequest SubscriptionCancelRequest}
 */
export interface AdvancedCommerceSubscriptionCancelRequest extends AdvancedCommerceRequest {

    /**
     * The metadata to include in server requests.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestinfo RequestInfo}
     */
    requestInfo: AdvancedCommerceRequestInfo

    /**
     * A three-letter code that represents the country or region associated with the App Store storefront.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/storefront storefront}
     */
    storefront?: string
}

export class AdvancedCommerceSubscriptionCancelRequestValidator implements Validator<AdvancedCommerceSubscriptionCancelRequest> {
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()
    validate(obj: any): obj is AdvancedCommerceSubscriptionCancelRequest {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(AdvancedCommerceSubscriptionCancelRequestValidator.requestInfoValidator.validate(obj['requestInfo']))) {
            return false
        }
        if ((typeof obj['storefront'] !== 'undefined') && !(typeof obj['storefront'] === "string" || obj['storefront'] instanceof String)) {
            return false
        }
        return true
    }
}
