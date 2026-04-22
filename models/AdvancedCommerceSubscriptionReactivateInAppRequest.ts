// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceValidationUtils } from '../advanced_commerce_validation_utils'
import { AbstractAdvancedCommerceInAppRequest } from './AbstractAdvancedCommerceInAppRequest'
import { AdvancedCommerceRequestInfoValidator } from './AdvancedCommerceRequestInfo'
import { AdvancedCommerceSubscriptionReactivateItem, AdvancedCommerceSubscriptionReactivateItemValidator } from './AdvancedCommerceSubscriptionReactivateItem'
import { Validator } from './Validator'

/**
 * The request your app provides to reactivate a subscription that has automatic renewal turned off.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionreactivateinapprequest SubscriptionReactivateInAppRequest}
 */
export interface AdvancedCommerceSubscriptionReactivateInAppRequest extends AbstractAdvancedCommerceInAppRequest {
    operation: "REACTIVATE_SUBSCRIPTION"

    version: "1"

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionreactivateitem SubscriptionReactivateItem}
     */
    items?: AdvancedCommerceSubscriptionReactivateItem[]

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/storefront storefront}
     */
    storefront?: string

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/transactionid transactionId}
     */
    transactionId: string
}

export class AdvancedCommerceSubscriptionReactivateInAppRequestValidator implements Validator<AdvancedCommerceSubscriptionReactivateInAppRequest> {
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()
    static readonly itemValidator = new AdvancedCommerceSubscriptionReactivateItemValidator()

    validate(obj: any): obj is AdvancedCommerceSubscriptionReactivateInAppRequest {
        if (!(AdvancedCommerceSubscriptionReactivateInAppRequestValidator.requestInfoValidator.validate(obj['requestInfo']))) {
            return false
        }
        if (!(typeof obj['operation'] === "string" || obj['operation'] instanceof String)) {
            return false
        }
        if (!(typeof obj['version'] === "string" || obj['version'] instanceof String)) {
            return false
        }
        if (typeof obj['items'] !== 'undefined') {
            if (!AdvancedCommerceValidationUtils.validateItems(obj['items'])) {
                return false
            }
            for (const item of obj['items']) {
                if (!AdvancedCommerceSubscriptionReactivateInAppRequestValidator.itemValidator.validate(item)) {
                    return false
                }
            }
        }
        if ((typeof obj['storefront'] !== 'undefined') && !(typeof obj['storefront'] === "string" || obj['storefront'] instanceof String)) {
            return false
        }
        if (!(typeof obj['transactionId'] === "string" || obj['transactionId'] instanceof String)) {
            return false
        }
        return true
    }
}
