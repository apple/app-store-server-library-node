// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { HelperValidationUtils } from "../helper_validation_utils"
import { Validator } from "./Validator"

/**
 * {@link https://developer.apple.com/documentation/appstoreserverapi/transactioncommitmentinfo TransactionCommitmentInfo}
 */
export interface TransactionCommitmentInfo {

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/billingperiodnumber billingPeriodNumber}
     **/
    billingPeriodNumber?: number

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/commitmentexpiresdate commitmentExpiresDate}
     **/
    commitmentExpiresDate?: number

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/commitmentprice commitmentPrice}
     **/
    commitmentPrice?: number

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/totalbillingperiods totalBillingPeriods}
     **/
    totalBillingPeriods?: number
}

export class TransactionCommitmentInfoValidator implements Validator<TransactionCommitmentInfo> {
    validate(obj: any): obj is TransactionCommitmentInfo {
        if ((typeof obj['billingPeriodNumber'] !== 'undefined') && !HelperValidationUtils.validatePeriodCount(obj['billingPeriodNumber'])) {
            return false
        }
        if ((typeof obj['commitmentExpiresDate'] !== 'undefined') && !(typeof obj['commitmentExpiresDate'] === "number")) {
            return false
        }
        if ((typeof obj['commitmentPrice'] !== 'undefined') && !(typeof obj['commitmentPrice'] === "number")) {
            return false
        }
        if ((typeof obj['totalBillingPeriods'] !== 'undefined') && !(typeof obj['totalBillingPeriods'] === "number")) {
            return false
        }
        return true
    }
}
