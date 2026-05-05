// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AutoRenewStatus, AutoRenewStatusValidator } from "./AutoRenewStatus"
import { RenewalBillingPlanType, RenewalBillingPlanTypeValidator } from "./RenewalBillingPlanType"
import { Validator } from "./Validator"

/**
 * {@link https://developer.apple.com/documentation/appstoreserverapi/renewalcommitmentinfo RenewalCommitmentInfo}
 */
export interface RenewalCommitmentInfo {

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/commitmentautorenewproductid commitmentAutoRenewProductId}
     **/
    commitmentAutoRenewProductId?: string

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/commitmentautorenewstatus commitmentAutoRenewStatus}
     **/
    commitmentAutoRenewStatus?: AutoRenewStatus | number

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/commitmentrenewalbillingplantype commitmentRenewalBillingPlanType}
     **/
    commitmentRenewalBillingPlanType?: RenewalBillingPlanType | string

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/commitmentrenewaldate commitmentRenewalDate}
     **/
    commitmentRenewalDate?: number

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/commitmentrenewalprice commitmentRenewalPrice}
     **/
    commitmentRenewalPrice?: number
}

export class RenewalCommitmentInfoValidator implements Validator<RenewalCommitmentInfo> {
    static readonly autoRenewStatusValidator = new AutoRenewStatusValidator()
    static readonly renewalBillingPlanTypeValidator = new RenewalBillingPlanTypeValidator()
    validate(obj: any): obj is RenewalCommitmentInfo {
        if ((typeof obj['commitmentAutoRenewProductId'] !== 'undefined') && !(typeof obj['commitmentAutoRenewProductId'] === "string" || obj['commitmentAutoRenewProductId'] instanceof String)) {
            return false
        }
        if ((typeof obj['commitmentAutoRenewStatus'] !== 'undefined') && !(RenewalCommitmentInfoValidator.autoRenewStatusValidator.validate(obj['commitmentAutoRenewStatus']))) {
            return false
        }
        if ((typeof obj['commitmentRenewalBillingPlanType'] !== 'undefined') && !(RenewalCommitmentInfoValidator.renewalBillingPlanTypeValidator.validate(obj['commitmentRenewalBillingPlanType']))) {
            return false
        }
        if ((typeof obj['commitmentRenewalDate'] !== 'undefined') && !(typeof obj['commitmentRenewalDate'] === "number")) {
            return false
        }
        if ((typeof obj['commitmentRenewalPrice'] !== 'undefined') && !(typeof obj['commitmentRenewalPrice'] === "number")) {
            return false
        }
        return true
    }
}
