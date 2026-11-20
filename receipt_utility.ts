// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { getVerifierModule } from './jws_verifier_loader';

export class ReceiptUtility {

    /**
     * Extracts a transaction id from an encoded App Receipt. Throws if the receipt is malformed.
     * *NO validation* is performed on the receipt, and any data returned should only be used to call the App Store Server API.
     * @param appReceipt The unmodified app receipt
     * @returns A transaction id from the array of in-app purchases, or null if the receipt is well-formed but contains no transaction id
     * @throws Error If the receipt is not valid base64, is not a PKCS#7 app receipt, or is otherwise not in the expected format
     */
    extractTransactionIdFromAppReceipt(appReceipt: string): string | null {
        return getVerifierModule().extractTransactionIdFromAppReceipt(appReceipt)
    }

    /**
     * Extracts a transaction id from an encoded transactional receipt. Throws if the receipt is malformed.
     * *NO validation* is performed on the receipt, and any data returned should only be used to call the App Store Server API.
     * @param transactionReceipt The unmodified transactionReceipt
     * @return A transaction id, or null if the receipt is well-formed but contains no transaction id
     * @throws Error If the receipt or its "purchase-info" is not valid base64 or not valid UTF-8, the receipt contains no "purchase-info", or it is otherwise not in the expected format
     */
    extractTransactionIdFromTransactionReceipt(transactionReceipt: string): string | null {
        return getVerifierModule().extractTransactionIdFromTransactionReceipt(transactionReceipt)
    }
}
