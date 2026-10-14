// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { ReceiptUtility } from "../../receipt_utility"
import { readFile } from "../util"
import { Constructed, Integer, ObjectIdentifier, OctetString, Sequence, Set, Utf8String } from "asn1js"


describe('Receipt Utility Tets', () => {
    it.each([1703, 1705])('extracts a transaction id from a DER receipt attribute %s', type => {
        const attribute = (id: number, value: ArrayBuffer) => new Sequence({ value: [new Integer({ value: id }), new Integer({ value: 1 }), new OctetString({ valueHex: value })] })
        const inApp = new Set({ value: [attribute(type, new Utf8String({ value: '123456789' }).toBER())] })
        const attributes = new Set({ value: [attribute(17, inApp.toBER())] })
        const encapsulated = new Sequence({ value: [new ObjectIdentifier({ value: '1.2.840.113549.1.7.1' }),
            new Constructed({ idBlock: { tagClass: 3, tagNumber: 0 }, value: [new OctetString({ valueHex: attributes.toBER() })] })] })
        const signedData = new Sequence({ value: [new Integer({ value: 1 }), new Set(), encapsulated, new Set()] })
        const contentInfo = new Sequence({ value: [new ObjectIdentifier({ value: '1.2.840.113549.1.7.2' }),
            new Constructed({ idBlock: { tagClass: 3, tagNumber: 0 }, value: [signedData] })] })
        const receipt = Buffer.from(contentInfo.toBER()).toString('base64')
        expect(new ReceiptUtility().extractTransactionIdFromAppReceipt(receipt)).toEqual('123456789')
    })
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