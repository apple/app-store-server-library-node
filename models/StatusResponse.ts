// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Environment, EnvironmentValidator } from "./Environment"
import { SubscriptionGroupIdentifierItem, SubscriptionGroupIdentifierItemValidator } from "./SubscriptionGroupIdentifierItem"
import { Validator } from "./Validator"

/**
 * A response that contains status information for all of a customer’s auto-renewable subscriptions in your app.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/statusresponse StatusResponse}
 */
export interface StatusResponse {

    /**
     * An array of information for auto-renewable subscriptions, including App Store-signed transaction information and App Store-signed renewal information.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/subscriptiongroupidentifieritem SubscriptionGroupIdentifierItem}
     */
    data?: SubscriptionGroupIdentifierItem[]

    /**
     * The server environment, sandbox or production, in which the App Store generated the response.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/environment environment}
     */
    environment?: Environment | string

    /**
     * Your app’s App Store identifier.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/appappleid appAppleId}
     */
    appAppleId?: number

    /**
     * Your app’s bundle identifier.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/bundleid bundleId}
     */
    bundleId?: string
}

export class StatusResponseValidator implements Validator<StatusResponse> {
    static readonly subscriptionGroupIdentifierItemValidator = new SubscriptionGroupIdentifierItemValidator()
    static readonly environmentValidator = new EnvironmentValidator()
    validate(obj: any): obj is StatusResponse {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (typeof obj['data'] !== 'undefined') {
            if (!Array.isArray(obj['data'])) {
                return false
            }
            for (const subscriptionGroupIdentifierItem of obj['data']) {
                if (!(StatusResponseValidator.subscriptionGroupIdentifierItemValidator.validate(subscriptionGroupIdentifierItem))) {
                    return false
                }
            }
        }
        if ((typeof obj['environment'] !== 'undefined') && !(StatusResponseValidator.environmentValidator.validate(obj['environment']))) {
            return false
        }
        if ((typeof obj['appAppleId'] !== 'undefined') && !(typeof obj['appAppleId'] === "number" || obj['appAppleId'] instanceof Number)) {
            return false
        }
        if ((typeof obj['bundleId'] !== 'undefined') && !(typeof obj['bundleId'] === "string" || obj['bundleId'] instanceof String)) {
            return false
        }
        return true
    }
}
