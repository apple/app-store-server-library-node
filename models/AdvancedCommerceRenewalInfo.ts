// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceDescriptors, AdvancedCommerceDescriptorsValidator } from "./AdvancedCommerceDescriptors"
import { AdvancedCommercePeriod, AdvancedCommercePeriodValidator } from "./AdvancedCommercePeriod"
import { AdvancedCommerceRenewalItem, AdvancedCommerceRenewalItemValidator } from "./AdvancedCommerceRenewalItem"
import { Validator } from "./Validator"

/**
 * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercerenewalinfo advancedCommerceRenewalInfo}
 */
export interface AdvancedCommerceRenewalInfo {

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommerceconsistencytoken advancedCommerceConsistencyToken}
     **/
    consistencyToken?: string

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercedescriptors advancedCommerceDescriptors}
     **/
    descriptors?: AdvancedCommerceDescriptors

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercerenewalitem advancedCommerceRenewalItem}
     **/
    items?: AdvancedCommerceRenewalItem[]

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
}

export class AdvancedCommerceRenewalInfoValidator implements Validator<AdvancedCommerceRenewalInfo> {
    static readonly descriptorsValidator = new AdvancedCommerceDescriptorsValidator()
    static readonly itemValidator = new AdvancedCommerceRenewalItemValidator()
    static readonly periodValidator = new AdvancedCommercePeriodValidator()
    validate(obj: any): obj is AdvancedCommerceRenewalInfo {
        if ((typeof obj['consistencyToken'] !== 'undefined') && !(typeof obj['consistencyToken'] === "string" || obj['consistencyToken'] instanceof String)) {
            return false
        }
        if ((typeof obj['descriptors'] !== 'undefined') && !(AdvancedCommerceRenewalInfoValidator.descriptorsValidator.validate(obj['descriptors']))) {
            return false
        }
        if (typeof obj['items'] !== 'undefined') {
            if (!Array.isArray(obj['items'])) {
                return false
            }
            for (const item of obj['items']) {
                if (!(AdvancedCommerceRenewalInfoValidator.itemValidator.validate(item))) {
                    return false
                }
            }
        }
        if ((typeof obj['period'] !== 'undefined') && !(AdvancedCommerceRenewalInfoValidator.periodValidator.validate(obj['period']))) {
            return false
        }
        if ((typeof obj['requestReferenceId'] !== 'undefined') && !(typeof obj['requestReferenceId'] === "string" || obj['requestReferenceId'] instanceof String)) {
            return false
        }
        if ((typeof obj['taxCode'] !== 'undefined') && !(typeof obj['taxCode'] === "string" || obj['taxCode'] instanceof String)) {
            return false
        }
        return true
    }
}
