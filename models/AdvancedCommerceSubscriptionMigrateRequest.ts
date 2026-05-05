// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from '../helper_validation_utils'
import { AdvancedCommerceRequest } from './AdvancedCommerceRequest'
import { AdvancedCommerceRequestInfoValidator } from './AdvancedCommerceRequestInfo'
import { AdvancedCommerceSubscriptionMigrateDescriptors, AdvancedCommerceSubscriptionMigrateDescriptorsValidator } from './AdvancedCommerceSubscriptionMigrateDescriptors'
import { AdvancedCommerceSubscriptionMigrateItem, AdvancedCommerceSubscriptionMigrateItemValidator } from './AdvancedCommerceSubscriptionMigrateItem'
import { AdvancedCommerceSubscriptionMigrateRenewalItem, AdvancedCommerceSubscriptionMigrateRenewalItemValidator } from './AdvancedCommerceSubscriptionMigrateRenewalItem'
import { Validator } from './Validator'

/**
 * The subscription details you provide to migrate a subscription from In-App Purchase to the Advanced Commerce API, such as descriptors, items, storefront, and more.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmigraterequest SubscriptionMigrateRequest}
 */
export interface AdvancedCommerceSubscriptionMigrateRequest extends AdvancedCommerceRequest {
    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmigratedescriptors SubscriptionMigrateDescriptors}
     */
    descriptors: AdvancedCommerceSubscriptionMigrateDescriptors

    /**
     * An array of one or more SKUs, along with descriptions and display names, that are included in the subscription.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmigrateitem SubscriptionMigrateItem}
     */
    items: AdvancedCommerceSubscriptionMigrateItem[]

    /**
     * An optional array of subscription items that represents the items that renew at the next renewal period, if they differ from items.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmigraterenewalitem SubscriptionMigrateRenewalItem}
     */
    renewalItems?: AdvancedCommerceSubscriptionMigrateRenewalItem[]

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/storefront storefront}
     */
    storefront?: string

    /**
     * Your generic product ID for an auto-renewable subscription.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/targetproductid targetProductId}
     */
    targetProductId: string

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/taxcode taxCode}
     */
    taxCode: string
}

export class AdvancedCommerceSubscriptionMigrateRequestValidator implements Validator<AdvancedCommerceSubscriptionMigrateRequest> {
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()
    static readonly descriptorsValidator = new AdvancedCommerceSubscriptionMigrateDescriptorsValidator()
    static readonly itemValidator = new AdvancedCommerceSubscriptionMigrateItemValidator()
    static readonly renewalItemValidator = new AdvancedCommerceSubscriptionMigrateRenewalItemValidator()

    validate(obj: any): obj is AdvancedCommerceSubscriptionMigrateRequest {
        if (!(AdvancedCommerceSubscriptionMigrateRequestValidator.requestInfoValidator.validate(obj['requestInfo']))) {
            return false
        }
        if (!(AdvancedCommerceSubscriptionMigrateRequestValidator.descriptorsValidator.validate(obj['descriptors']))) {
            return false
        }
        if (!HelperValidationUtils.validateItems(obj['items'])) {
            return false
        }
        for (const item of obj['items']) {
            if (!AdvancedCommerceSubscriptionMigrateRequestValidator.itemValidator.validate(item)) {
                return false
            }
        }
        if (typeof obj['renewalItems'] !== 'undefined') {
            if (!HelperValidationUtils.validateItems(obj['renewalItems'])) {
                return false
            }
            for (const item of obj['renewalItems']) {
                if (!AdvancedCommerceSubscriptionMigrateRequestValidator.renewalItemValidator.validate(item)) {
                    return false
                }
            }
        }
        if ((typeof obj['storefront'] !== 'undefined') && !(typeof obj['storefront'] === "string" || obj['storefront'] instanceof String)) {
            return false
        }
        if (!(typeof obj['targetProductId'] === "string" || obj['targetProductId'] instanceof String)) {
            return false
        }
        if (!(typeof obj['taxCode'] === "string" || obj['taxCode'] instanceof String)) {
            return false
        }
        return true
    }
}
