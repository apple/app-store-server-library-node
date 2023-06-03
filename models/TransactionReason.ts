// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator";

/**
 * The cause of a purchase transaction, which indicates whether it’s a customer’s purchase or a renewal for an auto-renewable subscription that the system initiates.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/transactionreason transactionReason}
 */
export enum TransactionReason {
    PURCHASE = "PURCHASE",
    RENEWAL = "RENEWAL",
}

export class TransactionReasonValidator implements Validator<TransactionReason> {
   validate(obj: any): boolean {
        return Object.values(TransactionReason).includes(obj)
    }
}
