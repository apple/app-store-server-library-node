// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Environment, EnvironmentValidator } from "./Environment";
import { SubscriptionGroupIdentifierItem } from "./SubscriptionGroupIdentifierItem";
import { Validator } from "./Validator";

/**
 * A response that contains status information for all of a customer’s auto-renewable subscriptions in your app.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/statusresponse StatusResponse}
 */
export interface StatusResponse {
    /**
     * The server environment, sandbox or production, in which the App Store generated the response.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/environment environment}
     **/
    environment?: Environment
        
    /**
     * The bundle identifier of an app.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/bundleid bundleId}
     **/
    bundleId?: string
        
    /**
     * The unique identifier of an app in the App Store.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/appappleid appAppleId}
     **/
    appAppleId?: number

    /**
     * An array of information for auto-renewable subscriptions, including App Store-signed transaction information and App Store-signed renewal information.
     *
     **/
    data?: SubscriptionGroupIdentifierItem[]
}


export class StatusResponseValidator implements Validator<StatusResponse> {
    static readonly environmentValidator = new EnvironmentValidator()
    validate(obj: any): obj is StatusResponse {
        if ((typeof obj['environment'] !== 'undefined') && !(StatusResponseValidator.environmentValidator.validate(obj['environment']))) {
            return false
        }
        if ((typeof obj['bundleId'] !== 'undefined') && !(typeof obj['bundleId'] === "string" || obj['bundleId'] instanceof String)) {
            return false
        }
        if ((typeof obj['appAppleId'] !== 'undefined') && !(typeof obj['appAppleId'] === "number")) {
            return false
        }
        return true
    }
}
