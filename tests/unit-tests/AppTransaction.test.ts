// Copyright (c) 2023 Apple Inc. Licensed under MIT License.
import { AppTransaction, AppTransactionValidator } from "../../models/AppTransaction";
import { StoreType } from "../../models/StoreType";
import * as fs from 'fs';

describe('AppTransaction', () => {
    it('should deserialize AppTransaction from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/appTransaction.json', 'utf8');

        const appTransaction: AppTransaction = JSON.parse(json)

        expect(appTransaction.receiptType).toBe("LocalTesting")
        expect(appTransaction.appAppleId).toBe(531412)
        expect(appTransaction.bundleId).toBe("com.example")
        expect(appTransaction.storeType).toBe(StoreType.CONSUMER)
    })

    it('should validate valid AppTransaction', () => {
        const validator = new AppTransactionValidator()
        const validAppTransaction = {
            receiptType: "Sandbox",
            bundleId: "com.example",
        }

        expect(validator.validate(validAppTransaction)).toBe(true)
    })

    it('should reject AppTransaction with invalid receiptType type', () => {
        const validator = new AppTransactionValidator()
        const invalidAppTransaction = {
            receiptType: 123,
            bundleId: "com.example",
        }

        expect(validator.validate(invalidAppTransaction)).toBe(false)
    })

    it('should validate AppTransaction with storeType', () => {
        const validator = new AppTransactionValidator()
        const validAppTransaction = {
            bundleId: "com.example",
            storeType: "CONSUMER",
        }

        expect(validator.validate(validAppTransaction)).toBe(true)
    })

    it('should reject AppTransaction with invalid storeType type', () => {
        const validator = new AppTransactionValidator()
        const invalidAppTransaction = {
            bundleId: "com.example",
            storeType: 1,
        }

        expect(validator.validate(invalidAppTransaction)).toBe(false)
    })

    it('should accept AppTransaction without receiptType', () => {
        const validator = new AppTransactionValidator()
        const appTransaction = {
            bundleId: "com.example",
        }

        expect(validator.validate(appTransaction)).toBe(true)
    })

    it('should accept AppTransaction with valid integer appAppleId and versionExternalIdentifier', () => {
        const validator = new AppTransactionValidator()
        const validAppTransaction = {
            appAppleId: 531412,
            versionExternalIdentifier: new Number(12345),
        }

        expect(validator.validate(validAppTransaction)).toBe(true)
    })

    it('should reject AppTransaction with non-integer appAppleId', () => {
        const validator = new AppTransactionValidator()

        expect(validator.validate({ appAppleId: 123.45 })).toBe(false)
        expect(validator.validate({ appAppleId: NaN })).toBe(false)
        expect(validator.validate({ appAppleId: Infinity })).toBe(false)
    })

    it('should reject AppTransaction with non-integer versionExternalIdentifier', () => {
        const validator = new AppTransactionValidator()

        expect(validator.validate({ versionExternalIdentifier: 12.34 })).toBe(false)
        expect(validator.validate({ versionExternalIdentifier: NaN })).toBe(false)
        expect(validator.validate({ versionExternalIdentifier: Infinity })).toBe(false)
    })
})
