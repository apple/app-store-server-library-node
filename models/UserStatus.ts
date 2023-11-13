// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator";

/**
 * The status of a customer’s account within your app.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/userstatus userStatus}
 */
export enum UserStatus {
    UNDECLARED = 0,
    ACTIVE = 1,
    SUSPENDED = 2,
    TERMINATED = 3,
    LIMITED_ACCESS = 4,
}

export class UserStatusValidator extends NumberValidator {}
