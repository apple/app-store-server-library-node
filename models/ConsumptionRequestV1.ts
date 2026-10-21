// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { AccountTenure, AccountTenureValidator } from "./AccountTenure"
import { ConsumptionStatus, ConsumptionStatusValidator } from "./ConsumptionStatus"
import { DeliveryStatusV1, DeliveryStatusV1Validator } from "./DeliveryStatusV1"
import { LifetimeDollarsPurchased, LifetimeDollarsPurchasedValidator } from "./LifetimeDollarsPurchased"
import { LifetimeDollarsRefunded, LifetimeDollarsRefundedValidator } from "./LifetimeDollarsRefunded"
import { Platform, PlatformValidator } from "./Platform"
import { PlayTime, PlayTimeValidator } from "./PlayTime"
import { RefundPreferenceV1, RefundPreferenceV1Validator } from "./RefundPreferenceV1"
import { UserStatus, UserStatusValidator } from "./UserStatus"
import { Validator } from "./Validator"

/**
 * The request body containing consumption information.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/consumptionrequestv1 ConsumptionRequestV1}
 * @deprecated Use {@link ConsumptionRequest} instead.
 */
export interface ConsumptionRequestV1 {

    /**
     * The age of the customer’s account.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/accounttenure accountTenure}
     */
    accountTenure: AccountTenure | number

    /**
     * The UUID of the in-app user account that completed the in-app purchase transaction.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/appaccounttoken appAccountToken}
     */
    appAccountToken: string

    /**
     * A value that indicates the extent to which the customer consumed the in-app purchase.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/consumptionstatus consumptionStatus}
     */
    consumptionStatus: ConsumptionStatus | number

    /**
     * A Boolean value of true or false that indicates whether the customer consented to provide consumption data.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/customerconsented customerConsented}
     */
    customerConsented: boolean

    /**
     * A value that indicates whether the app successfully delivered an in-app purchase that works properly.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/deliverystatusv1 deliveryStatusV1}
     */
    deliveryStatus: DeliveryStatusV1 | number

    /**
     * A value that indicates the total amount, in USD, of in-app purchases the customer has made in your app, across all platforms.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/lifetimedollarspurchased lifetimeDollarsPurchased}
     */
    lifetimeDollarsPurchased: LifetimeDollarsPurchased | number

    /**
     * A value that indicates the total amount, in USD, of refunds the customer has received, in your app, across all platforms.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/lifetimedollarsrefunded lifetimeDollarsRefunded}
     */
    lifetimeDollarsRefunded: LifetimeDollarsRefunded | number

    /**
     * A value that indicates the platform on which the customer consumed the in-app purchase.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/platform platform}
     */
    platform: Platform | number

    /**
     * A value that indicates the amount of time that the customer used the app.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/playtime playTime}
     */
    playTime: PlayTime | number

    /**
     * A value that indicates your preference, based on your operational logic, as to whether Apple should grant the refund.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/refundpreferencev1 refundPreferenceV1}
     */
    refundPreference?: RefundPreferenceV1 | number

    /**
     * A Boolean value of true or false that indicates whether you provided, prior to its purchase, a free sample or trial of the content, or information about its functionality.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/samplecontentprovided sampleContentProvided}
     */
    sampleContentProvided: boolean

    /**
     * The status of the customer’s account.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/userstatus userStatus}
     */
    userStatus: UserStatus | number
}

export class ConsumptionRequestV1Validator implements Validator<ConsumptionRequestV1> {
    static readonly accountTenureValidator = new AccountTenureValidator()
    static readonly consumptionStatusValidator = new ConsumptionStatusValidator()
    static readonly deliveryStatusV1Validator = new DeliveryStatusV1Validator()
    static readonly lifetimeDollarsPurchasedValidator = new LifetimeDollarsPurchasedValidator()
    static readonly lifetimeDollarsRefundedValidator = new LifetimeDollarsRefundedValidator()
    static readonly platformValidator = new PlatformValidator()
    static readonly playTimeValidator = new PlayTimeValidator()
    static readonly refundPreferenceV1Validator = new RefundPreferenceV1Validator()
    static readonly userStatusValidator = new UserStatusValidator()
    validate(obj: any): obj is ConsumptionRequestV1 {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(ConsumptionRequestV1Validator.accountTenureValidator.validate(obj['accountTenure']))) {
            return false
        }
        if (!(typeof obj['appAccountToken'] === "string" || obj['appAccountToken'] instanceof String)) {
            return false
        }
        if (!(ConsumptionRequestV1Validator.consumptionStatusValidator.validate(obj['consumptionStatus']))) {
            return false
        }
        if (!(typeof obj['customerConsented'] === "boolean" || obj['customerConsented'] instanceof Boolean)) {
            return false
        }
        if (!(ConsumptionRequestV1Validator.deliveryStatusV1Validator.validate(obj['deliveryStatus']))) {
            return false
        }
        if (!(ConsumptionRequestV1Validator.lifetimeDollarsPurchasedValidator.validate(obj['lifetimeDollarsPurchased']))) {
            return false
        }
        if (!(ConsumptionRequestV1Validator.lifetimeDollarsRefundedValidator.validate(obj['lifetimeDollarsRefunded']))) {
            return false
        }
        if (!(ConsumptionRequestV1Validator.platformValidator.validate(obj['platform']))) {
            return false
        }
        if (!(ConsumptionRequestV1Validator.playTimeValidator.validate(obj['playTime']))) {
            return false
        }
        if ((typeof obj['refundPreference'] !== 'undefined') && !(ConsumptionRequestV1Validator.refundPreferenceV1Validator.validate(obj['refundPreference']))) {
            return false
        }
        if (!(typeof obj['sampleContentProvided'] === "boolean" || obj['sampleContentProvided'] instanceof Boolean)) {
            return false
        }
        if (!(ConsumptionRequestV1Validator.userStatusValidator.validate(obj['userStatus']))) {
            return false
        }
        return true
    }
}
