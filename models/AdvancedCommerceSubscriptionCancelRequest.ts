// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceRequest } from './AdvancedCommerceRequest'
import { AdvancedCommerceRequestInfoValidator } from './AdvancedCommerceRequestInfo'
import { Validator } from './Validator'

/**
 * The request body for turning off automatic renewal of a subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptioncancelrequest SubscriptionCancelRequest}
 */
export interface AdvancedCommerceSubscriptionCancelRequest extends AdvancedCommerceRequest {
    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/storefront storefront}
     **/
    storefront?: string
}

export class AdvancedCommerceSubscriptionCancelRequestValidator implements Validator<AdvancedCommerceSubscriptionCancelRequest> {
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()

    validate(obj: any): obj is AdvancedCommerceSubscriptionCancelRequest {
        if (!(AdvancedCommerceSubscriptionCancelRequestValidator.requestInfoValidator.validate(obj['requestInfo']))) {
            return false
        }
        if ((typeof obj['storefront'] !== 'undefined') && !(typeof obj['storefront'] === "string" || obj['storefront'] instanceof String)) {
            return false
        }
        return true
    }
}
