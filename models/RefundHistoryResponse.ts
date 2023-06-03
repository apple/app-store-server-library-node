// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator";

/**
 * A response that contains an array of signed JSON Web Signature (JWS) refunded transactions, and paging information.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/refundhistoryresponse RefundHistoryResponse}
 */
export interface RefundHistoryResponse {

    /**
     * A list of up to 20 JWS transactions, or an empty array if the customer hasn&#39;t received any refunds in your app. The transactions are sorted in ascending order by revocationDate.
     *
     **/
    signedTransactions?: string[];
        
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
}


export class RefundHistoryResponseValidator implements Validator<RefundHistoryResponse> {
    validate(obj: any): boolean {
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
        if ((typeof obj['revision'] !== 'undefined') && !(typeof obj['revision'] === "string" || obj['revision'] instanceof String)) {
            return false
        }
        if ((typeof obj['hasMore'] !== 'undefined') && !(typeof obj['hasMore'] === "boolean" || obj['hasMore'] instanceof Boolean)) {
            return false
        }
        return true
    }
}
