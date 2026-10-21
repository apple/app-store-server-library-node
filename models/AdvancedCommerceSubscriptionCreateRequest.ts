// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from "../helper_validation_utils"
import { AbstractAdvancedCommerceInAppRequest } from "./AbstractAdvancedCommerceInAppRequest"
import { AdvancedCommerceDescriptors, AdvancedCommerceDescriptorsValidator } from "./AdvancedCommerceDescriptors"
import { AdvancedCommercePeriod, AdvancedCommercePeriodValidator } from "./AdvancedCommercePeriod"
import { AdvancedCommerceRequestInfo, AdvancedCommerceRequestInfoValidator } from "./AdvancedCommerceRequestInfo"
import { AdvancedCommerceSubscriptionCreateItem, AdvancedCommerceSubscriptionCreateItemValidator } from "./AdvancedCommerceSubscriptionCreateItem"
import { Validator } from "./Validator"

/**
 * The request data your app provides when a customer purchases an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptioncreaterequest SubscriptionCreateRequest}
 */
export interface AdvancedCommerceSubscriptionCreateRequest extends AbstractAdvancedCommerceInAppRequest {

    /**
     * The metadata to include in server requests.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestinfo RequestInfo}
     */
    requestInfo: AdvancedCommerceRequestInfo

    /**
     * The three-letter ISO 4217 currency code for the price of a product.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/currency currency}
     */
    currency: string

    /**
     * The display name and description of a subscription product.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/descriptors Descriptors}
     */
    descriptors: AdvancedCommerceDescriptors

    /**
     * The data that describes a subscription item.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptioncreateitem SubscriptionCreateItem}
     */
    items: AdvancedCommerceSubscriptionCreateItem[]

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptioncreaterequest SubscriptionCreateRequest}
     */
    operation: "CREATE_SUBSCRIPTION"

    /**
     * The duration of a single cycle of an auto-renewable subscription.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/period period}
     */
    period: AdvancedCommercePeriod | string

    /**
     * A unique identifier that the App Store generates for a transaction.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/transactionid transactionId}
     */
    previousTransactionId?: string

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
    taxCode: string

    /**
     * A number that represents the version of the data structure or Advanced Commerce API.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/version version}
     */
    version: "1"
}

export class AdvancedCommerceSubscriptionCreateRequestValidator implements Validator<AdvancedCommerceSubscriptionCreateRequest> {
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()
    static readonly descriptorsValidator = new AdvancedCommerceDescriptorsValidator()
    static readonly itemValidator = new AdvancedCommerceSubscriptionCreateItemValidator()
    static readonly periodValidator = new AdvancedCommercePeriodValidator()
    validate(obj: any): obj is AdvancedCommerceSubscriptionCreateRequest {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(AdvancedCommerceSubscriptionCreateRequestValidator.requestInfoValidator.validate(obj['requestInfo']))) {
            return false
        }
        if (!(typeof obj['currency'] === "string" || obj['currency'] instanceof String)) {
            return false
        }
        if (!(AdvancedCommerceSubscriptionCreateRequestValidator.descriptorsValidator.validate(obj['descriptors']))) {
            return false
        }
        if (!HelperValidationUtils.validateItems(obj['items'])) {
            return false
        }
        for (const item of obj['items']) {
            if (!(AdvancedCommerceSubscriptionCreateRequestValidator.itemValidator.validate(item))) {
                return false
            }
        }
        if (obj['operation'] !== "CREATE_SUBSCRIPTION") {
            return false
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
        if (obj['version'] !== "1") {
            return false
        }
        return true
    }
}
