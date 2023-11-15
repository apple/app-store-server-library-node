// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Status, StatusValidator } from "./Status"
import { Validator } from "./Validator"

/**
 * The most recent App Store-signed transaction information and App Store-signed renewal information for an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/lasttransactionsitem lastTransactionsItem}
 */
export interface LastTransactionsItem {

    /**
     * The status of the auto-renewable subscription.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/status status}
     **/
    status?: Status | number
        
    /**
     * The original transaction identifier of a purchase.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/originaltransactionid originalTransactionId}
     **/
    originalTransactionId?: string
        
    /**
     * Transaction information signed by the App Store, in JSON Web Signature (JWS) format.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/jwstransaction JWSTransaction}
     **/
    signedTransactionInfo?: string
        
    /**
     * Subscription renewal information, signed by the App Store, in JSON Web Signature (JWS) format.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/jwsrenewalinfo JWSRenewalInfo}
     **/
    signedRenewalInfo?: string
}


export class LastTransactionsItemValidator implements Validator<LastTransactionsItem> {
    static readonly statusValidator = new StatusValidator()
    validate(obj: any): obj is LastTransactionsItem {
        if ((typeof obj['status'] !== 'undefined') && !(LastTransactionsItemValidator.statusValidator.validate(obj['status']))) {
            return false
        }
        if ((typeof obj['originalTransactionId'] !== 'undefined') && !(typeof obj['originalTransactionId'] === "string" || obj['originalTransactionId'] instanceof String)) {
            return false
        }
        if ((typeof obj['signedTransactionInfo'] !== 'undefined') && !(typeof obj['signedTransactionInfo'] === "string" || obj['signedTransactionInfo'] instanceof String)) {
            return false
        }
        if ((typeof obj['signedRenewalInfo'] !== 'undefined') && !(typeof obj['signedRenewalInfo'] === "string" || obj['signedRenewalInfo'] instanceof String)) {
            return false
        }
        return true
    }
}
