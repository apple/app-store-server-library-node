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
})