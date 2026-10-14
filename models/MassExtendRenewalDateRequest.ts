// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { ExtendReasonCode, ExtendReasonCodeValidator } from "./ExtendReasonCode"
import { Validator } from "./Validator"

/**
 * The request body that contains subscription-renewal-extension data to apply for all eligible active subscribers.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/massextendrenewaldaterequest MassExtendRenewalDateRequest}
 */
export interface MassExtendRenewalDateRequest {

    /**
     * A string that contains a one-time UUID value you provide to identify this subscription-renewal-date extension request.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/requestidentifier requestIdentifier}
     */
    requestIdentifier: string

    /**
     * The number of days to extend the subscription renewal date.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/extendbydays extendByDays}
     */
    extendByDays: number

    /**
     * The reason code for the subscription-renewal-date extension.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/extendreasoncode extendReasonCode}
     */
    extendReasonCode: ExtendReasonCode | number

    /**
     * The product identifier of the auto-renewable subscription that you’re requesting the renewal-date extension for.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/productid productId}
     */
    productId: string

    /**
     * A list of storefront country codes you provide to limit the storefronts that are eligible to receive the subscription-renewal-date extension.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/storefrontcountrycodes storefrontCountryCodes}
     */
    storefrontCountryCodes?: string[]
}

export class MassExtendRenewalDateRequestValidator implements Validator<MassExtendRenewalDateRequest> {
    static readonly extendReasonCodeValidator = new ExtendReasonCodeValidator()
    private static readonly MAXIMUM_REQUEST_IDENTIFIER_LENGTH = 128
    private static readonly MINIMUM_EXTEND_BY_DAYS = 1
    private static readonly MAXIMUM_EXTEND_BY_DAYS = 90
    private static readonly MAXIMUM_STOREFRONT_COUNTRY_CODE_LENGTH = 3
    validate(obj: any): obj is MassExtendRenewalDateRequest {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!((typeof obj['requestIdentifier'] === "string" || obj['requestIdentifier'] instanceof String) && [...obj['requestIdentifier']].length <= MassExtendRenewalDateRequestValidator.MAXIMUM_REQUEST_IDENTIFIER_LENGTH)) {
            return false
        }
        if (!((typeof obj['extendByDays'] === "number" || obj['extendByDays'] instanceof Number) && obj['extendByDays'].valueOf() >= MassExtendRenewalDateRequestValidator.MINIMUM_EXTEND_BY_DAYS && obj['extendByDays'].valueOf() <= MassExtendRenewalDateRequestValidator.MAXIMUM_EXTEND_BY_DAYS)) {
            return false
        }
        if (!(MassExtendRenewalDateRequestValidator.extendReasonCodeValidator.validate(obj['extendReasonCode']))) {
            return false
        }
        if (!(typeof obj['productId'] === "string" || obj['productId'] instanceof String)) {
            return false
        }
        if (typeof obj['storefrontCountryCodes'] !== 'undefined') {
            if (!Array.isArray(obj['storefrontCountryCodes'])) {
                return false
            }
            for (const storefrontCountryCode of obj['storefrontCountryCodes']) {
                if (!((typeof storefrontCountryCode === "string" || storefrontCountryCode instanceof String) && [...storefrontCountryCode].length <= MassExtendRenewalDateRequestValidator.MAXIMUM_STOREFRONT_COUNTRY_CODE_LENGTH)) {
                    return false
                }
            }
        }
        return true
    }
}
