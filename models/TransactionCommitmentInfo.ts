// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * {@link https://developer.apple.com/documentation/appstoreserverapi/transactioncommitmentinfo TransactionCommitmentInfo}
 */
export interface TransactionCommitmentInfo {

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/billingperiodnumber billingPeriodNumber}
     */
    billingPeriodNumber?: number

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/commitmentexpiresdate commitmentExpiresDate}
     */
    commitmentExpiresDate?: number

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/commitmentprice commitmentPrice}
     */
    commitmentPrice?: number

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/totalbillingperiods totalBillingPeriods}
     */
    totalBillingPeriods?: number
}

export class TransactionCommitmentInfoValidator implements Validator<TransactionCommitmentInfo> {
    private static readonly MINIMUM_BILLING_PERIOD_NUMBER = 1
    private static readonly MAXIMUM_BILLING_PERIOD_NUMBER = 12
    validate(obj: any): obj is TransactionCommitmentInfo {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if ((typeof obj['billingPeriodNumber'] !== 'undefined') && !((typeof obj['billingPeriodNumber'] === "number" || obj['billingPeriodNumber'] instanceof Number) && obj['billingPeriodNumber'].valueOf() >= TransactionCommitmentInfoValidator.MINIMUM_BILLING_PERIOD_NUMBER && obj['billingPeriodNumber'].valueOf() <= TransactionCommitmentInfoValidator.MAXIMUM_BILLING_PERIOD_NUMBER)) {
            return false
        }
        if ((typeof obj['commitmentExpiresDate'] !== 'undefined') && !(typeof obj['commitmentExpiresDate'] === "number" || obj['commitmentExpiresDate'] instanceof Number)) {
            return false
        }
        if ((typeof obj['commitmentPrice'] !== 'undefined') && !(typeof obj['commitmentPrice'] === "number" || obj['commitmentPrice'] instanceof Number)) {
            return false
        }
        if ((typeof obj['totalBillingPeriods'] !== 'undefined') && !(typeof obj['totalBillingPeriods'] === "number" || obj['totalBillingPeriods'] instanceof Number)) {
            return false
        }
        return true
    }
}
