// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import type { AsnType, OctetString } from 'asn1js';

const IN_APP_TYPE_ID = 17;
const TRANSACTION_IDENTIFIER_TYPE_ID = 1703;
const ORIGINAL_TRANSACTION_IDENTIFIER_TYPE_ID = 1705;

export class ReceiptUtility {
    
    /**
     * Extracts a transaction id from an encoded App Receipt. Throws if the receipt does not match the expected format.
     * *NO validation* is performed on the receipt, and any data returned should only be used to call the App Store Server API.
     * @param appReceipt The unmodified app receipt
     * @returns A transaction id from the array of in-app purchases, null if the receipt contains no in-app purchases
     */
    extractTransactionIdFromAppReceipt(appReceipt: string): string | null {
        // Keep the synchronous receipt API while deferring parser initialization.
        const { Integer, OctetString, Set, Utf8String } = require('asn1js') as typeof import('asn1js')
        const { asn1Children, parseASN1 } = require('./asn1_utils') as typeof import('./asn1_utils')
        // CMS receipts, including Xcode's indefinite-length BER encoding.
        let contents = parseASN1(Buffer.from(appReceipt, 'base64'), false)
        for (const index of [1, 0, 2, 1, 0]) {
            contents = asn1Children(contents)[index]
            if (contents === undefined) {
                throw new Error('Invalid receipt structure')
            }
        }
        if (!(contents instanceof OctetString)) {
            throw new Error('Expected receipt OCTET STRING')
        }
        let receipt = parseASN1(new Uint8Array(contents.getValue()), false)
        if (receipt instanceof OctetString) {
            // Xcode wraps the receipt in an extra OCTET STRING.
            receipt = parseASN1(new Uint8Array(receipt.getValue()), false)
        }
        if (!(receipt instanceof Set)) {
            throw new Error('Expected receipt SET')
        }
        for (const attribute of asn1Children(receipt)) {
            const fields = this.receiptAttribute(attribute)
            if (fields.type !== IN_APP_TYPE_ID) {
                continue
            }
            const inApp = parseASN1(new Uint8Array(fields.value.getValue()), false)
            if (!(inApp instanceof Set)) {
                throw new Error('Expected in-app receipt SET')
            }
            for (const inAppAttribute of asn1Children(inApp)) {
                const inAppFields = this.receiptAttribute(inAppAttribute)
                if (inAppFields.type === TRANSACTION_IDENTIFIER_TYPE_ID || inAppFields.type === ORIGINAL_TRANSACTION_IDENTIFIER_TYPE_ID) {
                    const transactionId = parseASN1(new Uint8Array(inAppFields.value.getValue()), false)
                    if (!(transactionId instanceof Utf8String)) {
                        throw new Error('Expected transaction identifier UTF8String')
                    }
                    return transactionId.valueBlock.value
                }
            }
        }
        return null
    }

    private receiptAttribute(attribute: AsnType): { type: number, value: OctetString } {
        const { Integer, OctetString, Sequence } = require('asn1js') as typeof import('asn1js')
        const { asn1Children } = require('./asn1_utils') as typeof import('./asn1_utils')
        if (!(attribute instanceof Sequence)) {
            throw new Error('Expected receipt attribute SEQUENCE')
        }
        const fields = asn1Children(attribute)
        if (fields.length !== 3 || !(fields[0] instanceof Integer) || !(fields[1] instanceof Integer) || !(fields[2] instanceof OctetString)) {
            throw new Error('Invalid receipt attribute')
        }
        return { type: fields[0].valueBlock.valueDec, value: fields[2] }
    }

    /**
     * Extracts a transaction id from an encoded transactional receipt. Throws if the receipt does not match the expected format.
     * *NO validation* is performed on the receipt, and any data returned should only be used to call the App Store Server API.
     * @param transactionReceipt The unmodified transactionReceipt
     * @return A transaction id, or null if no transactionId is found in the receipt
     */
    extractTransactionIdFromTransactionReceipt(transactionReceipt: string): string | null {
        const topLevel = Buffer.from(transactionReceipt, 'base64').toString()
        const topLevelRegex = /"purchase-info"\s+=\s+"([a-zA-Z0-9+/=]+)";/
        const topLevelMatchResult = topLevel.match(topLevelRegex)        
        if (!topLevelMatchResult || topLevelMatchResult?.length !== 2) {
            return null
        }
        
        const purchaseInfo = Buffer.from(topLevelMatchResult[1], 'base64').toString()
        const purchaseInfoRegex = /"transaction-id"\s+=\s+"([a-zA-Z0-9+/=]+)";/
        const purchaseInfoMatchResult = purchaseInfo.match(purchaseInfoRegex)
        if (!purchaseInfoMatchResult || purchaseInfoMatchResult?.length !== 2) {
            return null
        }
        return purchaseInfoMatchResult[1]
    }
}
