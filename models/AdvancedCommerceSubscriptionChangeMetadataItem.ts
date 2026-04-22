// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceValidationUtils } from '../advanced_commerce_validation_utils'
import { AdvancedCommerceEffective, AdvancedCommerceEffectiveValidator } from './AdvancedCommerceEffective'
import { Validator } from './Validator'

/**
 * The metadata to change for an item, specifically its SKU, description, and display name.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionchangemetadataitem SubscriptionChangeMetadataItem}
 */
export interface AdvancedCommerceSubscriptionChangeMetadataItem {
    /**
     * The original SKU of the item.
     * 
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/sku SKU}
     **/
    currentSKU: string

    /**
     * The string that determines when the metadata change goes into effect.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/effective effective}
     **/
    effective: AdvancedCommerceEffective | string

    /**
     * The new description for the item.
     * 
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/description description}
     */
    description?: string

    /**
     * The new display name for the item.
     * 
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/displayname displayName}
     */
    displayName?: string
    
    /**
     * The new SKU of the item.
     * 
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/sku SKU}
     */
    SKU?: string
}

export class AdvancedCommerceSubscriptionChangeMetadataItemValidator implements Validator<AdvancedCommerceSubscriptionChangeMetadataItem> {
    static readonly effectiveValidator = new AdvancedCommerceEffectiveValidator()

    validate(obj: any): obj is AdvancedCommerceSubscriptionChangeMetadataItem {
        if (!AdvancedCommerceValidationUtils.validateSku(obj['currentSKU'])) {
            return false
        }

        if (!(AdvancedCommerceSubscriptionChangeMetadataItemValidator.effectiveValidator.validate(obj['effective']))) {
            return false
        }

        if (typeof obj['description'] !== 'undefined' && !AdvancedCommerceValidationUtils.validateDescription(obj['description'])) {
            return false
        }

        if (typeof obj['displayName'] !== 'undefined' && !AdvancedCommerceValidationUtils.validateDisplayName(obj['displayName'])) {
            return false
        }

        if (typeof obj['SKU'] !== 'undefined' && !AdvancedCommerceValidationUtils.validateSku(obj['SKU'])) {
            return false
        }

        return true
    }
}
