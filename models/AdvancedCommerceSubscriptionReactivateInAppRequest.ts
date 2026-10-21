// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from "../helper_validation_utils"
import { AbstractAdvancedCommerceInAppRequest } from "./AbstractAdvancedCommerceInAppRequest"
import { AdvancedCommerceRequestInfo, AdvancedCommerceRequestInfoValidator } from "./AdvancedCommerceRequestInfo"
import { AdvancedCommerceSubscriptionReactivateItem, AdvancedCommerceSubscriptionReactivateItemValidator } from "./AdvancedCommerceSubscriptionReactivateItem"
import { Validator } from "./Validator"

/**
 * The request your app provides to reactivate a subscription that has automatic renewal turned off.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionreactivateinapprequest SubscriptionReactivateInAppRequest}
 */
export interface AdvancedCommerceSubscriptionReactivateInAppRequest extends AbstractAdvancedCommerceInAppRequest {

    /**
     * The metadata to include in server requests.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestinfo RequestInfo}
     */
    requestInfo: AdvancedCommerceRequestInfo

    /**
     * An item in a subscription to reactivate.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionreactivateitem SubscriptionReactivateItem}
     */
    items?: AdvancedCommerceSubscriptionReactivateItem[]

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionreactivateinapprequest SubscriptionReactivateInAppRequest}
     */
    operation: "REACTIVATE_SUBSCRIPTION"

    /**
     * A three-letter code that represents the country or region associated with the App Store storefront.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/storefront storefront}
     */
    storefront?: string

    /**
     * A unique identifier that the App Store generates for a transaction.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/transactionid transactionId}
     */
    transactionId: string

    /**
     * A number that represents the version of the data structure or Advanced Commerce API.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/version version}
     */
    version: "1"
}

export class AdvancedCommerceSubscriptionReactivateInAppRequestValidator implements Validator<AdvancedCommerceSubscriptionReactivateInAppRequest> {
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()
    static readonly itemValidator = new AdvancedCommerceSubscriptionReactivateItemValidator()
    validate(obj: any): obj is AdvancedCommerceSubscriptionReactivateInAppRequest {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(AdvancedCommerceSubscriptionReactivateInAppRequestValidator.requestInfoValidator.validate(obj['requestInfo']))) {
            return false
        }
        if (typeof obj['items'] !== 'undefined') {
            if (!HelperValidationUtils.validateItems(obj['items'])) {
                return false
            }
            for (const item of obj['items']) {
                if (!(AdvancedCommerceSubscriptionReactivateInAppRequestValidator.itemValidator.validate(item))) {
                    return false
                }
            }
        }
        if (obj['operation'] !== "REACTIVATE_SUBSCRIPTION") {
            return false
        }
        if ((typeof obj['storefront'] !== 'undefined') && !(typeof obj['storefront'] === "string" || obj['storefront'] instanceof String)) {
            return false
        }
        if (!(typeof obj['transactionId'] === "string" || obj['transactionId'] instanceof String)) {
            return false
        }
        if (obj['version'] !== "1") {
            return false
        }
        return true
    }
}
