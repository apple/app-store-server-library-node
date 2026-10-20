// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * The type of the refund or revocation that applies to the transaction.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/revocationtype revocationType}
 */
export enum RevocationType {
    /**
     * The transaction has a full refund.
     */
    REFUND_FULL = "REFUND_FULL",
    /**
     * The transaction has a prorated refund.
     */
    REFUND_PRORATED = "REFUND_PRORATED",
    /**
     * The transaction is revoked from Family Sharing.
     */
    FAMILY_REVOKE = "FAMILY_REVOKE",
    /**
     * The organization or group purchaser removed the subscription from the customer.
     */
    ASSIGNMENT_REVOKE = "ASSIGNMENT_REVOKE",
}

export class RevocationTypeValidator extends StringValidator {}
