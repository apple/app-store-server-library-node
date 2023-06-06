// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator";

/**
 * The code that represents the reason for the subscription-renewal-date extension.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/extendreasoncode extendReasonCode}
 */
export enum ExtendReasonCode {
    UNDECLARED = 0,
    CUSTOMER_SATISFACTION = 1,
    OTHER = 2,
    SERVICE_ISSUE_OR_OUTAGE = 3,
}

export class ExtendReasonCodeValidator implements Validator<ExtendReasonCode> {
   validate(obj: any): obj is ExtendReasonCode {
        return Object.values(ExtendReasonCode).includes(obj)
    }
}
