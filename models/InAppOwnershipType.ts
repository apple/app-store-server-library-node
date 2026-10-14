// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * A string that describes whether the transaction was purchased by the customer, or is available to them through Family Sharing, an organization, or a group.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/inappownershiptype inAppOwnershipType}
 */
export enum InAppOwnershipType {
    /**
     * The transaction belongs to a family member who benefits from service.
     */
    FAMILY_SHARED = "FAMILY_SHARED",
    /**
     * The transaction belongs to the purchaser.
     */
    PURCHASED = "PURCHASED",
    /**
     * The transaction belongs to a customer who has access through an organization or group.
     */
    ASSIGNED = "ASSIGNED",
}

export class InAppOwnershipTypeValidator extends StringValidator {}
