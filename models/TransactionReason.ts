// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * The cause of a purchase transaction, which indicates whether it’s a customer’s purchase or a renewal for an auto-renewable subscription that the system initiates.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/transactionreason transactionReason}
 */
export enum TransactionReason {
    /**
     * The customer initiated the purchase, which may be for any in-app purchase type: consumable, non-consumable, non-renewing subscription, or auto-renewable subscription.
     */
    PURCHASE = "PURCHASE",
    /**
     * The App Store server initiated the purchase transaction to renew an auto-renewable subscription.
     */
    RENEWAL = "RENEWAL",
}

export class TransactionReasonValidator extends StringValidator {}
