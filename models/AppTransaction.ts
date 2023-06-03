// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Environment, EnvironmentValidator } from "./Environment"
import { Validator } from "./Validator"

/**
 * Information that represents the customer’s purchase of the app, cryptographically signed by the App Store.
 *
 * {@link https://developer.apple.com/documentation/storekit/apptransaction AppTransaction}
 */
export interface AppTransaction {

    /**
     * The server environment that signs the app transaction.
     *  
     * {@link https://developer.apple.com/documentation/storekit/apptransaction/3963901-environment environment}
     */
    receiptType?: Environment
    
    /**
     * The unique identifier the App Store uses to identify the app.
     *  
     * {@link https://developer.apple.com/documentation/storekit/apptransaction/3954436-appid appId}
     */
    appAppleId?: number
    
    /**
     * The bundle identifier that the app transaction applies to.
     *  
     * {@link https://developer.apple.com/documentation/storekit/apptransaction/3954439-bundleid bundleId}
     */
    bundleId?: string
    
    /**
     * The app version that the app transaction applies to.
     *  
     * {@link https://developer.apple.com/documentation/storekit/apptransaction/3954437-appversion appVersion}
     */
    applicationVersion?: string
    
    /**
     * The version external identifier of the app
     *  
     * {@link https://developer.apple.com/documentation/storekit/apptransaction/3954438-appversionid appVersionID}
     */
    versionExternalIdentifier?: number
    
    /**
     * The date that the App Store signed the JWS app transaction.
     *  
     * {@link https://developer.apple.com/documentation/storekit/apptransaction/3954449-signeddate signedDate}
     */
    receiptCreationDate?: number
    
    /**
     * The date the user originally purchased the app from the App Store.
     *  
     * {@link https://developer.apple.com/documentation/storekit/apptransaction/3954448-originalpurchasedate originalPurchaseDate}
     */
    originalPurchaseDate?: number
    
    /**
     * The app version that the user originally purchased from the App Store.
     *  
     * {@link https://developer.apple.com/documentation/storekit/apptransaction/3954447-originalappversion originalAppVersion}
     */
    originalApplicationVersion?: string
    
    /**
    The Base64 device verification value to use to verify whether the app transaction belongs to the device.

    {@link https://developer.apple.com/documentation/storekit/apptransaction/3954441-deviceverification deviceVerification}
    */
    deviceVerification?: string
    
    /**
     * The UUID used to compute the device verification value.
     * 
     * {@link https://developer.apple.com/documentation/storekit/apptransaction/3954442-deviceverificationnonce deviceVerificationNonce}
    */
    deviceVerificationNonce?: string
    
    /**
     * The date the customer placed an order for the app before it’s available in the App Store.
     *  
     * {@link https://developer.apple.com/documentation/storekit/apptransaction/4013175-preorderdate preorderDate}
    */
    preorderDate?: number
}

export class AppTransactionValidator implements Validator<AppTransaction> {
    static readonly environmentValidator = new EnvironmentValidator()
    validate(obj: any): boolean {
        if ((typeof obj['appAppleId'] !== 'undefined') && !(typeof obj['appAppleId'] === "number")) {
            return false
        }
        if ((typeof obj['bundleId'] !== 'undefined') && !(typeof obj['bundleId'] === "string" || obj['bundleId'] instanceof String)) {
            return false
        }
        if ((typeof obj['applicationVersion'] !== 'undefined') && !(typeof obj['applicationVersion'] === "string" || obj['applicationVersion'] instanceof String)) {
            return false
        }
        if ((typeof obj['versionExternalIdentifier'] !== 'undefined') && !(typeof obj['versionExternalIdentifier'] === "number")) {
            return false
        }
        if ((typeof obj['receiptCreationDate'] !== 'undefined') && !(typeof obj['receiptCreationDate'] === "number")) {
            return false
        }
        if ((typeof obj['originalPurchaseDate'] !== 'undefined') && !(typeof obj['originalPurchaseDate'] === "number")) {
            return false
        }
        if ((typeof obj['originalApplicationVersion'] !== 'undefined') && !(typeof obj['originalApplicationVersion'] === "string" || obj['originalApplicationVersion'] instanceof String)) {
            return false
        }
        if ((typeof obj['deviceVerification'] !== 'undefined') && !(typeof obj['deviceVerification'] === "string" || obj['deviceVerification'] instanceof String)) {
            return false
        }
        if ((typeof obj['deviceVerificationNonce'] !== 'undefined') && !(typeof obj['deviceVerificationNonce'] === "string" || obj['deviceVerificationNonce'] instanceof String)) {
            return false
        }
        if ((typeof obj['preorderDate'] !== 'undefined') && !(typeof obj['preorderDate'] === "number")) {
            return false
        }
        if ((typeof obj['environment'] !== 'undefined') && !(AppTransactionValidator.environmentValidator.validate(obj['environment']))) {
            return false
        }
        return true
    }
}