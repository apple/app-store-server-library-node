// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from "../helper_validation_utils"
import { AdvancedCommerceDescriptors } from "./AdvancedCommerceDescriptors"
import { Validator } from "./Validator"

/**
 * The description and display name of the subscription to migrate to that you manage.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmigratedescriptors SubscriptionMigrateDescriptors}
 */
export interface AdvancedCommerceSubscriptionMigrateDescriptors extends AdvancedCommerceDescriptors {

    /**
     * The description of the subscription to migrate to.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/description description}
     */
    description: string

    /**
     * The display name of the subscription to migrate to.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/displayname displayName}
     */
    displayName: string
}

export class AdvancedCommerceSubscriptionMigrateDescriptorsValidator implements Validator<AdvancedCommerceSubscriptionMigrateDescriptors> {
    validate(obj: any): obj is AdvancedCommerceSubscriptionMigrateDescriptors {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!HelperValidationUtils.validateDescription(obj['description'])) {
            return false
        }
        if (!HelperValidationUtils.validateDisplayName(obj['displayName'])) {
            return false
        }
        return true
    }
}
