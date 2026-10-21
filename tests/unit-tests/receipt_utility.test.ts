// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { ReceiptUtility } from "../../receipt_utility"
import { readFile } from "../util"


describe('Receipt Utility Tests', () => {
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

    const appReceipt = readFile('tests/resources/xcode/xcode-app-receipt-with-transaction')
    const appReceiptBytes = Buffer.from(appReceipt, 'base64')
    const toBase64 = (value: string) => Buffer.from(value).toString('base64')

    it.each([
        ['not base64', '!!!!'],
        ['base64 with an invalid length', 'abc'],
        ['base64 without padding', 'aGVsbG8'],
        ['base64 with line breaks', appReceipt.substring(0, 76) + '\n' + appReceipt.substring(76)],
        ['an empty string', ''],
        ['base64 that is not ASN.1', toBase64('hello world')],
        ['an ASN.1 sequence that is not PKCS#7', Buffer.from('3003020101', 'hex').toString('base64')],
        ['PKCS#7 data that is not signed data', Buffer.from('300b06092a864886f70d010701', 'hex').toString('base64')],
        ['a truncated receipt', appReceiptBytes.subarray(0, 300).toString('base64')],
        ['a receipt truncated in the signature', appReceiptBytes.subarray(0, appReceiptBytes.length - 10).toString('base64')],
        ['a transaction receipt', readFile('tests/resources/mock_signed_data/legacyTransaction')],
    ])('should throw when extracting a transaction id from an app receipt that is %s', (_, receipt) => {
        const receipt_utility = new ReceiptUtility()
        expect(() => receipt_utility.extractTransactionIdFromAppReceipt(receipt)).toThrow(Error)
    })

    const receiptWithPurchaseInfoBytes = (purchaseInfo: Buffer) => toBase64('{\n\t"signature" = "AAAA";\n\t"purchase-info" = "' + purchaseInfo.toString('base64') + '";\n}')
    const invalidUtf8Receipt = Buffer.concat([
        Buffer.from('{\n\t"signature" = "'),
        Buffer.from([0xff]),
        Buffer.from('";\n\t"purchase-info" = "' + toBase64('{\n\t"transaction-id" = "123";\n}') + '";\n}'),
    ]).toString('base64')

    it('should return null for a transaction receipt that contains no transaction id', async () => {
        const purchaseInfo = toBase64('{\n\t"original-transaction-id" = "33993399";\n\t"product-id" = "com.example.product";\n}')
        const receipt = toBase64('{\n\t"signature" = "AAAA";\n\t"purchase-info" = "' + purchaseInfo + '";\n}')
        const receipt_utility = new ReceiptUtility()
        expect(receipt_utility.extractTransactionIdFromTransactionReceipt(receipt)).toBeNull()
    })

    it.each([
        ['not base64', '!!!!'],
        ['base64 without padding', 'aGVsbG8'],
        ['an empty string', ''],
        ['base64 without purchase-info', toBase64('{\n\t"signature" = "AAAA";\n}')],
        ['base64 whose purchase-info is not base64', toBase64('{\n\t"purchase-info" = "abc";\n}')],
        ['an app receipt', appReceipt],
        ['not valid UTF-8 but contains a valid purchase-info', invalidUtf8Receipt],
        ['base64 whose purchase-info is not valid UTF-8', receiptWithPurchaseInfoBytes(Buffer.from([0xff, 0xfe, 0xfd]))],
        ['base64 whose purchase-info has a truncated UTF-8 sequence', receiptWithPurchaseInfoBytes(Buffer.concat([Buffer.from('{\n\t"transaction-id" = "123";\n\t"product-id" = "caf'), Buffer.from([0xc3]), Buffer.from('";\n}')]))],
    ])('should throw when extracting a transaction id from a transaction receipt that is %s', (_, receipt) => {
        const receipt_utility = new ReceiptUtility()
        expect(() => receipt_utility.extractTransactionIdFromTransactionReceipt(receipt)).toThrow(Error)
    })

    it('should report bytes that are not valid UTF-8 in a transaction receipt as malformed', async () => {
        const receipt_utility = new ReceiptUtility()
        expect(() => receipt_utility.extractTransactionIdFromTransactionReceipt(invalidUtf8Receipt)).toThrow(Error)
        expect(() => receipt_utility.extractTransactionIdFromTransactionReceipt(receiptWithPurchaseInfoBytes(Buffer.from([0xff, 0xfe, 0xfd])))).toThrow(Error)
    })

    it('should extract a transaction id from a transaction receipt with non-ASCII UTF-8 text', async () => {
        const purchaseInfo = toBase64('{\n\t"transaction-id" = "123";\n\t"product-id" = "café ☕";\n}')
        const receipt = toBase64('{\n\t"signature" = "AAAA";\n\t"environment" = "Bärenstark";\n\t"purchase-info" = "' + purchaseInfo + '";\n}')
        const receipt_utility = new ReceiptUtility()
        expect(receipt_utility.extractTransactionIdFromTransactionReceipt(receipt)).toBe("123")
    })

    it('should reject an app receipt whose indefinite-length element ends outside its parent', async () => {
        const tlv = (tag: string, value: string): string => {
            const length = value.length / 2
            if (length < 0x80) {
                return tag + length.toString(16).padStart(2, '0') + value
            }
            const lengthHex = length.toString(16).padStart(Math.ceil(length.toString(16).length / 2) * 2, '0')
            return tag + (0x80 + lengthHex.length / 2).toString(16) + lengthHex + value
        }
        const transactionId = tlv('0c', Buffer.from('2000000000000001').toString('hex'))
        const inAppPurchase = tlv('31', tlv('30', tlv('02', '06a7') + tlv('02', '01') + tlv('04', transactionId)))
        const payload = tlv('31', tlv('30', tlv('02', '11') + tlv('02', '01') + tlv('04', inAppPurchase)))
        const encapsulatedContent = tlv('30', tlv('06', '2a864886f70d010701') + tlv('a0', tlv('04', payload)))
        const signedData = tlv('a0', tlv('30', tlv('02', '01') + tlv('31', '') + encapsulatedContent))
        const receipt = (extra: string) => Buffer.from(tlv('30', tlv('06', '2a864886f70d010702') + signedData + extra), 'hex').toString('base64')
        const receipt_utility = new ReceiptUtility()

        expect(receipt_utility.extractTransactionIdFromAppReceipt(receipt(''))).toBe('2000000000000001')
        expect(() => receipt_utility.extractTransactionIdFromAppReceipt(receipt('31023080' + '0000'))).toThrow(Error)
    })
})
