// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { LastTransactionsItem, LastTransactionsItemValidator } from "./LastTransactionsItem"
import { Validator } from "./Validator"

/**
 * Information for auto-renewable subscriptions, including signed transaction information and signed renewal information, for one subscription group.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/subscriptiongroupidentifieritem SubscriptionGroupIdentifierItem}
 */
export interface SubscriptionGroupIdentifierItem {

    /**
     * The subscription group identifier of the auto-renewable subscriptions in the lastTransactions array.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/subscriptiongroupidentifier subscriptionGroupIdentifier}
     */
    subscriptionGroupIdentifier?: string

    /**
     * An array of the most recent App Store-signed transaction information and App Store-signed renewal information for all auto-renewable subscriptions in the subscription group.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/lasttransactionsitem lastTransactionsItem}
     */
    lastTransactions?: LastTransactionsItem[]
}

export class SubscriptionGroupIdentifierItemValidator implements Validator<SubscriptionGroupIdentifierItem> {
    static readonly lastTransactionsItemValidator = new LastTransactionsItemValidator()
    validate(obj: any): obj is SubscriptionGroupIdentifierItem {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if ((typeof obj['subscriptionGroupIdentifier'] !== 'undefined') && !(typeof obj['subscriptionGroupIdentifier'] === "string" || obj['subscriptionGroupIdentifier'] instanceof String)) {
            return false
        }
        if (typeof obj['lastTransactions'] !== 'undefined') {
            if (!Array.isArray(obj['lastTransactions'])) {
                return false
            }
            for (const lastTransaction of obj['lastTransactions']) {
                if (!(SubscriptionGroupIdentifierItemValidator.lastTransactionsItemValidator.validate(lastTransaction))) {
                    return false
                }
            }
        }
        return true
    }
}
