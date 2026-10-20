// Copyright (c) 2026 Apple Inc. Licensed under MIT License.
import { ExternalPurchaseToken, ExternalPurchaseTokenValidator } from "../../models/ExternalPurchaseToken";
import { TokenType } from "../../models/TokenType";
import { Equals, RequiredKeys } from "../util";

describe('ExternalPurchaseToken', () => {
    it('should validate ExternalPurchaseToken with CORE_TECHNOLOGY tokenType', () => {
        const validator = new ExternalPurchaseTokenValidator()
        const externalPurchaseToken = {
            externalPurchaseId: "b2158121-7af9-49d4-9561-1f588205523e",
            tokenCreationDate: 1698148950000,
            appAppleId: 55555,
            bundleId: "com.example",
            tokenType: "CORE_TECHNOLOGY",
        }

        expect(validator.validate(externalPurchaseToken)).toBe(true)
        expect((externalPurchaseToken as ExternalPurchaseToken).tokenType).toBe(TokenType.CORE_TECHNOLOGY)
    })

    it('should validate ExternalPurchaseToken without the optional fields', () => {
        const validator = new ExternalPurchaseTokenValidator()
        const externalPurchaseToken = {
            externalPurchaseId: "b2158121-7af9-49d4-9561-1f588205523e",
            tokenCreationDate: 1698148950000,
            appAppleId: 55555,
            bundleId: "com.example",
        }

        expect(validator.validate(externalPurchaseToken)).toBe(true)
    })

    it.each(['externalPurchaseId', 'tokenCreationDate', 'appAppleId', 'bundleId'])('should reject ExternalPurchaseToken without the required %s', (key) => {
        const validator = new ExternalPurchaseTokenValidator()
        const externalPurchaseToken: { [key: string]: unknown } = {
            externalPurchaseId: "b2158121-7af9-49d4-9561-1f588205523e",
            tokenCreationDate: 1698148950000,
            appAppleId: 55555,
            bundleId: "com.example",
            tokenType: "ACQUISITION",
            tokenExpirationDate: 1698149000000,
        }
        delete externalPurchaseToken[key]

        expect(validator.validate(externalPurchaseToken)).toBe(false)
    })

    it('should declare the fields the documentation requires as required', () => {
        const required: Equals<RequiredKeys<ExternalPurchaseToken>, 'externalPurchaseId' | 'tokenCreationDate' | 'appAppleId' | 'bundleId'> = true

        expect(required).toBe(true)
    })
})
