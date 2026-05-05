// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceDescriptors, AdvancedCommerceDescriptorsValidator } from "./AdvancedCommerceDescriptors"
import { AdvancedCommercePeriod, AdvancedCommercePeriodValidator } from "./AdvancedCommercePeriod"
import { AdvancedCommerceTransactionItem, AdvancedCommerceTransactionItemValidator } from "./AdvancedCommerceTransactionItem"
import { Validator } from "./Validator"

/**
 * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercetransactioninfo advancedCommerceTransactionInfo}
 */
export interface AdvancedCommerceTransactionInfo {

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercedescriptors advancedCommerceDescriptors}
     **/
    descriptors?: AdvancedCommerceDescriptors

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommerceestimatedtax advancedCommerceEstimatedTax}
     **/
    estimatedTax?: number

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercetransactionitem advancedCommerceTransactionItem}
     **/
    items?: AdvancedCommerceTransactionItem[]

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommerceperiod advancedCommercePeriod}
     **/
    period?: AdvancedCommercePeriod | string

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercerequestreferenceid advancedCommerceRequestReferenceId}
     **/
    requestReferenceId?: string

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercetaxcode advancedCommerceTaxCode}
     **/
    taxCode?: string

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercetaxexclusiveprice advancedCommerceTaxExclusivePrice}
     **/
    taxExclusivePrice?: number

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercetaxrate advancedCommerceTaxRate}
     **/
    taxRate?: string
}

export class AdvancedCommerceTransactionInfoValidator implements Validator<AdvancedCommerceTransactionInfo> {
    static readonly descriptorsValidator = new AdvancedCommerceDescriptorsValidator()
    static readonly itemValidator = new AdvancedCommerceTransactionItemValidator()
    static readonly periodValidator = new AdvancedCommercePeriodValidator()
    validate(obj: any): obj is AdvancedCommerceTransactionInfo {
        if ((typeof obj['descriptors'] !== 'undefined') && !(AdvancedCommerceTransactionInfoValidator.descriptorsValidator.validate(obj['descriptors']))) {
            return false
        }
        if ((typeof obj['estimatedTax'] !== 'undefined') && !(typeof obj['estimatedTax'] === "number")) {
            return false
        }
        if (typeof obj['items'] !== 'undefined') {
            if (!Array.isArray(obj['items'])) {
                return false
            }
            for (const item of obj['items']) {
                if (!(AdvancedCommerceTransactionInfoValidator.itemValidator.validate(item))) {
                    return false
                }
            }
        }
        if ((typeof obj['period'] !== 'undefined') && !(AdvancedCommerceTransactionInfoValidator.periodValidator.validate(obj['period']))) {
            return false
        }
        if ((typeof obj['requestReferenceId'] !== 'undefined') && !(typeof obj['requestReferenceId'] === "string" || obj['requestReferenceId'] instanceof String)) {
            return false
        }
        if ((typeof obj['taxCode'] !== 'undefined') && !(typeof obj['taxCode'] === "string" || obj['taxCode'] instanceof String)) {
            return false
        }
        if ((typeof obj['taxExclusivePrice'] !== 'undefined') && !(typeof obj['taxExclusivePrice'] === "number")) {
            return false
        }
        if ((typeof obj['taxRate'] !== 'undefined') && !(typeof obj['taxRate'] === "string" || obj['taxRate'] instanceof String)) {
            return false
        }
        return true
    }
}
