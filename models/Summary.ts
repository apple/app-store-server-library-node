// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Environment, EnvironmentValidator } from "./Environment"
import { Validator } from "./Validator"

/**
 * The payload data for a subscription-renewal-date extension notification.
 *
 * {@link https://developer.apple.com/documentation/appstoreservernotifications/summary summary}
 */
export interface Summary {

    /**
     * The UUID that represents a specific request to extend a subscription renewal date.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/requestidentifier requestIdentifier}
     */
    requestIdentifier?: string

    /**
     * The server environment that the notification applies to, either sandbox or production.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/environment environment}
     */
    environment?: Environment | string

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
     * The product identifier of the auto-renewable subscription that the subscription-renewal-date extension applies to.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/productid productId}
     */
    productId?: string

    /**
     * A list of country codes that limits the App Store’s attempt to apply the subscription-renewal-date extension.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/storefrontcountrycodes storefrontCountryCodes}
     */
    storefrontCountryCodes?: string[]

    /**
     * The final count of subscriptions that fail to receive a subscription-renewal-date extension.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/failedcount failedCount}
     */
    failedCount?: number

    /**
     * The final count of subscriptions that successfully receive a subscription-renewal-date extension.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/succeededcount succeededCount}
     */
    succeededCount?: number
}

export class SummaryValidator implements Validator<Summary> {
    static readonly environmentValidator = new EnvironmentValidator()
    private static readonly MAXIMUM_STOREFRONT_COUNTRY_CODE_LENGTH = 3
    validate(obj: any): obj is Summary {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if ((typeof obj['requestIdentifier'] !== 'undefined') && !(typeof obj['requestIdentifier'] === "string" || obj['requestIdentifier'] instanceof String)) {
            return false
        }
        if ((typeof obj['environment'] !== 'undefined') && !(SummaryValidator.environmentValidator.validate(obj['environment']))) {
            return false
        }
        if ((typeof obj['appAppleId'] !== 'undefined') && !(typeof obj['appAppleId'] === "number" || obj['appAppleId'] instanceof Number)) {
            return false
        }
        if ((typeof obj['bundleId'] !== 'undefined') && !(typeof obj['bundleId'] === "string" || obj['bundleId'] instanceof String)) {
            return false
        }
        if ((typeof obj['productId'] !== 'undefined') && !(typeof obj['productId'] === "string" || obj['productId'] instanceof String)) {
            return false
        }
        if (typeof obj['storefrontCountryCodes'] !== 'undefined') {
            if (!Array.isArray(obj['storefrontCountryCodes'])) {
                return false
            }
            for (const storefrontCountryCode of obj['storefrontCountryCodes']) {
                if (!((typeof storefrontCountryCode === "string" || storefrontCountryCode instanceof String) && [...storefrontCountryCode].length <= SummaryValidator.MAXIMUM_STOREFRONT_COUNTRY_CODE_LENGTH)) {
                    return false
                }
            }
        }
        if ((typeof obj['failedCount'] !== 'undefined') && !(typeof obj['failedCount'] === "number" || obj['failedCount'] instanceof Number)) {
            return false
        }
        if ((typeof obj['succeededCount'] !== 'undefined') && !(typeof obj['succeededCount'] === "number" || obj['succeededCount'] instanceof Number)) {
            return false
        }
        return true
    }
}
