// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Environment, EnvironmentValidator } from "./Environment";
import { Validator } from "./Validator";

/**
 * A response that contains the customer’s transaction history for an app.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/historyresponse HistoryResponse}
 */
export interface HistoryResponse {
    /**
     * A token you use in a query to request the next set of transactions for the customer.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/revision revision}
     **/
    revision?: string
        
    /**
     * A Boolean value indicating whether the App Store has more transaction data.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/hasmore hasMore}
     **/
    hasMore?: boolean
        
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
     * The server environment in which you’re making the request, whether sandbox or production.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/environment environment}
     **/
    environment?: Environment | string

    /**
     * An array of in-app purchase transactions for the customer, signed by Apple, in JSON Web Signature format.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/jwstransaction JWSTransaction}
     **/
    signedTransactions?: string[];
}


export class HistoryResponseValidator implements Validator<HistoryResponse> {
    static readonly environmentValidator = new EnvironmentValidator()
    validate(obj: any): obj is HistoryResponse {
        if ((typeof obj['revision'] !== 'undefined') && !(typeof obj['revision'] === "string" || obj['revision'] instanceof String)) {
            return false
        }
        if ((typeof obj['hasMore'] !== 'undefined') && !(typeof obj['hasMore'] === "boolean" || obj['hasMore'] instanceof Boolean)) {
            return false
        }
        if ((typeof obj['bundleId'] !== 'undefined') && !(typeof obj['bundleId'] === "string" || obj['bundleId'] instanceof String)) {
            return false
        }
        if ((typeof obj['appAppleId'] !== 'undefined') && !(typeof obj['appAppleId'] === "number")) {
            return false
        }
        if ((typeof obj['environment'] !== 'undefined') && !(HistoryResponseValidator.environmentValidator.validate(obj['environment']))) {
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
