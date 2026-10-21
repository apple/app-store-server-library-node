// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { Role, RoleValidator } from "./Role"
import { Validator } from "./Validator"

/**
 * A customer’s role for a single product within a group.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/roleentry RoleEntry}
 */
export interface RoleEntry {

    /**
     * The product identifier of the in-app purchase that the role applies to.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/productid productId}
     */
    productId?: string

    /**
     * The customer’s role for the product.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/role role}
     */
    role?: Role | string
}

export class RoleEntryValidator implements Validator<RoleEntry> {
    static readonly roleValidator = new RoleValidator()
    validate(obj: any): obj is RoleEntry {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if ((typeof obj['productId'] !== 'undefined') && !(typeof obj['productId'] === "string" || obj['productId'] instanceof String)) {
            return false
        }
        if ((typeof obj['role'] !== 'undefined') && !(RoleEntryValidator.roleValidator.validate(obj['role']))) {
            return false
        }
        return true
    }
}
