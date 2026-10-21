// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator"

/**
 * The code that represents the reason for the subscription-renewal-date extension.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/extendreasoncode extendReasonCode}
 */
export enum ExtendReasonCode {
    /**
     * Undeclared; no information provided.
     */
    UNDECLARED = 0,
    /**
     * The renewal-date extension is for customer satisfaction.
     */
    CUSTOMER_SATISFACTION = 1,
    /**
     * The renewal-date extension is for other reasons.
     */
    OTHER = 2,
    /**
     * The renewal-date extension is due to a service issue or outage.
     */
    SERVICE_ISSUE_OR_OUTAGE = 3,
}

export class ExtendReasonCodeValidator extends NumberValidator {}
