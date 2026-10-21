// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { BillingPlanType, BillingPlanTypeValidator } from "./BillingPlanType"
import { Validator } from "./Validator"

/**
 * A switch-plan message and product ID you provide in a real-time response to your Get Retention Message endpoint.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/alternateproduct alternateProduct}
 */
export interface AlternateProduct {

    /**
     * The message identifier of the text to display in the switch-plan retention message.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/messageidentifier messageIdentifier}
     */
    messageIdentifier: string

    /**
     * The product identifier of the subscription the retention message suggests for your customer to switch to.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/productid productId}
     */
    productId: string

    /**
     * {@link https://developer.apple.com/documentation/retentionmessaging/billingplantype billingPlanType}
     */
    billingPlanType?: BillingPlanType | string
}

export class AlternateProductValidator implements Validator<AlternateProduct> {
    static readonly billingPlanTypeValidator = new BillingPlanTypeValidator()
    validate(obj: any): obj is AlternateProduct {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(typeof obj['messageIdentifier'] === "string" || obj['messageIdentifier'] instanceof String)) {
            return false
        }
        if (!(typeof obj['productId'] === "string" || obj['productId'] instanceof String)) {
            return false
        }
        if ((typeof obj['billingPlanType'] !== 'undefined') && !(AlternateProductValidator.billingPlanTypeValidator.validate(obj['billingPlanType']))) {
            return false
        }
        return true
    }
}
