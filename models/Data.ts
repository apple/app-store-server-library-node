// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { ConsumptionRequestReason, ConsumptionRequestReasonValidator } from "./ConsumptionRequestReason"
import { Environment, EnvironmentValidator } from "./Environment"
import { Status, StatusValidator } from "./Status"
import { Validator } from "./Validator"

/**
 * The payload data that contains app metadata and the signed renewal and transaction information.
 *
 * {@link https://developer.apple.com/documentation/appstoreservernotifications/data data}
 */
export interface Data {

    /**
     * The unique identifier of the app that the notification applies to.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/appappleid appAppleId}
     */
    appAppleId?: number

    /**
     * The bundle identifier of the app.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/bundleid bundleId}
     */
    bundleId?: string

    /**
     * The version of the build that identifies an iteration of the bundle.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/bundleversion bundleVersion}
     */
    bundleVersion?: string

    /**
     * The reason the customer requested the refund.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/consumptionrequestreason consumptionRequestReason}
     */
    consumptionRequestReason?: ConsumptionRequestReason | string

    /**
     * The server environment that the notification applies to, either sandbox or production.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/environment environment}
     */
    environment?: Environment | string

    /**
     * Subscription renewal information signed by the App Store, in JSON Web Signature (JWS) format.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/jwsrenewalinfo JWSRenewalInfo}
     */
    signedRenewalInfo?: string

    /**
     * Transaction information signed by the App Store, in JSON Web Signature (JWS) format.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/jwstransaction JWSTransaction}
     */
    signedTransactionInfo?: string

    /**
     * The status of an auto-renewable subscription as of the signedDate in the responseBodyV2DecodedPayload.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/status status}
     */
    status?: Status | number
}

export class DataValidator implements Validator<Data> {
    static readonly consumptionRequestReasonValidator = new ConsumptionRequestReasonValidator()
    static readonly environmentValidator = new EnvironmentValidator()
    static readonly statusValidator = new StatusValidator()
    validate(obj: any): obj is Data {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if ((typeof obj['appAppleId'] !== 'undefined') && !(typeof obj['appAppleId'] === "number" || obj['appAppleId'] instanceof Number)) {
            return false
        }
        if ((typeof obj['bundleId'] !== 'undefined') && !(typeof obj['bundleId'] === "string" || obj['bundleId'] instanceof String)) {
            return false
        }
        if ((typeof obj['bundleVersion'] !== 'undefined') && !(typeof obj['bundleVersion'] === "string" || obj['bundleVersion'] instanceof String)) {
            return false
        }
        if ((typeof obj['consumptionRequestReason'] !== 'undefined') && !(DataValidator.consumptionRequestReasonValidator.validate(obj['consumptionRequestReason']))) {
            return false
        }
        if ((typeof obj['environment'] !== 'undefined') && !(DataValidator.environmentValidator.validate(obj['environment']))) {
            return false
        }
        if ((typeof obj['signedRenewalInfo'] !== 'undefined') && !(typeof obj['signedRenewalInfo'] === "string" || obj['signedRenewalInfo'] instanceof String)) {
            return false
        }
        if ((typeof obj['signedTransactionInfo'] !== 'undefined') && !(typeof obj['signedTransactionInfo'] === "string" || obj['signedTransactionInfo'] instanceof String)) {
            return false
        }
        if ((typeof obj['status'] !== 'undefined') && !(DataValidator.statusValidator.validate(obj['status']))) {
            return false
        }
        return true
    }
}
