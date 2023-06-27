// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * A response that contains signed transaction information for a single transaction.
 * 
 * {@link https://developer.apple.com/documentation/appstoreservernotifications/transactioninforesponse TransactionInfoResponse}
 */
export interface TransactionInfoResponse {

    /**
     * A customer’s in-app purchase transaction, signed by Apple, in JSON Web Signature (JWS) format.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/jwstransaction JWSTransaction}
     **/
    signedTransactionInfo?: string
}


export class TransactionInfoResponseValidator implements Validator<TransactionInfoResponse> {
    validate(obj: any): obj is TransactionInfoResponse {
        if ((typeof obj['signedTransactionInfo'] !== 'undefined') && !(typeof obj['signedTransactionInfo'] === "string" || obj['signedTransactionInfo'] instanceof String)) {
            return false
        }
        return true
    }
}
