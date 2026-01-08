// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { DeliveryStatus } from "./DeliveryStatus"
import { RefundPreference } from "./RefundPreference"

/**
 * The request body that contains consumption information for an In-App Purchase.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/consumptionrequest ConsumptionRequest}
 */
export interface ConsumptionRequest {

    /**
     * A Boolean value that indicates whether the customer consented to provide consumption data to the App Store.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/customerconsented customerConsented}
     **/
    customerConsented: boolean

    /**
     * An integer that indicates the percentage, in milliunits, of the In-App Purchase the customer consumed.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/consumptionpercentage consumptionPercentage}
     **/
    consumptionPercentage?: number

    /**
     * A value that indicates whether the app successfully delivered an in-app purchase that works properly.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/deliverystatus deliveryStatus}
     **/
    deliveryStatus: DeliveryStatus | string

    /**
     * A value that indicates your preferred outcome for the refund request.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/refundpreference refundPreference}
     **/
    refundPreference?: RefundPreference | string

    /**
     * A Boolean value that indicates whether you provided, prior to its purchase, a free sample or trial of the content, or information about its functionality.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/samplecontentprovided sampleContentProvided}
     **/
    sampleContentProvided: boolean
}
