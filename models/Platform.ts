// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator"

/**
 * The platform on which the customer consumed the in-app purchase.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/platform platform}
 */
export enum Platform {
    /**
     * The platform is undeclared.
     */
    UNDECLARED = 0,
    /**
     * An Apple platform.
     */
    APPLE = 1,
    /**
     * Non-Apple platform.
     */
    NON_APPLE = 2,
}

export class PlatformValidator extends NumberValidator {}
