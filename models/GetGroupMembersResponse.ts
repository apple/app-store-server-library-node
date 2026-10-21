// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { GroupMemberEntry, GroupMemberEntryValidator } from "./GroupMemberEntry"
import { Validator } from "./Validator"

/**
 * A response that contains a page of the customers that belong to a group.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/getgroupmembersresponse GetGroupMembersResponse}
 */
export interface GetGroupMembersResponse {

    /**
     * An array of the customers that belong to the group.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/groupmemberentry GroupMemberEntry}
     */
    members?: GroupMemberEntry[]

    /**
     * A token you send in a subsequent request to get the next set of members.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/paginationtoken paginationToken}
     */
    paginationToken?: string

    /**
     * A Boolean value that indicates whether the group has more members than the response contains.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/hasmore hasMore}
     */
    hasMore?: boolean
}

export class GetGroupMembersResponseValidator implements Validator<GetGroupMembersResponse> {
    static readonly groupMemberEntryValidator = new GroupMemberEntryValidator()
    validate(obj: any): obj is GetGroupMembersResponse {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (typeof obj['members'] !== 'undefined') {
            if (!Array.isArray(obj['members'])) {
                return false
            }
            for (const member of obj['members']) {
                if (!(GetGroupMembersResponseValidator.groupMemberEntryValidator.validate(member))) {
                    return false
                }
            }
        }
        if ((typeof obj['paginationToken'] !== 'undefined') && !(typeof obj['paginationToken'] === "string" || obj['paginationToken'] instanceof String)) {
            return false
        }
        if ((typeof obj['hasMore'] !== 'undefined') && !(typeof obj['hasMore'] === "boolean" || obj['hasMore'] instanceof Boolean)) {
            return false
        }
        return true
    }
}
