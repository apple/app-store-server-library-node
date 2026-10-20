// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator"

/**
 * The reason for a refunded transaction.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/revocationreason revocationReason}
 */
export enum RevocationReason {
    /**
     * The App Store refunded the transaction on behalf of the customer due to an actual or perceived issue within your app.
     */
    REFUNDED_DUE_TO_ISSUE = 1,
    /**
     * The App Store refunded the transaction on behalf of the customer for other reasons, for example, an accidental purchase.
     */
    REFUNDED_FOR_OTHER_REASON = 0,
}

export class RevocationReasonValidator extends NumberValidator {}
