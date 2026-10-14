// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { GroupEntry, GroupEntryValidator } from "./GroupEntry"
import { Validator } from "./Validator"

/**
 * A response that contains the groups a customer belongs to, and their role in each group.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/getcustomergroupsresponse GetCustomerGroupsResponse}
 */
export interface GetCustomerGroupsResponse {

    /**
     * An array of groups that the customer belongs to.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/groupentry GroupEntry}
     */
    groups?: GroupEntry[]
}

export class GetCustomerGroupsResponseValidator implements Validator<GetCustomerGroupsResponse> {
    static readonly groupEntryValidator = new GroupEntryValidator()
    validate(obj: any): obj is GetCustomerGroupsResponse {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (typeof obj['groups'] !== 'undefined') {
            if (!Array.isArray(obj['groups'])) {
                return false
            }
            for (const group of obj['groups']) {
                if (!(GetCustomerGroupsResponseValidator.groupEntryValidator.validate(group))) {
                    return false
                }
            }
        }
        return true
    }
}
