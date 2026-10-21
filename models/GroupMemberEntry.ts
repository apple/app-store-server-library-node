// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * A customer that belongs to a group.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/groupmemberentry GroupMemberEntry}
 */
export interface GroupMemberEntry {

    /**
     * The unique identifier of the member’s app download transaction.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/apptransactionid appTransactionId}
     */
    appTransactionId?: string
}

export class GroupMemberEntryValidator implements Validator<GroupMemberEntry> {
    validate(obj: any): obj is GroupMemberEntry {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if ((typeof obj['appTransactionId'] !== 'undefined') && !(typeof obj['appTransactionId'] === "string" || obj['appTransactionId'] instanceof String)) {
            return false
        }
        return true
    }
}
