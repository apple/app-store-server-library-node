// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * A string that describes the kind of multiseat purchase a customer’s access comes from.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/grouptype groupType}
 */
export enum GroupType {
    /**
     * An organization bought seats through Volume Purchasing and assigned one to the customer.
     */
    ORGANIZATION = "ORGANIZATION",
    /**
     * A subscriber bought seats through Group Purchases and invited the customer to join.
     */
    CONSUMER = "CONSUMER",
}

export class GroupTypeValidator extends StringValidator {}
