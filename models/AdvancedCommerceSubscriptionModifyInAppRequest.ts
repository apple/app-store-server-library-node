// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from '../helper_validation_utils'
import { AbstractAdvancedCommerceInAppRequest } from './AbstractAdvancedCommerceInAppRequest'
import { AdvancedCommerceRequestInfoValidator } from './AdvancedCommerceRequestInfo'
import { AdvancedCommerceSubscriptionModifyAddItem, AdvancedCommerceSubscriptionModifyAddItemValidator } from './AdvancedCommerceSubscriptionModifyAddItem'
import { AdvancedCommerceSubscriptionModifyChangeItem, AdvancedCommerceSubscriptionModifyChangeItemValidator } from './AdvancedCommerceSubscriptionModifyChangeItem'
import { AdvancedCommerceSubscriptionModifyDescriptors, AdvancedCommerceSubscriptionModifyDescriptorsValidator } from './AdvancedCommerceSubscriptionModifyDescriptors'
import { AdvancedCommerceSubscriptionModifyPeriodChange, AdvancedCommerceSubscriptionModifyPeriodChangeValidator } from './AdvancedCommerceSubscriptionModifyPeriodChange'
import { AdvancedCommerceSubscriptionModifyRemoveItem, AdvancedCommerceSubscriptionModifyRemoveItemValidator } from './AdvancedCommerceSubscriptionModifyRemoveItem'
import { Validator } from './Validator'

/**
 * The request data your app provides to make changes to an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifyinapprequest SubscriptionModifyInAppRequest}
 */
export interface AdvancedCommerceSubscriptionModifyInAppRequest extends AbstractAdvancedCommerceInAppRequest {
    operation: "MODIFY_SUBSCRIPTION"

    version: "1"

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifyadditem SubscriptionModifyAddItem}
     */
    addItems?: AdvancedCommerceSubscriptionModifyAddItem[]

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifychangeitem SubscriptionModifyChangeItem}
     */
    changeItems?: AdvancedCommerceSubscriptionModifyChangeItem[]

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/currency currency}
     */
    currency?: string

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifydescriptors SubscriptionModifyDescriptors}
     */
    descriptors?: AdvancedCommerceSubscriptionModifyDescriptors

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifyperiodchange SubscriptionModifyPeriodChange}
     */
    periodChange?: AdvancedCommerceSubscriptionModifyPeriodChange

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifyremoveitem SubscriptionModifyRemoveItem}
     */
    removeItems?: AdvancedCommerceSubscriptionModifyRemoveItem[]

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/retainbillingcycle retainBillingCycle}
     */
    retainBillingCycle: boolean

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/storefront storefront}
     */
    storefront?: string

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/taxcode taxCode}
     */
    taxCode?: string

    /**
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/transactionid transactionId}
     */
    transactionId: string
}

export class AdvancedCommerceSubscriptionModifyInAppRequestValidator implements Validator<AdvancedCommerceSubscriptionModifyInAppRequest> {
    static readonly requestInfoValidator = new AdvancedCommerceRequestInfoValidator()
    static readonly addItemValidator = new AdvancedCommerceSubscriptionModifyAddItemValidator()
    static readonly changeItemValidator = new AdvancedCommerceSubscriptionModifyChangeItemValidator()
    static readonly descriptorsValidator = new AdvancedCommerceSubscriptionModifyDescriptorsValidator()
    static readonly periodChangeValidator = new AdvancedCommerceSubscriptionModifyPeriodChangeValidator()
    static readonly removeItemValidator = new AdvancedCommerceSubscriptionModifyRemoveItemValidator()

    validate(obj: any): obj is AdvancedCommerceSubscriptionModifyInAppRequest {
        if (!(AdvancedCommerceSubscriptionModifyInAppRequestValidator.requestInfoValidator.validate(obj['requestInfo']))) {
            return false
        }
        if (!(typeof obj['operation'] === "string" || obj['operation'] instanceof String)) {
            return false
        }
        if (!(typeof obj['version'] === "string" || obj['version'] instanceof String)) {
            return false
        }
        if (typeof obj['addItems'] !== 'undefined') {
            if (!HelperValidationUtils.validateItems(obj['addItems'])) {
                return false
            }
            for (const item of obj['addItems']) {
                if (!AdvancedCommerceSubscriptionModifyInAppRequestValidator.addItemValidator.validate(item)) {
                    return false
                }
            }
        }
        if (typeof obj['changeItems'] !== 'undefined') {
            if (!HelperValidationUtils.validateItems(obj['changeItems'])) {
                return false
            }
            for (const item of obj['changeItems']) {
                if (!AdvancedCommerceSubscriptionModifyInAppRequestValidator.changeItemValidator.validate(item)) {
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
        if ((typeof obj['periodChange'] !== 'undefined') && !(AdvancedCommerceSubscriptionModifyInAppRequestValidator.periodChangeValidator.validate(obj['periodChange']))) {
            return false
        }
        if (typeof obj['removeItems'] !== 'undefined') {
            if (!HelperValidationUtils.validateItems(obj['removeItems'])) {
                return false
            }
            for (const item of obj['removeItems']) {
                if (!AdvancedCommerceSubscriptionModifyInAppRequestValidator.removeItemValidator.validate(item)) {
                    return false
                }
            }
        }
        if (!(typeof obj['retainBillingCycle'] === "boolean")) {
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
        return true
    }
}
