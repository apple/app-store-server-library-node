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
     * The field of an external purchase token that uniquely identifies the token.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/externalpurchaseid externalPurchaseId}
     **/
    externalPurchaseId?: string

    /**
     * The field of an external purchase token that contains the UNIX date, in milliseconds, when the system created the token.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/tokencreationdate tokenCreationDate}
     **/
    tokenCreationDate?: number
        
    /**
     * The unique identifier of an app in the App Store.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/appappleid appAppleId}
     **/
    appAppleId?: number
        
    /**
     * The bundle identifier of an app.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/bundleid bundleId}
     **/
    bundleId?: string

    /**
     * The type of an external purchase custom link token.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/tokentype tokenType}
     **/
    tokenType?: TokenType | string

    /**
     * The field of a custom link token that contains the UNIX date, in milliseconds, when the token expires.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/tokenexpirationdate tokenExpirationDate}
     **/
    tokenExpirationDate?: number
}


export class ExternalPurchaseTokenValidator implements Validator<ExternalPurchaseToken> {
    static readonly tokenTypeValidator = new TokenTypeValidator()
    validate(obj: any): obj is ExternalPurchaseToken {
        if ((typeof obj['externalPurchaseId'] !== 'undefined') && !(typeof obj['externalPurchaseId'] === "string" || obj['externalPurchaseId'] instanceof String)) {
            return false
        }
        if ((typeof obj['tokenCreationDate'] !== 'undefined') && !(typeof obj['tokenCreationDate'] === "number")) {
            return false
        }
        if ((typeof obj['appAppleId'] !== 'undefined') && !(typeof obj['appAppleId'] === "number")) {
            return false
        }
        if ((typeof obj['bundleId'] !== 'undefined') && !(typeof obj['bundleId'] === "string" || obj['bundleId'] instanceof String)) {
            return false
        }
        if ((typeof obj['tokenType'] !== 'undefined') && !(ExternalPurchaseTokenValidator.tokenTypeValidator.validate(obj['tokenType']))) {
            return false
        }
        if ((typeof obj['tokenExpirationDate'] !== 'undefined') && !(typeof obj['tokenExpirationDate'] === "number")) {
            return false
        }
        return true
    }
}
