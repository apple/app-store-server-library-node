// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { DeliveryStatus, DeliveryStatusValidator } from "./DeliveryStatus"
import { RefundPreference, RefundPreferenceValidator } from "./RefundPreference"
import { Validator } from "./Validator"

/**
 * The request body that contains consumption information for an In-App Purchase.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/consumptionrequest ConsumptionRequest}
 */
export interface ConsumptionRequest {

    /**
     * A Boolean value of true or false that indicates whether the customer consented to provide consumption data.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/customerconsented customerConsented}
     */
    customerConsented: boolean

    /**
     * An integer that indicates the percentage of the In-App Purchase the customer consumed, in milliunits.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/consumptionpercentage consumptionPercentage}
     */
    consumptionPercentage?: number

    /**
     * A value that indicates whether the app successfully delivered an In-App Purchase that works properly.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/deliverystatus deliveryStatus}
     */
    deliveryStatus: DeliveryStatus | string

    /**
     * A value that indicates your preference, based on your operational logic, as to whether the App Store should grant the refund.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/refundpreference refundPreference}
     */
    refundPreference?: RefundPreference | string

    /**
     * A Boolean value of true or false that indicates whether you provided, prior to its purchase, a free sample or trial of the content, or information about its functionality.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/samplecontentprovided sampleContentProvided}
     */
    sampleContentProvided: boolean
}

export class ConsumptionRequestValidator implements Validator<ConsumptionRequest> {
    static readonly deliveryStatusValidator = new DeliveryStatusValidator()
    static readonly refundPreferenceValidator = new RefundPreferenceValidator()
    private static readonly MINIMUM_CONSUMPTION_PERCENTAGE = 0
    private static readonly MAXIMUM_CONSUMPTION_PERCENTAGE = 100000
    validate(obj: any): obj is ConsumptionRequest {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(typeof obj['customerConsented'] === "boolean" || obj['customerConsented'] instanceof Boolean)) {
            return false
        }
        if ((typeof obj['consumptionPercentage'] !== 'undefined') && !((typeof obj['consumptionPercentage'] === "number" || obj['consumptionPercentage'] instanceof Number) && obj['consumptionPercentage'].valueOf() >= ConsumptionRequestValidator.MINIMUM_CONSUMPTION_PERCENTAGE && obj['consumptionPercentage'].valueOf() <= ConsumptionRequestValidator.MAXIMUM_CONSUMPTION_PERCENTAGE)) {
            return false
        }
        if (!(ConsumptionRequestValidator.deliveryStatusValidator.validate(obj['deliveryStatus']))) {
            return false
        }
        if ((typeof obj['refundPreference'] !== 'undefined') && !(ConsumptionRequestValidator.refundPreferenceValidator.validate(obj['refundPreference']))) {
            return false
        }
        if (!(typeof obj['sampleContentProvided'] === "boolean" || obj['sampleContentProvided'] instanceof Boolean)) {
            return false
        }
        return true
    }
}
