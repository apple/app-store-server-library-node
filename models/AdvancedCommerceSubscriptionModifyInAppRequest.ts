// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from "../helper_validation_utils"
import { AbstractAdvancedCommerceInAppRequest } from "./AbstractAdvancedCommerceInAppRequest"
import { AdvancedCommerceRequestInfo, AdvancedCommerceRequestInfoValidator } from "./AdvancedCommerceRequestInfo"
import { AdvancedCommerceSubscriptionModifyAddItem, AdvancedCommerceSubscriptionModifyAddItemValidator } from "./AdvancedCommerceSubscriptionModifyAddItem"
import { AdvancedCommerceSubscriptionModifyChangeItem, AdvancedCommerceSubscriptionModifyChangeItemValidator } from "./AdvancedCommerceSubscriptionModifyChangeItem"
import { AdvancedCommerceSubscriptionModifyDescriptors, AdvancedCommerceSubscriptionModifyDescriptorsValidator } from "./AdvancedCommerceSubscriptionModifyDescriptors"
import { AdvancedCommerceSubscriptionModifyPeriodChange, AdvancedCommerceSubscriptionModifyPeriodChangeValidator } from "./AdvancedCommerceSubscriptionModifyPeriodChange"
import { AdvancedCommerceSubscriptionModifyRemoveItem, AdvancedCommerceSubscriptionModifyRemoveItemValidator } from "./AdvancedCommerceSubscriptionModifyRemoveItem"
import { Validator } from "./Validator"

/**
 * The request data your app provides to make changes to an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifyinapprequest SubscriptionModifyInAppRequest}
 */
export interface AdvancedCommerceSubscriptionModifyInAppRequest extends AbstractAdvancedCommerceInAppRequest {

    /**
     * The metadata to include in server requests.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestinfo RequestInfo}
     */
    requestInfo: AdvancedCommerceRequestInfo

    /**
     * The data your app provides to add items when it makes changes to an auto-renewable subscription.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifyadditem SubscriptionModifyAddItem}
     */
    addItems?: AdvancedCommerceSubscriptionModifyAddItem[]

    /**
     * The data your app provides to change an item of an auto-renewable subscription.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifychangeitem SubscriptionModifyChangeItem}
     */
    changeItems?: AdvancedCommerceSubscriptionModifyChangeItem[]

    /**
     * The three-letter ISO 4217 currency code for the price of a product.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/currency currency}
     */
    currency?: string

    /**
     * The data your app provides to change the description and display name of an auto-renewable subscription.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifydescriptors SubscriptionModifyDescriptors}
     */
    descriptors?: AdvancedCommerceSubscriptionModifyDescriptors

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifyinapprequest SubscriptionModifyInAppRequest}
     */
    operation: "MODIFY_SUBSCRIPTION"

    /**
     * The data your app provides to change the period of an auto-renewable subscription.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifyperiodchange SubscriptionModifyPeriodChange}
     */
    periodChange?: AdvancedCommerceSubscriptionModifyPeriodChange

    /**
     * The data your app provides to remove an item from an auto-renewable subscription.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifyremoveitem SubscriptionModifyRemoveItem}
     */
    removeItems?: AdvancedCommerceSubscriptionModifyRemoveItem[]

    /**
     * A Boolean value that determines whether to keep the existing billing cycle with the change you request.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/retainbillingcycle retainBillingCycle}
     */
    retainBillingCycle: boolean

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

export class AdvancedCommerceSubscriptionModifyInAppRequestValidator implements Validator<AdvancedCommerceSubscriptionModifyInAppRequest> {
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()
    static readonly addItemValidator = new AdvancedCommerceSubscriptionModifyAddItemValidator()
    static readonly changeItemValidator = new AdvancedCommerceSubscriptionModifyChangeItemValidator()
    static readonly descriptorsValidator = new AdvancedCommerceSubscriptionModifyDescriptorsValidator()
    static readonly periodChangeValidator = new AdvancedCommerceSubscriptionModifyPeriodChangeValidator()
    static readonly removeItemValidator = new AdvancedCommerceSubscriptionModifyRemoveItemValidator()
    validate(obj: any): obj is AdvancedCommerceSubscriptionModifyInAppRequest {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(AdvancedCommerceSubscriptionModifyInAppRequestValidator.requestInfoValidator.validate(obj['requestInfo']))) {
            return false
        }
        if (typeof obj['addItems'] !== 'undefined') {
            if (!HelperValidationUtils.validateItems(obj['addItems'])) {
                return false
            }
            for (const addItem of obj['addItems']) {
                if (!(AdvancedCommerceSubscriptionModifyInAppRequestValidator.addItemValidator.validate(addItem))) {
                    return false
                }
            }
        }
        if (typeof obj['changeItems'] !== 'undefined') {
            if (!HelperValidationUtils.validateItems(obj['changeItems'])) {
                return false
            }
            for (const changeItem of obj['changeItems']) {
                if (!(AdvancedCommerceSubscriptionModifyInAppRequestValidator.changeItemValidator.validate(changeItem))) {
                    return false
                }
            }
        }
        if ((typeof obj['currency'] !== 'undefined') && !(typeof obj['currency'] === "string" || obj['currency'] instanceof String)) {
            return false
        }
        if ((typeof obj['descriptors'] !== 'undefined') && !(AdvancedCommerceSubscriptionModifyInAppRequestValidator.descriptorsValidator.validate(obj['descriptors']))) {
            return false
        }
        if (obj['operation'] !== "MODIFY_SUBSCRIPTION") {
            return false
        }
        if ((typeof obj['periodChange'] !== 'undefined') && !(AdvancedCommerceSubscriptionModifyInAppRequestValidator.periodChangeValidator.validate(obj['periodChange']))) {
            return false
        }
        if (typeof obj['removeItems'] !== 'undefined') {
            if (!HelperValidationUtils.validateItems(obj['removeItems'])) {
                return false
            }
            for (const removeItem of obj['removeItems']) {
                if (!(AdvancedCommerceSubscriptionModifyInAppRequestValidator.removeItemValidator.validate(removeItem))) {
                    return false
                }
            }
        }
        if (!(typeof obj['retainBillingCycle'] === "boolean" || obj['retainBillingCycle'] instanceof Boolean)) {
            return false
        }
        if ((typeof obj['storefront'] !== 'undefined') && !(typeof obj['storefront'] === "string" || obj['storefront'] instanceof String)) {
            return false
        }
        if ((typeof obj['taxCode'] !== 'undefined') && !(typeof obj['taxCode'] === "string" || obj['taxCode'] instanceof String)) {
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
