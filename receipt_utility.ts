// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { ASN1HEX } from 'jsrsasign';

const IN_APP_TYPE_ID = 17;
const TRANSACTION_IDENTIFIER_TYPE_ID = 1703;
const ORIGINAL_TRANSACTION_IDENTIFIER_TYPE_ID = 1705;
const PKCS7_SIGNED_DATA_OID = '2a864886f70d010702';
const ASN1_SEQUENCE = '30';
const ASN1_SET = '31';
const ASN1_OCTET_STRING = '04';
const ASN1_OBJECT_IDENTIFIER = '06';
const ASN1_UTF8_STRING = '0c';
const MAXIMUM_ASN1_DEPTH = 32;
const BASE64_REGEX = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

class InvalidReceiptError extends Error {}

function decodeBase64(value: string): Buffer {
    if (typeof value !== 'string' || !BASE64_REGEX.test(value)) {
        throw new InvalidReceiptError()
    }
    return Buffer.from(value, 'base64')
}

const UTF8_DECODER = new TextDecoder('utf-8', { fatal: true })

function decodeUtf8(bytes: Buffer): string {
    try {
        return UTF8_DECODER.decode(bytes)
    } catch (e) {
        throw new InvalidReceiptError()
    }
}

function checkAsn1Element(h: string, start: number = 0, end: number = h.length, depth: number = 0): number {
    let i = start
    const nextByte = (): number => {
        if (i + 2 > end) {
            throw new InvalidReceiptError()
        }
        const value = parseInt(h.substring(i, i + 2), 16)
        i += 2
        return value
    }
    if (depth > MAXIMUM_ASN1_DEPTH) {
        throw new InvalidReceiptError()
    }
    const tag = nextByte()
    if ((tag & 0x1f) === 0x1f) {
        while (nextByte() & 0x80) {}
    }
    const constructed = (tag & 0x20) !== 0
    let length = nextByte()
    if (length === 0x80) {
        if (!constructed) {
            throw new InvalidReceiptError()
        }
        while (i + 4 <= end && h.substring(i, i + 4) !== '0000') {
            i = checkAsn1Element(h, i, end, depth + 1)
        }
        if (i + 4 > end) {
            throw new InvalidReceiptError()
        }
        return i + 4
    }
    if (length > 0x80) {
        const lengthBytes = length & 0x7f
        if (lengthBytes > 4) {
            throw new InvalidReceiptError()
        }
        length = 0
        for (let k = 0; k < lengthBytes; k++) {
            length = length * 256 + nextByte()
        }
    }
    const valueEnd = i + length * 2
    if (valueEnd > end) {
        throw new InvalidReceiptError()
    }
    if (constructed) {
        while (i < valueEnd) {
            i = checkAsn1Element(h, i, valueEnd, depth + 1)
        }
    }
    return valueEnd
}

export class ReceiptUtility {

