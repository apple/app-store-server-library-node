// Copyright (c) 2023 Apple Inc. Licensed under MIT License.
import { AppTransaction, AppTransactionValidator } from "../../models/AppTransaction";
import * as fs from 'fs';

describe('AppTransaction', () => {
    it('should deserialize AppTransaction from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/appTransaction.json', 'utf8');

        const appTransaction: AppTransaction = JSON.parse(json)

        expect(appTransaction.receiptType).toBe("LocalTesting")
        expect(appTransaction.appAppleId).toBe(531412)
        expect(appTransaction.bundleId).toBe("com.example")
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

    it('should accept AppTransaction without receiptType', () => {
        const validator = new AppTransactionValidator()
        const appTransaction = {
            bundleId: "com.example",
        }

        expect(validator.validate(appTransaction)).toBe(true)
    })
})
