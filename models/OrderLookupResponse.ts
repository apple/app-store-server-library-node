// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { OrderLookupStatus, OrderLookupStatusValidator } from "./OrderLookupStatus";
import { Validator } from "./Validator";

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
     **/
    status?: OrderLookupStatus

    /**
     * An array of in-app purchase transactions that are part of order, signed by Apple, in JSON Web Signature format.
     *
     **/
    signedTransactions?: string[];
}


export class OrderLookupResponseValidator implements Validator<OrderLookupResponse> {
    static readonly statusValidator = new OrderLookupStatusValidator()
    validate(obj: any): obj is OrderLookupResponse {
        if ((typeof obj['status'] !== 'undefined') && !(OrderLookupResponseValidator.statusValidator.validate(obj['status']))) {
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
