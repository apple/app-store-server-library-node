// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommercePriceIncreaseInfoStatus, AdvancedCommercePriceIncreaseInfoStatusValidator } from "./AdvancedCommercePriceIncreaseInfoStatus"
import { Validator } from "./Validator"

/**
 * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercepriceincreaseinfo advancedCommercePriceIncreaseInfo}
 */
export interface AdvancedCommercePriceIncreaseInfo {

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercepriceincreaseinfodependentsku advancedCommercePriceIncreaseInfoDependentSKU}
     **/
    dependentSKUs?: string[]

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercepriceincreaseinfoprice advancedCommercePriceIncreaseInfoPrice}
     **/
    price?: number

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercepriceincreaseinfostatus advancedCommercePriceIncreaseInfoStatus}
     **/
    status?: AdvancedCommercePriceIncreaseInfoStatus | string
}

export class AdvancedCommercePriceIncreaseInfoValidator implements Validator<AdvancedCommercePriceIncreaseInfo> {
    static readonly statusValidator = new AdvancedCommercePriceIncreaseInfoStatusValidator()
    validate(obj: any): obj is AdvancedCommercePriceIncreaseInfo {
        if (typeof obj['dependentSKUs'] !== 'undefined') {
            if (!Array.isArray(obj['dependentSKUs'])) {
                return false
            }
            for (const sku of obj['dependentSKUs']) {
                if (!(typeof sku === "string" || sku instanceof String)) {
                    return false
                }
            }
        }
        if ((typeof obj['price'] !== 'undefined') && !(typeof obj['price'] === "number")) {
            return false
        }
        if ((typeof obj['status'] !== 'undefined') && !(AdvancedCommercePriceIncreaseInfoValidator.statusValidator.validate(obj['status']))) {
            return false
        }
        return true
    }
}
