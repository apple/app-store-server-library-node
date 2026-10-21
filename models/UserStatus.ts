// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator"

/**
 * The status of a customer’s account within your app.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/userstatus userStatus}
 */
export enum UserStatus {
    /**
     * Account status is undeclared.
     */
    UNDECLARED = 0,
    /**
     * The customer’s account is active.
     */
    ACTIVE = 1,
    /**
     * The customer’s account is suspended.
     */
    SUSPENDED = 2,
    /**
     * The customer’s account is terminated.
     */
    TERMINATED = 3,
    /**
     * The customer’s account has limited access.
     */
    LIMITED_ACCESS = 4,
}

export class UserStatusValidator extends NumberValidator {}
