// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from "../helper_validation_utils"
import { AdvancedCommerceRequest } from "./AdvancedCommerceRequest"
import { AdvancedCommerceRequestInfo, AdvancedCommerceRequestInfoValidator } from "./AdvancedCommerceRequestInfo"
import { AdvancedCommerceSubscriptionChangeMetadataDescriptors, AdvancedCommerceSubscriptionChangeMetadataDescriptorsValidator } from "./AdvancedCommerceSubscriptionChangeMetadataDescriptors"
import { AdvancedCommerceSubscriptionChangeMetadataItem, AdvancedCommerceSubscriptionChangeMetadataItemValidator } from "./AdvancedCommerceSubscriptionChangeMetadataItem"
import { Validator } from "./Validator"

/**
 * The request body you provide to change the metadata of a subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionchangemetadatarequest SubscriptionChangeMetadataRequest}
 */
export interface AdvancedCommerceSubscriptionChangeMetadataRequest extends AdvancedCommerceRequest {

    /**
     * The metadata to include in server requests.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestinfo RequestInfo}
     */
    requestInfo: AdvancedCommerceRequestInfo

    /**
     * The subscription metadata to change, specifically the description and display name.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionchangemetadatadescriptors SubscriptionChangeMetadataDescriptors}
     */
    descriptors?: AdvancedCommerceSubscriptionChangeMetadataDescriptors

    /**
     * The metadata to change for an item, specifically its SKU, description, and display name.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionchangemetadataitem SubscriptionChangeMetadataItem}
     */
    items?: AdvancedCommerceSubscriptionChangeMetadataItem[]

    /**
     * A three-letter code that represents the country or region associated with the App Store storefront.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/storefront storefront}
     */
    storefront?: string

    /**
     * A tax code that applies to a SKU.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/taxcode taxCode}
     */
    taxCode?: string
}

export class AdvancedCommerceSubscriptionChangeMetadataRequestValidator implements Validator<AdvancedCommerceSubscriptionChangeMetadataRequest> {
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()
    static readonly descriptorsValidator = new AdvancedCommerceSubscriptionChangeMetadataDescriptorsValidator()
    static readonly itemValidator = new AdvancedCommerceSubscriptionChangeMetadataItemValidator()
    validate(obj: any): obj is AdvancedCommerceSubscriptionChangeMetadataRequest {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(AdvancedCommerceSubscriptionChangeMetadataRequestValidator.requestInfoValidator.validate(obj['requestInfo']))) {
            return false
        }
        if ((typeof obj['descriptors'] !== 'undefined') && !(AdvancedCommerceSubscriptionChangeMetadataRequestValidator.descriptorsValidator.validate(obj['descriptors']))) {
            return false
        }
        if (typeof obj['items'] !== 'undefined') {
            if (!HelperValidationUtils.validateItems(obj['items'])) {
                return false
            }
            for (const item of obj['items']) {
                if (!(AdvancedCommerceSubscriptionChangeMetadataRequestValidator.itemValidator.validate(item))) {
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
