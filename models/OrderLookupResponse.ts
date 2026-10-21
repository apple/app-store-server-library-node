// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { OrderLookupStatus, OrderLookupStatusValidator } from "./OrderLookupStatus"
import { Validator } from "./Validator"

/**
 * A response that includes the order lookup status and an array of signed transactions for the in-app purchases in the order.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/orderlookupresponse OrderLookupResponse}
 */
export interface OrderLookupResponse {

    /**
     * The status that indicates whether the order ID is valid.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/orderlookupstatus OrderLookupStatus}
     */
    status?: OrderLookupStatus | number

    /**
     * An array of in-app purchase transactions that are part of the order, signed by Apple, in JSON Web Signature format.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/jwstransaction JWSTransaction}
     */
    signedTransactions?: string[]
}

export class OrderLookupResponseValidator implements Validator<OrderLookupResponse> {
    static readonly orderLookupStatusValidator = new OrderLookupStatusValidator()
    validate(obj: any): obj is OrderLookupResponse {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if ((typeof obj['status'] !== 'undefined') && !(OrderLookupResponseValidator.orderLookupStatusValidator.validate(obj['status']))) {
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
