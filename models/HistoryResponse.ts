// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Environment, EnvironmentValidator } from "./Environment"
import { Validator } from "./Validator"

/**
 * A response that contains the customer’s transaction history for an app.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/historyresponse HistoryResponse}
 */
export interface HistoryResponse {

    /**
     * The app’s identifier in the App Store.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/appappleid appAppleId}
     */
    appAppleId?: number

    /**
     * The bundle identifier of the app.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/bundleid bundleId}
     */
    bundleId?: string

    /**
     * The server environment in which you’re making the request, whether sandbox or production.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/environment environment}
     */
    environment?: Environment | string

    /**
     * A Boolean value that indicates whether the App Store has more transactions than it returns in this response.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/hasmore hasMore}
     */
    hasMore?: boolean

    /**
     * A token you use in a query to request the next set of transactions from the endpoint.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/revision revision}
     */
    revision?: string

    /**
     * An array of in-app purchase transactions for the customer, signed by Apple, in JSON Web Signature (JWS) format.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/jwstransaction JWSTransaction}
     */
    signedTransactions?: string[]
}

export class HistoryResponseValidator implements Validator<HistoryResponse> {
    static readonly environmentValidator = new EnvironmentValidator()
    validate(obj: any): obj is HistoryResponse {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if ((typeof obj['appAppleId'] !== 'undefined') && !(typeof obj['appAppleId'] === "number" || obj['appAppleId'] instanceof Number)) {
            return false
        }
        if ((typeof obj['bundleId'] !== 'undefined') && !(typeof obj['bundleId'] === "string" || obj['bundleId'] instanceof String)) {
            return false
        }
        if ((typeof obj['environment'] !== 'undefined') && !(HistoryResponseValidator.environmentValidator.validate(obj['environment']))) {
            return false
        }
        if ((typeof obj['hasMore'] !== 'undefined') && !(typeof obj['hasMore'] === "boolean" || obj['hasMore'] instanceof Boolean)) {
            return false
        }
        if ((typeof obj['revision'] !== 'undefined') && !(typeof obj['revision'] === "string" || obj['revision'] instanceof String)) {
            return false
        }
        if (typeof obj['signedTransactions'] !== 'undefined') {
            if (!Array.isArray(obj['signedTransactions'])) {
                return false
            }
            for (const signedTransaction of obj['signedTransactions']) {
                if (!(typeof signedTransaction === "string" || signedTransaction instanceof String)) {
                    return false
                }
            }
        }
        return true
    }
}
