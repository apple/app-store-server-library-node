// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator";

/**
 * The relationship of the user with the family-shared purchase to which they have access.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/inappownershiptype inAppOwnershipType}
 */
export enum InAppOwnershipType {
    FAMILY_SHARED = "FAMILY_SHARED",
    PURCHASED = "PURCHASED",
}

export class InAppOwnershipTypeValidator implements Validator<InAppOwnershipType> {
   validate(obj: any): obj is InAppOwnershipType {
        return Object.values(InAppOwnershipType).includes(obj)
    }
}
