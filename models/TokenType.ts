// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * The type of an external purchase custom link token.
 *
 * {@link https://developer.apple.com/documentation/appstoreservernotifications/tokentype tokenType}
 */
export enum TokenType {
    /**
     * A token type that indicates an initial acquisition.
     */
    ACQUISITION = "ACQUISITION",
    /**
     * A token type that indicates usage of App Store services.
     */
    SERVICES = "SERVICES",
    /**
     * A token type an app receives from the MarketplaceKit token(for:) API.
     */
    CORE_TECHNOLOGY = "CORE_TECHNOLOGY",
}

export class TokenTypeValidator extends StringValidator {}
