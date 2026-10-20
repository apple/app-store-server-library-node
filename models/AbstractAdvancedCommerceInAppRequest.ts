// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceInAppRequest } from '../jws_signature_creator'
import { AdvancedCommerceOneTimeChargeCreateRequestValidator } from './AdvancedCommerceOneTimeChargeCreateRequest'
import { AdvancedCommerceRequest } from './AdvancedCommerceRequest'
import { AdvancedCommerceSubscriptionCreateRequestValidator } from './AdvancedCommerceSubscriptionCreateRequest'
import { AdvancedCommerceSubscriptionModifyInAppRequestValidator } from './AdvancedCommerceSubscriptionModifyInAppRequest'
import { AdvancedCommerceSubscriptionReactivateInAppRequestValidator } from './AdvancedCommerceSubscriptionReactivateInAppRequest'
import { Validator } from './Validator'

export interface AbstractAdvancedCommerceInAppRequest extends AdvancedCommerceRequest, AdvancedCommerceInAppRequest {
    readonly operation: string
    readonly version: string
}

export class AdvancedCommerceInAppRequestValidator implements Validator<AdvancedCommerceInAppRequest> {
    static readonly oneTimeChargeCreateRequestValidator = new AdvancedCommerceOneTimeChargeCreateRequestValidator()
    static readonly subscriptionCreateRequestValidator = new AdvancedCommerceSubscriptionCreateRequestValidator()
    static readonly subscriptionModifyInAppRequestValidator = new AdvancedCommerceSubscriptionModifyInAppRequestValidator()
    static readonly subscriptionReactivateInAppRequestValidator = new AdvancedCommerceSubscriptionReactivateInAppRequestValidator()

    validate(obj: any): obj is AdvancedCommerceInAppRequest {
        if (typeof obj !== 'object' || obj === null) {
            return false
        }

        switch (obj['operation']) {
            case "CREATE_ONE_TIME_CHARGE":
                return AdvancedCommerceInAppRequestValidator.oneTimeChargeCreateRequestValidator.validate(obj)
            case "CREATE_SUBSCRIPTION":
                return AdvancedCommerceInAppRequestValidator.subscriptionCreateRequestValidator.validate(obj)
            case "MODIFY_SUBSCRIPTION":
                return AdvancedCommerceInAppRequestValidator.subscriptionModifyInAppRequestValidator.validate(obj)
            case "REACTIVATE_SUBSCRIPTION":
                return AdvancedCommerceInAppRequestValidator.subscriptionReactivateInAppRequestValidator.validate(obj)
            default:
                return true
        }
    }
}