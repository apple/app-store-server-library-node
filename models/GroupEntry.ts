// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { GroupType, GroupTypeValidator } from "./GroupType"
import { RoleEntry, RoleEntryValidator } from "./RoleEntry"
import { Validator } from "./Validator"

/**
 * The identifier, type, and per-product roles for a group that a customer belongs to.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/groupentry GroupEntry}
 */
export interface GroupEntry {

    /**
     * The identifier of the group.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/groupid groupId}
     */
    groupId?: string

    /**
     * The type of the group.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/grouptype groupType}
     */
    groupType?: GroupType | string

    /**
     * An optional array of the customer’s roles in this group, one for each of your products that the group provides access to.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/roleentry RoleEntry}
     */
    roles?: RoleEntry[]
}

export class GroupEntryValidator implements Validator<GroupEntry> {
    static readonly groupTypeValidator = new GroupTypeValidator()
    static readonly roleEntryValidator = new RoleEntryValidator()
    validate(obj: any): obj is GroupEntry {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if ((typeof obj['groupId'] !== 'undefined') && !(typeof obj['groupId'] === "string" || obj['groupId'] instanceof String)) {
            return false
        }
        if ((typeof obj['groupType'] !== 'undefined') && !(GroupEntryValidator.groupTypeValidator.validate(obj['groupType']))) {
            return false
        }
        if (typeof obj['roles'] !== 'undefined') {
            if (!Array.isArray(obj['roles'])) {
                return false
            }
            for (const role of obj['roles']) {
                if (!(GroupEntryValidator.roleEntryValidator.validate(role))) {
                    return false
                }
            }
        }
        return true
    }
}
