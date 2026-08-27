// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator";

/**
 * The type of an external purchase custom link token.
 *
 * {@link https://developer.apple.com/documentation/appstoreservernotifications/tokentype tokenType}
 */
export enum TokenType {
    SERVICES = "SERVICES",
    ACQUISITION = "ACQUISITION",
}

export class TokenTypeValidator extends StringValidator {}
