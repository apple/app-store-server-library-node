// Copyright (c) 2026 Apple Inc. Licensed under MIT License.
import { SummaryValidator } from "../../models/Summary";

describe('Summary', () => {
    it('should validate Summary with storefrontCountryCodes', () => {
        const validator = new SummaryValidator()
        const validSummary = {
            bundleId: "com.example",
            storefrontCountryCodes: ["CAN", "USA", "MEX"],
        }

        expect(validator.validate(validSummary)).toBe(true)
    })

    it('should accept Summary without storefrontCountryCodes', () => {
        const validator = new SummaryValidator()
        const summary = {
            bundleId: "com.example",
        }

        expect(validator.validate(summary)).toBe(true)
    })

    it('should reject Summary with non-array storefrontCountryCodes', () => {
        const validator = new SummaryValidator()
        const invalidSummary = {
            bundleId: "com.example",
            storefrontCountryCodes: "USA",
        }

        expect(validator.validate(invalidSummary)).toBe(false)
    })

    it('should reject Summary with non-string storefrontCountryCodes element', () => {
        const validator = new SummaryValidator()
        const invalidSummary = {
            bundleId: "com.example",
            storefrontCountryCodes: ["USA", 840],
        }

        expect(validator.validate(invalidSummary)).toBe(false)
    })
})
