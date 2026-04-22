// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceRequest } from './AdvancedCommerceRequest'
import { AdvancedCommerceRequestInfoValidator } from './AdvancedCommerceRequestInfo'
import { AdvancedCommerceSubscriptionChangeMetadataDescriptors, AdvancedCommerceSubscriptionChangeMetadataDescriptorsValidator } from './AdvancedCommerceSubscriptionChangeMetadataDescriptors'
import { AdvancedCommerceSubscriptionChangeMetadataItem, AdvancedCommerceSubscriptionChangeMetadataItemValidator } from './AdvancedCommerceSubscriptionChangeMetadataItem'
import { Validator } from './Validator'

/**
 * The request body you provide to change the metadata of a subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionchangemetadatarequest SubscriptionChangeMetadataRequest}
 */
export interface AdvancedCommerceSubscriptionChangeMetadataRequest extends AdvancedCommerceRequest {
    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionchangemetadatadescriptors SubscriptionChangeMetadataDescriptors}
     **/
    descriptors?: AdvancedCommerceSubscriptionChangeMetadataDescriptors

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionchangemetadataitem SubscriptionChangeMetadataItem}
     **/
    items?: AdvancedCommerceSubscriptionChangeMetadataItem[]

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/storefront storefront}
     **/
    storefront?: string

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/taxcode taxCode}
     **/
    taxCode?: string
}

export class AdvancedCommerceSubscriptionChangeMetadataRequestValidator implements Validator<AdvancedCommerceSubscriptionChangeMetadataRequest> {
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()
    static readonly descriptorsValidator = new AdvancedCommerceSubscriptionChangeMetadataDescriptorsValidator()
    static readonly itemValidator = new AdvancedCommerceSubscriptionChangeMetadataItemValidator()

    validate(obj: any): obj is AdvancedCommerceSubscriptionChangeMetadataRequest {
        if (!(AdvancedCommerceSubscriptionChangeMetadataRequestValidator.requestInfoValidator.validate(obj['requestInfo']))) {
            return false
        }
        if ((typeof obj['descriptors'] !== 'undefined') && !(AdvancedCommerceSubscriptionChangeMetadataRequestValidator.descriptorsValidator.validate(obj['descriptors']))) {
            return false
        }
        if (typeof obj['items'] !== 'undefined') {
            if (!Array.isArray(obj['items'])) {
                return false
            }
            for (const item of obj['items']) {
                if (!AdvancedCommerceSubscriptionChangeMetadataRequestValidator.itemValidator.validate(item)) {
                    return false
                }
            }
        }
        if ((typeof obj['storefront'] !== 'undefined') && !(typeof obj['storefront'] === "string" || obj['storefront'] instanceof String)) {
            return false
        }
        if ((typeof obj['taxCode'] !== 'undefined') && !(typeof obj['taxCode'] === "string" || obj['taxCode'] instanceof String)) {
            return false
        }
        return true
    }
}
