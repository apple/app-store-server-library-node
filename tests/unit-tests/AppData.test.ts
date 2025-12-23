// Copyright (c) 2025 Apple Inc. Licensed under MIT License.
import { AppData, AppDataValidator } from "../../models/AppData";
import * as fs from 'fs';

describe('AppData', () => {
    it('should deserialize AppData from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/appData.json', 'utf8');

        const appData: AppData = JSON.parse(json)

        expect(appData.appAppleId).toBe(987654321)
        expect(appData.bundleId).toBe("com.example")
        expect(appData.environment).toBe("Sandbox")
        expect(appData.signedAppTransactionInfo).toBe("signed-app-transaction-info")
    })

    it('should validate valid AppData', () => {
        const validator = new AppDataValidator()
        const validAppData = {
            appAppleId: 987654321,
            bundleId: "com.example",
            environment: "Sandbox",
            signedAppTransactionInfo: "signed-app-transaction-info"
        }

        expect(validator.validate(validAppData)).toBe(true)
    })

    it('should reject AppData with invalid appAppleId type', () => {
        const validator = new AppDataValidator()
        const invalidAppData = {
            appAppleId: "not-a-number",
            bundleId: "com.example",
            environment: "Sandbox",
            signedAppTransactionInfo: "signed-app-transaction-info"
        }

        expect(validator.validate(invalidAppData)).toBe(false)
    })
})