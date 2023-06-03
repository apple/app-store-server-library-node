// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { LastTransactionsItem } from "./LastTransactionsItem";
import { Validator } from "./Validator";

/**
 * Information for auto-renewable subscriptions, including signed transaction information and signed renewal information, for one subscription group.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/subscriptiongroupidentifieritem SubscriptionGroupIdentifierItem}
 */
export interface SubscriptionGroupIdentifierItem {
    /**
     * The identifier of the subscription group that the subscription belongs to.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/subscriptiongroupidentifier subscriptionGroupIdentifier}
     **/
    subscriptionGroupIdentifier?: string

    /**
     * An array of the most recent App Store-signed transaction information and App Store-signed renewal information for all auto-renewable subscriptions in the subscription group.
     *
     **/
    lastTransactions?: LastTransactionsItem[]
}


export class SubscriptionGroupIdentifierItemValidator implements Validator<SubscriptionGroupIdentifierItem> {
    validate(obj: any): boolean {
        if ((typeof obj['subscriptionGroupIdentifier'] !== 'undefined') && !(typeof obj['subscriptionGroupIdentifier'] === "string" || obj['subscriptionGroupIdentifier'] instanceof String)) {
            return false
        }
        return true
    }
}
