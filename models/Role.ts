// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * A string that identifies a customer’s role for a product within a group.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/role role}
 */
export enum Role {
    /**
     * The customer has a seat in the group but doesn’t administer it.
     */
    NONE = "NONE",
    /**
     * The customer administers the group for the product.
     */
    ADMIN = "ADMIN",
}

export class RoleValidator extends StringValidator {}
