// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { ExtendReasonCode } from "./ExtendReasonCode";

/**
 * The request body that contains subscription-renewal-extension data to apply for all eligible active subscribers.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/massextendrenewaldaterequest MassExtendRenewalDateRequest}
 */
export interface MassExtendRenewalDateRequest {
    /**
     * The number of days to extend the subscription renewal date.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/extendbydays extendByDays}
     * maximum: 90
     **/
    extendByDays?: number
        
    /**
     * The reason code for the subscription-renewal-date extension.
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

    /**
     * A list of storefront country codes you provide to limit the storefronts for a subscription-renewal-date extension.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/storefrontcountrycodes storefrontCountryCodes}
     **/
    storefrontCountryCodes?: string[];
        
    /**
     * The unique identifier for the product, that you create in App Store Connect.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/productid productId}
     **/
    productId?: string
}