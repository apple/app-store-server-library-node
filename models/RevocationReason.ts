// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator";

/**
 * The reason for a refunded transaction.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/revocationreason revocationReason}
 */
export enum RevocationReason {
    REFUNDED_DUE_TO_ISSUE = 1,
    REFUNDED_FOR_OTHER_REASON = 0,
}

export class RevocationReasonValidator implements Validator<RevocationReason> {
   validate(obj: any): boolean {
        return Object.values(RevocationReason).includes(obj)
    }
}
