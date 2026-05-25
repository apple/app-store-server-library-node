// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { ReceiptUtility } from "../../receipt_utility"
import { readFile } from "../util"


describe('Receipt Utility Tets', () => {
    it('should not extract a transaction id from an xcode receipt without a transaction', async () => {
        const receipt = readFile('tests/resources/xcode/xcode-app-receipt-empty')
        const receipt_utility = new ReceiptUtility()
        const extracted_transaction_id = receipt_utility.extractTransactionIdFromAppReceipt(receipt)
        expect(extracted_transaction_id).toBeNull()
    })
    it('should extract a transaction id from an xcode receipt with a transaction', async () => {
        const receipt = readFile('tests/resources/xcode/xcode-app-receipt-with-transaction')
        const receipt_utility = new ReceiptUtility()
        const extracted_transaction_id = receipt_utility.extractTransactionIdFromAppReceipt(receipt)
        expect(extracted_transaction_id).toBe("0")
    })
    it('should extract a transaction id from an xcode transaction receipt', async () => {
        const receipt = readFile('tests/resources/mock_signed_data/legacyTransaction')
        const receipt_utility = new ReceiptUtility()
        const extracted_transaction_id = receipt_utility.extractTransactionIdFromTransactionReceipt(receipt)
        expect(extracted_transaction_id).toBe("33993399")
    })
    it('should parse an indefinite length xcode receipt without throwing a too short ASN.1 value error', async () => {
        // Regression test for the "too short ASN.1 value" bounds check added to jsrsasign getChildIdx in 11.1.2.
        // Xcode receipts use indefinite length encoding, and the parse must succeed across jsrsasign versions.
        const receipt = readFile('tests/resources/xcode/xcode-app-receipt-with-transaction')
        const receipt_utility = new ReceiptUtility()
        expect(() => receipt_utility.extractTransactionIdFromAppReceipt(receipt)).not.toThrow()
        expect(receipt_utility.extractTransactionIdFromAppReceipt(receipt)).toBe("0")
    })
})