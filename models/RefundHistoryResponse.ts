// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * A response that contains an array of signed JSON Web Signature (JWS) refunded transactions, and paging information.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/refundhistoryresponse RefundHistoryResponse}
 */
export interface RefundHistoryResponse {

    /**
     * A Boolean value that indicates whether the App Store has more transactions than it returns in signedTransactions.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/hasmore hasMore}
     */
    hasMore?: boolean

    /**
     * A token you provide in a query to request the next set of transactions from the Get Refund History endpoint.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/revision revision}
     */
    revision?: string

    /**
     * A list of up to 20 JWS transactions, or an empty array if the customer hasn’t received any refunds in your app.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/jwstransaction JWSTransaction}
     */
    signedTransactions?: string[]
}

export class RefundHistoryResponseValidator implements Validator<RefundHistoryResponse> {
    validate(obj: any): obj is RefundHistoryResponse {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
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
