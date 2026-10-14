// Copyright (c) 2024 Apple Inc. Licensed under MIT License.

import { TokenType, TokenTypeValidator } from "./TokenType"
import { Validator } from "./Validator"

/**
 * The payload data that contains an external purchase token.
 *
 * {@link https://developer.apple.com/documentation/appstoreservernotifications/externalpurchasetoken externalPurchaseToken}
 */
export interface ExternalPurchaseToken {

    /**
     * The unique identifier of the token.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/externalpurchaseid externalPurchaseId}
     */
    externalPurchaseId: string

    /**
     * The UNIX time, in milliseconds, when the system created the token.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/tokencreationdate tokenCreationDate}
     */
    tokenCreationDate: number

    /**
     * The app Apple ID for which the system generated the token.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/appappleid appAppleId}
     */
    appAppleId: number

    /**
     * The bundle ID of the app for which the system generated the token.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/bundleid bundleId}
     */
    bundleId: string

    /**
     * The UNIX time, in milliseconds, when a token expires.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/tokenexpirationdate tokenExpirationDate}
     */
    tokenExpirationDate?: number

    /**
     * The custom link token type, either SERVICES or ACQUISITION.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/tokentype tokenType}
     */
    tokenType?: TokenType | string
}

export class ExternalPurchaseTokenValidator implements Validator<ExternalPurchaseToken> {
    static readonly tokenTypeValidator = new TokenTypeValidator()
    validate(obj: any): obj is ExternalPurchaseToken {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(typeof obj['externalPurchaseId'] === "string" || obj['externalPurchaseId'] instanceof String)) {
            return false
        }
        if (!(typeof obj['tokenCreationDate'] === "number" || obj['tokenCreationDate'] instanceof Number)) {
            return false
        }
        if (!(typeof obj['appAppleId'] === "number" || obj['appAppleId'] instanceof Number)) {
            return false
        }
        if (!(typeof obj['bundleId'] === "string" || obj['bundleId'] instanceof String)) {
            return false
        }
        if ((typeof obj['tokenExpirationDate'] !== 'undefined') && !(typeof obj['tokenExpirationDate'] === "number" || obj['tokenExpirationDate'] instanceof Number)) {
            return false
        }
        if ((typeof obj['tokenType'] !== 'undefined') && !(ExternalPurchaseTokenValidator.tokenTypeValidator.validate(obj['tokenType']))) {
            return false
        }
        return true
    }
}