    /**
     * Extracts a transaction id from an encoded App Receipt. Throws if the receipt is malformed.
     * *NO validation* is performed on the receipt, and any data returned should only be used to call the App Store Server API.
     * @param appReceipt The unmodified app receipt
     * @returns A transaction id from the array of in-app purchases, or null if the receipt is well-formed but contains no transaction id
     * @throws Error If the receipt is not valid base64, is not a PKCS#7 app receipt, or is otherwise not in the expected format
     */
    extractTransactionIdFromAppReceipt(appReceipt: string): string | null {
        const receipt = decodeBase64(appReceipt).toString('hex')
        // Xcode receipts use indefinite length encoding, not supported by all parsers
        // Indefinite length encoding is only entered, but never left during parsing for receipts
        // We therefore round up indefinite length encoding to be the remaining length
        const prevGetVblenFunction = ASN1HEX.getVblen
        ASN1HEX.getVblen = function(s, idx) {
            const c = ASN1HEX.getL(s, idx)
            const oldResult = prevGetVblenFunction(s, idx)
            // Round up to the remaining length in the string value, measured in bytes (2 hex values per byte).
            if (oldResult === 0 && c === '80') {
                return (s.length - ASN1HEX.getVidx(s, idx)) / 2
            }
            return oldResult
        }
        const prevGetLblen = ASN1HEX.getLblen
        ASN1HEX.getLblen = function(s, idx) {
            const oldResult = prevGetLblen(s, idx)
            // The length for the length byte for 80 00 is 1
            if (oldResult == -1) {
                return 1
            }
            return oldResult
        }
        try {
            if (!receipt.startsWith(ASN1_SEQUENCE)) {
                throw new InvalidReceiptError()
            }
            checkAsn1Element(receipt)
            if (ASN1HEX.getVbyList(receipt, 0, [0], ASN1_OBJECT_IDENTIFIER) !== PKCS7_SIGNED_DATA_OID) {
                throw new InvalidReceiptError()
            }
            let receiptInfo = ASN1HEX.getVbyList(receipt, 0, [1, 0, 2, 1, 0])
            if (receiptInfo !== null && receiptInfo.length > 2 && receiptInfo.startsWith(ASN1_OCTET_STRING)) {
                // We are still in an Octet String, Xcode wraps with an extra Octet, decode it here
                checkAsn1Element(receiptInfo)
                receiptInfo = ASN1HEX.getV(receiptInfo, 0)
            }
            if (receiptInfo === null || !receiptInfo.startsWith(ASN1_SET)) {
                throw new InvalidReceiptError()
            }
            checkAsn1Element(receiptInfo)
            let index = 0;
            while(ASN1HEX.getVbyList(receiptInfo, 0, [index, 0])) {
                const val = ASN1HEX.getVbyList(receiptInfo, 0, [index, 0]) as string
                if (IN_APP_TYPE_ID === parseInt(val, 16)) {
                    const inAppInfo = ASN1HEX.getVbyList(receiptInfo, 0, [index, 2])
                    if (inAppInfo === null || !inAppInfo.startsWith(ASN1_SET)) {
                        throw new InvalidReceiptError()
                    }
                    checkAsn1Element(inAppInfo)
                    let inAppIndex = 0;
                    while(ASN1HEX.getVbyList(inAppInfo, 0, [inAppIndex, 0])) {
                        const val = ASN1HEX.getVbyList(inAppInfo, 0, [inAppIndex, 0]) as string
                        if (TRANSACTION_IDENTIFIER_TYPE_ID === parseInt(val, 16) || ORIGINAL_TRANSACTION_IDENTIFIER_TYPE_ID === parseInt(val, 16)) {
                            const transactionIdUTF8String = ASN1HEX.getVbyList(inAppInfo, 0, [inAppIndex, 2])
                            if (transactionIdUTF8String === null || !transactionIdUTF8String.startsWith(ASN1_UTF8_STRING)) {
                                throw new InvalidReceiptError()
                            }
                            checkAsn1Element(transactionIdUTF8String)
                            const transactionId = ASN1HEX.getV(transactionIdUTF8String, 0)
                            return Buffer.from(transactionId, 'hex').toString()
                        }
                        inAppIndex = inAppIndex + 1
                    }
                }
                index = index + 1
            }
            return null
        } catch (e) {
            if (e instanceof InvalidReceiptError) {
                throw e
            }
            throw new InvalidReceiptError()
        } finally {
            ASN1HEX.getLblen = prevGetLblen
            ASN1HEX.getVblen = prevGetVblenFunction
        }
    }

    /**
     * Extracts a transaction id from an encoded transactional receipt. Throws if the receipt is malformed.
     * *NO validation* is performed on the receipt, and any data returned should only be used to call the App Store Server API.
     * @param transactionReceipt The unmodified transactionReceipt
     * @return A transaction id, or null if the receipt is well-formed but contains no transaction id
     * @throws Error If the receipt or its "purchase-info" is not valid base64 or not valid UTF-8, the receipt contains no "purchase-info", or it is otherwise not in the expected format
     */
    extractTransactionIdFromTransactionReceipt(transactionReceipt: string): string | null {
        const topLevel = decodeUtf8(decodeBase64(transactionReceipt))
        const topLevelRegex = /"purchase-info"\s+=\s+"([a-zA-Z0-9+/=]+)";/
        const topLevelMatchResult = topLevel.match(topLevelRegex)
        if (!topLevelMatchResult) {
            throw new InvalidReceiptError()
        }

        const purchaseInfo = decodeUtf8(decodeBase64(topLevelMatchResult[1]))
        const purchaseInfoRegex = /"transaction-id"\s+=\s+"([a-zA-Z0-9+/=]+)";/
        const purchaseInfoMatchResult = purchaseInfo.match(purchaseInfoRegex)
        if (!purchaseInfoMatchResult) {
            return null
        }
        return purchaseInfoMatchResult[1]
    }
}
