// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { ExtendReasonCode, ExtendReasonCodeValidator } from "./ExtendReasonCode"
import { Validator } from "./Validator"

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
     */
    extendByDays: number

    /**
     * The reason code for the subscription date extension.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/extendreasoncode extendReasonCode}
     */
    extendReasonCode: ExtendReasonCode | number

    /**
     * A string that contains a value you provide to uniquely identify this renewal-date extension request.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/requestidentifier requestIdentifier}
     */
    requestIdentifier: string
}

export class ExtendRenewalDateRequestValidator implements Validator<ExtendRenewalDateRequest> {
    static readonly extendReasonCodeValidator = new ExtendReasonCodeValidator()
    private static readonly MINIMUM_EXTEND_BY_DAYS = 1
    private static readonly MAXIMUM_EXTEND_BY_DAYS = 90
    private static readonly MAXIMUM_REQUEST_IDENTIFIER_LENGTH = 128
    validate(obj: any): obj is ExtendRenewalDateRequest {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!((typeof obj['extendByDays'] === "number" || obj['extendByDays'] instanceof Number) && obj['extendByDays'].valueOf() >= ExtendRenewalDateRequestValidator.MINIMUM_EXTEND_BY_DAYS && obj['extendByDays'].valueOf() <= ExtendRenewalDateRequestValidator.MAXIMUM_EXTEND_BY_DAYS)) {
            return false
        }
        if (!(ExtendRenewalDateRequestValidator.extendReasonCodeValidator.validate(obj['extendReasonCode']))) {
            return false
        }
        if (!((typeof obj['requestIdentifier'] === "string" || obj['requestIdentifier'] instanceof String) && [...obj['requestIdentifier']].length <= ExtendRenewalDateRequestValidator.MAXIMUM_REQUEST_IDENTIFIER_LENGTH)) {
            return false
        }
        return true
    }
}
