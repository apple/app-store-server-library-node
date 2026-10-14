// Copyright (c) 2026 Apple Inc. Licensed under MIT License.
import { InAppOwnershipType } from "../../models/InAppOwnershipType";
import { JWSTransactionDecodedPayload, JWSTransactionDecodedPayloadValidator } from "../../models/JWSTransactionDecodedPayload";
import { RevocationType } from "../../models/RevocationType";

describe('JWSTransactionDecodedPayload', () => {
    it('should validate transaction with previousOriginalTransactionId', () => {
        const validator = new JWSTransactionDecodedPayloadValidator()
        const validTransaction = {
            originalTransactionId: "12345",
            previousOriginalTransactionId: "11111",
        }

        expect(validator.validate(validTransaction)).toBe(true)
    })

    it('should reject transaction with invalid previousOriginalTransactionId type', () => {
        const validator = new JWSTransactionDecodedPayloadValidator()
        const invalidTransaction = {
            originalTransactionId: "12345",
            previousOriginalTransactionId: 11111,
        }

        expect(validator.validate(invalidTransaction)).toBe(false)
    })

    it('should validate assigned transaction with ASSIGNMENT_REVOKE revocationType', () => {
        const validator = new JWSTransactionDecodedPayloadValidator()
        const transaction = {
            originalTransactionId: "12345",
            inAppOwnershipType: "ASSIGNED",
            revocationType: "ASSIGNMENT_REVOKE",
        }

        expect(validator.validate(transaction)).toBe(true)
        expect((transaction as JWSTransactionDecodedPayload).inAppOwnershipType).toBe(InAppOwnershipType.ASSIGNED)
        expect((transaction as JWSTransactionDecodedPayload).revocationType).toBe(RevocationType.ASSIGNMENT_REVOKE)
    })
})
