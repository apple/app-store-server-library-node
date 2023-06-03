// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { ASN1HEX } from 'jsrsasign';

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
        const receiptInfo = ASN1HEX.getVbyList(Buffer.from(appReceipt, 'base64').toString('hex'), 0, [1, 0, 2, 1, 0]) as string
        let index = 0;
        while(ASN1HEX.getVbyList(receiptInfo, 0, [index, 0])) {
            const val = ASN1HEX.getVbyList(receiptInfo, 0, [index, 0]) as string
            if (IN_APP_TYPE_ID === parseInt(val, 16)) {
                const inAppInfo = ASN1HEX.getVbyList(receiptInfo, 0, [index, 2]) as string
                let inAppIndex = 0;
                while(ASN1HEX.getVbyList(inAppInfo, 0, [inAppIndex, 0])) {
                    const val = ASN1HEX.getVbyList(inAppInfo, 0, [inAppIndex, 0]) as string
                    if (TRANSACTION_IDENTIFIER_TYPE_ID === parseInt(val, 16) || ORIGINAL_TRANSACTION_IDENTIFIER_TYPE_ID === parseInt(val, 16)) {
                        const transactionIdUTF8String = ASN1HEX.getVbyList(inAppInfo, 0, [inAppIndex, 2]) as string
                        const transactionId = ASN1HEX.getVbyList(transactionIdUTF8String, 0, []) as string
                        return Buffer.from(transactionId, 'hex').toString()
                    }
                    inAppIndex = inAppIndex + 1
                }
            }
            index = index + 1
        }
        return null
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
