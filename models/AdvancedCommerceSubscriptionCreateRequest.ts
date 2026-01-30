// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceValidationUtils } from '../advanced_commerce_validation_utils'
import { AbstractAdvancedCommerceInAppRequest } from './AbstractAdvancedCommerceInAppRequest'
import { AdvancedCommerceDescriptors, AdvancedCommerceDescriptorsValidator } from './AdvancedCommerceDescriptors'
import { AdvancedCommerceSubscriptionCreateItem, AdvancedCommerceSubscriptionCreateItemValidator } from './AdvancedCommerceSubscriptionCreateItem'
import { AdvancedCommercePeriod, AdvancedCommercePeriodValidator } from './AdvancedCommercePeriod'
import { AdvancedCommerceRequestInfoValidator } from './AdvancedCommerceRequestInfo'
import { Validator } from './Validator'

/**
 * The request data your app provides when a customer purchases an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptioncreaterequest SubscriptionCreateRequest}
 */
export interface AdvancedCommerceSubscriptionCreateRequest extends AbstractAdvancedCommerceInAppRequest {
    operation: "CREATE_SUBSCRIPTION"

    version: "1"

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/currency currency}
     */
    currency: string

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/descriptors descriptors}
     */
    descriptors: AdvancedCommerceDescriptors

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptioncreateitem SubscriptionCreateItem}
     */
    items: AdvancedCommerceSubscriptionCreateItem[]

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/period period}
     */
    period: AdvancedCommercePeriod | string

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/transactionid transactionId}
     */
    previousTransactionId?: string

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/storefront storefront}
     */
    storefront?: string

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/taxCode taxCode}
     */
    taxCode: string
}

export class AdvancedCommerceSubscriptionCreateRequestValidator implements Validator<AdvancedCommerceSubscriptionCreateRequest> {
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()
    static readonly descriptorsValidator = new AdvancedCommerceDescriptorsValidator()
    static readonly itemValidator = new AdvancedCommerceSubscriptionCreateItemValidator()
    static readonly periodValidator = new AdvancedCommercePeriodValidator()

    validate(obj: any): obj is AdvancedCommerceSubscriptionCreateRequest {
        if (!(AdvancedCommerceSubscriptionCreateRequestValidator.requestInfoValidator.validate(obj['requestInfo']))) {
            return false
        }
        if (!(typeof obj['operation'] === "string" || obj['operation'] instanceof String)) {
            return false
        }
        if (!(typeof obj['version'] === "string" || obj['version'] instanceof String)) {
            return false
        }
        if (!(typeof obj['currency'] === "string" || obj['currency'] instanceof String)) {
            return false
        }
        if (!(AdvancedCommerceSubscriptionCreateRequestValidator.descriptorsValidator.validate(obj['descriptors']))) {
            return false
        }
        if (!AdvancedCommerceValidationUtils.validateItems(obj['items'])) {
            return false
        }
        for (const item of obj['items']) {
            if (!AdvancedCommerceSubscriptionCreateRequestValidator.itemValidator.validate(item)) {
                return false
            }
        }
        if (!(AdvancedCommerceSubscriptionCreateRequestValidator.periodValidator.validate(obj['period']))) {
            return false
        }
        if ((typeof obj['previousTransactionId'] !== 'undefined') && !(typeof obj['previousTransactionId'] === "string" || obj['previousTransactionId'] instanceof String)) {
            return false
        }
        if ((typeof obj['storefront'] !== 'undefined') && !(typeof obj['storefront'] === "string" || obj['storefront'] instanceof String)) {
            return false
        }
        if (!(typeof obj['taxCode'] === "string" || obj['taxCode'] instanceof String)) {
            return false
        }
        return true
    }
}
