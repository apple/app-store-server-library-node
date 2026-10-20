// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from "../helper_validation_utils"
import { AdvancedCommerceOfferPeriod, AdvancedCommerceOfferPeriodValidator } from "./AdvancedCommerceOfferPeriod"
import { AdvancedCommerceOfferReason, AdvancedCommerceOfferReasonValidator } from "./AdvancedCommerceOfferReason"
import { Validator } from "./Validator"

/**
 * A discount offer for an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/offer Offer}
 */
export interface AdvancedCommerceOffer {

    /**
     * The period of the offer.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/offer Offer}
     */
    period: AdvancedCommerceOfferPeriod | string

    /**
     * The number of periods the offer is active.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/offer Offer}
     */
    periodCount: number

    /**
     * The offer price, in milliunits.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/price price}
     */
    price: number

    /**
     * The reason for the offer.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/offer Offer}
     */
    reason: AdvancedCommerceOfferReason | string
}

export class AdvancedCommerceOfferValidator implements Validator<AdvancedCommerceOffer> {
    static readonly periodValidator = new AdvancedCommerceOfferPeriodValidator()
    static readonly reasonValidator = new AdvancedCommerceOfferReasonValidator()
    validate(obj: any): obj is AdvancedCommerceOffer {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(AdvancedCommerceOfferValidator.periodValidator.validate(obj['period']))) {
            return false
        }
        if (!HelperValidationUtils.validatePeriodCount(obj['periodCount'])) {
            return false
        }
        if (!(typeof obj['price'] === "number" || obj['price'] instanceof Number)) {
            return false
        }
        if (!(AdvancedCommerceOfferValidator.reasonValidator.validate(obj['reason']))) {
            return false
        }
        return true
    }
}
