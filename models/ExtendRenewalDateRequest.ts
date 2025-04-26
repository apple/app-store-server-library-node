// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { ExtendReasonCode } from "./ExtendReasonCode"

/**
 * The request body that contains subscription-renewal-extension data for an individual subscription.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/extendrenewaldaterequest ExtendRenewalDateRequest}
 */
export interface ExtendRenewalDateRequest {

    /**
     * The number of days to extend the subscription renewal date.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/extendbydays extendByDays}
     * maximum: 90
     **/
    extendByDays?: number
        
    /**
     * The reason code for the subscription date extension
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/extendreasoncode extendReasonCode}
     **/
    extendReasonCode?: ExtendReasonCode
        
    /**
     * A string that contains a unique identifier you provide to track each subscription-renewal-date extension request.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/requestidentifier requestIdentifier}
     **/
    requestIdentifier?: string
}