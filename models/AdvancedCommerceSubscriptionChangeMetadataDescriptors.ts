// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceValidationUtils } from '../advanced_commerce_validation_utils'
import { AdvancedCommerceEffective, AdvancedCommerceEffectiveValidator } from './AdvancedCommerceEffective'
import { Validator } from './Validator'

/**
 * The subscription metadata to change, specifically the description and display name.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionchangemetadatadescriptors SubscriptionChangeMetadataDescriptors}
 */
export interface AdvancedCommerceSubscriptionChangeMetadataDescriptors {
    /**
     * The string that determines when the metadata change goes into effect.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/effective effective}
     **/
    effective: AdvancedCommerceEffective | string
    
    /**
     * The new description for the subscription.
     * 
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/description description}
     */
    description?: string

    /**
     * The new display name for the subscription.
     * 
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/displayname displayName}
     */
    displayName?: string
}

export class AdvancedCommerceSubscriptionChangeMetadataDescriptorsValidator implements Validator<AdvancedCommerceSubscriptionChangeMetadataDescriptors> {
    static readonly effectiveValidator = new AdvancedCommerceEffectiveValidator()

    validate(obj: any): obj is AdvancedCommerceSubscriptionChangeMetadataDescriptors {
        if (!(AdvancedCommerceSubscriptionChangeMetadataDescriptorsValidator.effectiveValidator.validate(obj['effective']))) {
            return false
        }

        if (typeof obj['description'] !== 'undefined' && !AdvancedCommerceValidationUtils.validateDescription(obj['description'])) {
            return false
        }

        if (typeof obj['displayName'] !== 'undefined' && !AdvancedCommerceValidationUtils.validateDisplayName(obj['displayName'])) {
            return false
        }

        return true
    }
}
