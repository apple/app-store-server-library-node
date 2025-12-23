// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { Environment, EnvironmentValidator } from "./Environment"
import { Validator } from "./Validator"

/**
 * The object that contains the app metadata and signed app transaction information.
 *
 * {@link https://developer.apple.com/documentation/appstoreservernotifications/appdata AppData}
 */
export interface AppData {

    /**
     * The unique identifier of the app that the notification applies to.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/appappleid appAppleId}
     **/
    appAppleId?: number

    /**
     * The bundle identifier of the app.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/bundleid bundleId}
     **/
    bundleId?: string

    /**
     * The server environment that the notification applies to, either sandbox or production.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/environment environment}
     **/
    environment?: Environment | string

    /**
     * App transaction information signed by the App Store, in JSON Web Signature (JWS) format.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/jwsapptransaction signedAppTransactionInfo}
     **/
    signedAppTransactionInfo?: string
}


export class AppDataValidator implements Validator<AppData> {
    static readonly environmentValidator = new EnvironmentValidator()
    validate(obj: any): obj is AppData {
        if ((typeof obj['appAppleId'] !== 'undefined') && !(typeof obj['appAppleId'] === "number")) {
            return false
        }
        if ((typeof obj['bundleId'] !== 'undefined') && !(typeof obj['bundleId'] === "string" || obj['bundleId'] instanceof String)) {
            return false
        }
        if ((typeof obj['environment'] !== 'undefined') && !(AppDataValidator.environmentValidator.validate(obj['environment']))) {
            return false
        }
        if ((typeof obj['signedAppTransactionInfo'] !== 'undefined') && !(typeof obj['signedAppTransactionInfo'] === "string" || obj['signedAppTransactionInfo'] instanceof String)) {
            return false
        }
        return true
    }
}
