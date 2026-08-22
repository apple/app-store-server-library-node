// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import assert = require("assert");
import { AppReceiptVerifier } from "../../app_receipt_verification";
import { VerificationException, VerificationStatus } from "../../jws_verification";
import { Environment } from "../../models/Environment";
import { ReceiptCreator, daysAgo, inOneYear } from "../receipt_creator";
import { readFile } from "../util";

const BUNDLE_ID = "com.example";
const XCODE_FIXTURE_BUNDLE_ID = "com.example.naturelab.backyardbirds.example";
const OTHER_BUNDLE_ID = "com.example.other";
const APP_VERSION = "1.2.3";
const ORIGINAL_APP_VERSION = "1.0";
const OPAQUE_VALUE = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);
const SHA1_HASH = Buffer.from("a1b2c3d4e5f60718293a4b5c6d7e8f9011223344", 'hex');
const UNKNOWN_RECEIPT_ATTRIBUTE_VALUE = Buffer.from([0x0d, 0x0e, 0x0a, 0x0d]);
const UNKNOWN_IN_APP_ATTRIBUTE_VALUE = Buffer.from([0x0b, 0x0e, 0x0e, 0x0f]);

const RECEIPT_CREATION_DATE = "2024-03-01T12:00:00Z";
const RECEIPT_CREATION_DATE_MILLIS = 1709294400000;
const ORIGINAL_PURCHASE_DATE = "2023-11-15T08:30:00Z";
const ORIGINAL_PURCHASE_DATE_MILLIS = 1700037000000;
const EXPIRATION_DATE = "2030-01-01T00:00:00Z";
const EXPIRATION_DATE_MILLIS = 1893456000000;

const CONSUMABLE_PRODUCT_ID = "com.example.coins";
const CONSUMABLE_TRANSACTION_ID = "70000000000001";
const CONSUMABLE_PURCHASE_DATE = "2024-01-15T12:00:00Z";
const CONSUMABLE_PURCHASE_DATE_MILLIS = 1705320000000;
const CONSUMABLE_ORIGINAL_PURCHASE_DATE = "2024-01-10T09:00:00Z";
const CONSUMABLE_ORIGINAL_PURCHASE_DATE_MILLIS = 1704877200000;

const SUBSCRIPTION_PRODUCT_ID = "com.example.subscription";
const SUBSCRIPTION_TRANSACTION_ID = "70000000000002";
const SUBSCRIPTION_PURCHASE_DATE = "2024-02-01T09:30:00Z";
const SUBSCRIPTION_PURCHASE_DATE_MILLIS = 1706779800000;
const SUBSCRIPTION_EXPIRES_DATE = "2030-02-01T09:30:00Z";
const SUBSCRIPTION_EXPIRES_DATE_MILLIS = 1896168600000;
const SUBSCRIPTION_CANCELLATION_DATE = "2024-06-01T00:00:00Z";
const SUBSCRIPTION_CANCELLATION_DATE_MILLIS = 1717200000000;

// Generating six throwaway RSA PKIs and CMS-signing their receipts costs seconds, so every receipt a test
// reads is built once here rather than per test
const SETUP_TIMEOUT = 300_000;

let receiptCreator: ReceiptCreator
let sandboxReceipt: Buffer
let productionReceipt: Buffer
let unknownReceiptTypeReceipt: Buffer
let withoutRootCertificateReceipt: Buffer
let withoutInAppPurchasesReceipt: Buffer
let withoutSignedAttributesReceipt: Buffer

let foreignCreator: ReceiptCreator
let foreignReceipt: Buffer

let withoutReceiptSignerOidCreator: ReceiptCreator
let withoutReceiptSignerOidReceipt: Buffer

let withoutWwdrOidCreator: ReceiptCreator
let withoutWwdrOidReceipt: Buffer

let expiredCreator: ReceiptCreator
let expiredChainReceipt: Buffer
let expiredChainCreationDate: Date

let xcodeCreator: ReceiptCreator
let xcodeReceipt: Buffer
let xcodeProductionReceipt: Buffer

beforeAll(() => {
    receiptCreator = ReceiptCreator.createReceiptCreator()
    sandboxReceipt = receiptCreator.signReceipt(receiptPayload("ProductionSandbox", BUNDLE_ID, RECEIPT_CREATION_DATE))
    productionReceipt = receiptCreator.signReceipt(receiptPayload("Production", BUNDLE_ID, RECEIPT_CREATION_DATE))
    unknownReceiptTypeReceipt = receiptCreator.signReceipt(receiptPayload("ProductionInternal", BUNDLE_ID, RECEIPT_CREATION_DATE))
    withoutRootCertificateReceipt = receiptCreator.signReceipt(receiptPayload("ProductionSandbox", BUNDLE_ID, RECEIPT_CREATION_DATE), 2)
    withoutInAppPurchasesReceipt = receiptCreator.signReceipt(ReceiptCreator.attributeSet()
        .string(0, "ProductionSandbox")
        .string(2, BUNDLE_ID)
        .date(12, RECEIPT_CREATION_DATE)
        .build())
    withoutSignedAttributesReceipt = receiptCreator.signReceiptWithoutSignedAttributes(receiptPayload("ProductionSandbox", BUNDLE_ID, RECEIPT_CREATION_DATE))

    foreignCreator = ReceiptCreator.createReceiptCreator()
    foreignReceipt = foreignCreator.signReceipt(receiptPayload("ProductionSandbox", BUNDLE_ID, RECEIPT_CREATION_DATE))

    withoutReceiptSignerOidCreator = ReceiptCreator.createReceiptCreator(false, true, daysAgo(3650), inOneYear())
    withoutReceiptSignerOidReceipt = withoutReceiptSignerOidCreator.signReceipt(receiptPayload("ProductionSandbox", BUNDLE_ID, RECEIPT_CREATION_DATE))

    withoutWwdrOidCreator = ReceiptCreator.createReceiptCreator(true, false, daysAgo(3650), inOneYear())
    withoutWwdrOidReceipt = withoutWwdrOidCreator.signReceipt(receiptPayload("ProductionSandbox", BUNDLE_ID, RECEIPT_CREATION_DATE))

    expiredCreator = ReceiptCreator.createReceiptCreator(true, true, daysAgo(730), daysAgo(365))
    expiredChainCreationDate = truncateToSeconds(daysAgo(547))
    expiredChainReceipt = expiredCreator.signReceipt(receiptPayload("ProductionSandbox", BUNDLE_ID, expiredChainCreationDate.toISOString()), 3, expiredChainCreationDate)

    xcodeCreator = ReceiptCreator.createSelfSignedReceiptCreator()
    xcodeReceipt = xcodeCreator.signReceipt(ReceiptCreator.doubleWrap(receiptPayload("Xcode", BUNDLE_ID, RECEIPT_CREATION_DATE)))
    xcodeProductionReceipt = xcodeCreator.signReceipt(ReceiptCreator.doubleWrap(receiptPayload("Production", BUNDLE_ID, RECEIPT_CREATION_DATE)))
}, SETUP_TIMEOUT)

describe('App Receipt Verification Checks', () => {
    it('should decode every attribute of a verified receipt', async () => {
        const receipt = await getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false).verifyAndDecodeAppReceipt(encode(sandboxReceipt))

        expect(receipt.receiptType).toBe("ProductionSandbox")
        expect(receipt.bundleId).toBe(BUNDLE_ID)
        // The raw bytes of the attribute are the DER UTF8String, which the device hash is computed over
        expect(receipt.bundleIdBytes).toEqual(Buffer.concat([Buffer.from([0x0c, BUNDLE_ID.length]), Buffer.from(BUNDLE_ID)]))
        expect(receipt.applicationVersion).toBe(APP_VERSION)
        expect(receipt.originalApplicationVersion).toBe(ORIGINAL_APP_VERSION)
        expect(receipt.opaqueValue).toEqual(OPAQUE_VALUE)
        expect(receipt.sha1Hash).toEqual(SHA1_HASH)
        expect(receipt.receiptCreationDate).toBe(RECEIPT_CREATION_DATE_MILLIS)
        expect(receipt.originalPurchaseDate).toBe(ORIGINAL_PURCHASE_DATE_MILLIS)
        expect(receipt.expirationDate).toBe(EXPIRATION_DATE_MILLIS)
        expect(receipt.inAppPurchases.length).toBe(2)

        const consumable = receipt.inAppPurchases[0]
        expect(consumable.quantity).toBe(1)
        expect(consumable.productId).toBe(CONSUMABLE_PRODUCT_ID)
        expect(consumable.transactionId).toBe(CONSUMABLE_TRANSACTION_ID)
        expect(consumable.originalTransactionId).toBe(CONSUMABLE_TRANSACTION_ID)
        expect(consumable.purchaseDate).toBe(CONSUMABLE_PURCHASE_DATE_MILLIS)
        expect(consumable.originalPurchaseDate).toBe(CONSUMABLE_ORIGINAL_PURCHASE_DATE_MILLIS)
        expect(consumable.webOrderLineItemId).toBe(42)

        const subscription = receipt.inAppPurchases[1]
        expect(subscription.quantity).toBe(1)
        expect(subscription.productId).toBe(SUBSCRIPTION_PRODUCT_ID)
        expect(subscription.transactionId).toBe(SUBSCRIPTION_TRANSACTION_ID)
        expect(subscription.originalTransactionId).toBe(SUBSCRIPTION_TRANSACTION_ID)
        expect(subscription.purchaseDate).toBe(SUBSCRIPTION_PURCHASE_DATE_MILLIS)
        expect(subscription.originalPurchaseDate).toBe(SUBSCRIPTION_PURCHASE_DATE_MILLIS)
        expect(subscription.expiresDate).toBe(SUBSCRIPTION_EXPIRES_DATE_MILLIS)
        expect(subscription.cancellationDate).toBe(SUBSCRIPTION_CANCELLATION_DATE_MILLIS)
        expect(subscription.webOrderLineItemId).toBe(12345)
    })

    // An in-app purchase attribute that is present but empty means "absent", and the intro offer flag is an
    // integer that must surface as a boolean, so a caller can distinguish "no expiration" from "expired at epoch"
    it('should decode an empty date attribute as absent and the intro offer flag as a boolean', async () => {
        const receipt = await getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false).verifyAndDecodeAppReceipt(encode(sandboxReceipt))

        const consumable = receipt.inAppPurchases[0]
        expect(consumable.isInIntroOfferPeriod).toBe(false)
        expect(consumable.expiresDate).toBeUndefined()
        expect(consumable.cancellationDate).toBeUndefined()

        expect(receipt.inAppPurchases[1].isInIntroOfferPeriod).toBe(true)
    })

    // Attribute types this library does not model must survive decoding with their raw bytes, so a receipt
    // field Apple adds later stays reachable
    it('should preserve unknown attributes', async () => {
        const receipt = await getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false).verifyAndDecodeAppReceipt(encode(sandboxReceipt))

        expect(receipt.unknownAttributes.get(9999)).toEqual([UNKNOWN_RECEIPT_ATTRIBUTE_VALUE])
        expect(receipt.inAppPurchases[0].unknownAttributes.get(1799)).toEqual([UNKNOWN_IN_APP_ATTRIBUTE_VALUE])
    })

    it('should fail to verify a receipt with the wrong bundle id', async () => {
        const verifier = getReceiptVerifier(receiptCreator, Environment.SANDBOX, OTHER_BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(sandboxReceipt)), VerificationStatus.INVALID_APP_IDENTIFIER)
    })

    it('should fail to verify a receipt from another environment', async () => {
        const verifier = getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(productionReceipt)), VerificationStatus.INVALID_ENVIRONMENT)
    })

    // A receipt type this library does not recognize maps to no environment at all rather than defaulting to
    // the verifier's, so an unexpected value can never be mistaken for a match
    it('should fail to verify a receipt with an unknown receipt type', async () => {
        const verifier = getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(unknownReceiptTypeReceipt)), VerificationStatus.INVALID_ENVIRONMENT)
    })

    it('should fail to verify a receipt with a tampered payload', async () => {
        const tamperedReceipt = Buffer.from(sandboxReceipt)
        // Flip a bit inside the app version of the encapsulated payload; the chain is untouched, so only the
        // signature check can catch this
        const appVersionIndex = tamperedReceipt.indexOf(Buffer.from(APP_VERSION))
        expect(appVersionIndex).toBeGreaterThan(-1)
        tamperedReceipt[appVersionIndex] ^= 0x01
        const verifier = getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(tamperedReceipt)), VerificationStatus.VERIFICATION_FAILURE)
    })

    it('should fail to verify a receipt signed by a foreign root', async () => {
        const verifier = getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(foreignReceipt)), VerificationStatus.VERIFICATION_FAILURE)
    })

    it('should fail to verify a receipt whose leaf lacks the receipt signing OID', async () => {
        const verifier = getReceiptVerifier(withoutReceiptSignerOidCreator, Environment.SANDBOX, BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(withoutReceiptSignerOidReceipt)), VerificationStatus.VERIFICATION_FAILURE)
    })

    it('should fail to verify a receipt whose intermediate lacks the WWDR OID', async () => {
        const verifier = getReceiptVerifier(withoutWwdrOidCreator, Environment.SANDBOX, BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(withoutWwdrOidReceipt)), VerificationStatus.VERIFICATION_FAILURE)
    })

    it('should fail to verify a receipt without the root certificate embedded', async () => {
        const verifier = getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(withoutRootCertificateReceipt)), VerificationStatus.INVALID_CHAIN_LENGTH)
    })

    it('should fail to verify a receipt that is not base64', async () => {
        const verifier = getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt("!!!not-base64!!!"), VerificationStatus.VERIFICATION_FAILURE)
    })

    it('should fail to verify a receipt that is not a PKCS#7 container', async () => {
        const verifier = getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(Buffer.from([1, 2, 3, 4]))), VerificationStatus.VERIFICATION_FAILURE)
    })

    // Bytes appended after the container must not be ignored - a verifier that parsed a prefix would accept a
    // receipt carrying unverified extra data
    it('should fail to verify a receipt with trailing bytes after the container', async () => {
        const paddedReceipt = Buffer.concat([sandboxReceipt, Buffer.alloc(4)])
        const verifier = getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(paddedReceipt)), VerificationStatus.VERIFICATION_FAILURE)
    })

    // Genuine App Store receipts carry no signed attributes and sign the payload directly, unlike the
    // containers jsrsasign's CMS generator produces, so the path every real receipt takes needs its own receipt
    it('should verify a receipt without signed attributes', async () => {
        const receipt = await getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false).verifyAndDecodeAppReceipt(encode(withoutSignedAttributesReceipt))
        expect(receipt.bundleId).toBe(BUNDLE_ID)
        expect(receipt.inAppPurchases.length).toBe(2)
    })

    it('should fail to verify a tampered receipt without signed attributes', async () => {
        const tamperedReceipt = Buffer.from(withoutSignedAttributesReceipt)
        const appVersionIndex = tamperedReceipt.indexOf(Buffer.from(APP_VERSION))
        expect(appVersionIndex).toBeGreaterThan(-1)
        tamperedReceipt[appVersionIndex] ^= 0x01
        const verifier = getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(tamperedReceipt)), VerificationStatus.VERIFICATION_FAILURE)
    })

    // Receipts outlive the certificates that signed them, so with online checks off the chain is evaluated at
    // the receipt's creation date
    it('should verify a receipt signed by now expired certificates', async () => {
        const decoded = await getReceiptVerifier(expiredCreator, Environment.SANDBOX, BUNDLE_ID, false).verifyAndDecodeAppReceipt(encode(expiredChainReceipt))
        expect(decoded.receiptCreationDate).toBe(expiredChainCreationDate.getTime())
    })

    // Enabling online checks moves the evaluation to now, which is the point of the option: the same receipt
    // must then fail on the expired chain
    it('should fail to verify a receipt signed by now expired certificates with online checks enabled', async () => {
        const verifier = getReceiptVerifier(expiredCreator, Environment.SANDBOX, BUNDLE_ID, true)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(expiredChainReceipt)), VerificationStatus.INVALID_CERTIFICATE)
    })

    // Xcode-generated receipts are not signed by the App Store, so they are decoded without any chain or
    // signature check
    it('should decode an Xcode receipt', async () => {
        const decoded = await getReceiptVerifier(xcodeCreator, Environment.XCODE, BUNDLE_ID, false).verifyAndDecodeAppReceipt(encode(xcodeReceipt))
        expect(decoded.receiptType).toBe("Xcode")
        expect(decoded.bundleId).toBe(BUNDLE_ID)
        expect(decoded.applicationVersion).toBe(APP_VERSION)
        expect(decoded.receiptCreationDate).toBe(RECEIPT_CREATION_DATE_MILLIS)
        expect(decoded.inAppPurchases.length).toBe(2)
    })

    // Skipping the signature checks must not skip the app identity check
    it('should fail to verify an Xcode receipt with the wrong bundle id', async () => {
        const verifier = getReceiptVerifier(xcodeCreator, Environment.XCODE, OTHER_BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(xcodeReceipt)), VerificationStatus.INVALID_APP_IDENTIFIER)
    })

    // Skipping the signature checks must not skip the environment check either
    it('should fail to verify an Xcode receipt from another environment', async () => {
        const verifier = getReceiptVerifier(xcodeCreator, Environment.XCODE, BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(xcodeProductionReceipt)), VerificationStatus.INVALID_ENVIRONMENT)
    })

    // The receipts Xcode generates use indefinite length encoding throughout and wrap their payload in an
    // extra OCTET STRING, neither of which a synthetic DER receipt exercises
    it('should decode an Xcode generated receipt', async () => {
        const verifier = new AppReceiptVerifier([], false, Environment.XCODE, XCODE_FIXTURE_BUNDLE_ID)
        const decoded = await verifier.verifyAndDecodeAppReceipt(readFile('tests/resources/xcode/xcode-app-receipt-with-transaction'))

        expect(decoded.receiptType).toBe("Xcode")
        expect(decoded.bundleId).toBe(XCODE_FIXTURE_BUNDLE_ID)
        expect(decoded.applicationVersion).toBe("1")
        expect(decoded.receiptCreationDate).toBe(new Date("2023-10-19T01:45:40Z").getTime())
        expect(decoded.inAppPurchases.length).toBe(1)
        expect(await verifier.verifyAndExtractTransactionId(readFile('tests/resources/xcode/xcode-app-receipt-with-transaction'))).toBe("0")
    })

    it('should decode an Xcode generated receipt without in-app purchases', async () => {
        const verifier = new AppReceiptVerifier([], false, Environment.XCODE, XCODE_FIXTURE_BUNDLE_ID)
        const decoded = await verifier.verifyAndDecodeAppReceipt(readFile('tests/resources/xcode/xcode-app-receipt-empty'))

        expect(decoded.inAppPurchases.length).toBe(0)
        expect(await verifier.verifyAndExtractTransactionId(readFile('tests/resources/xcode/xcode-app-receipt-empty'))).toBeNull()
    })

    // The embedded certificates are attacker-supplied and are ordered into a chain before anything about the
    // receipt has been verified, so a receipt carrying more of them than a chain can hold is rejected
    it('should fail to verify a receipt embedding more certificates than a chain can hold', async () => {
        const padded = receiptCreator.signReceipt(receiptPayload("ProductionSandbox", BUNDLE_ID, RECEIPT_CREATION_DATE), 3, new Date(), "sha256", 30)
        const verifier = getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(padded)), VerificationStatus.INVALID_CHAIN_LENGTH)
    })

    // Attribute types are decoded before the receipt has been verified, so an integer wider than any value a
    // receipt carries is rejected on its width rather than accumulated and then range checked
    it('should fail to verify a receipt declaring an oversized attribute type', async () => {
        const oversized = receiptCreator.signReceipt(ReceiptCreator.payloadWithOversizedAttributeType(100_000))
        const verifier = getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(oversized)), VerificationStatus.VERIFICATION_FAILURE)
    })

    // A correctly signed receipt still fails when the signer names a digest outside the allowlist, so the
    // accepted algorithms never widen to whatever a signer proposes
    it('should fail to verify a receipt signed with a digest Apple does not use', async () => {
        const sha512Receipt = receiptCreator.signReceipt(receiptPayload("ProductionSandbox", BUNDLE_ID, RECEIPT_CREATION_DATE), 3, new Date(), "sha512")
        const verifier = getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(sha512Receipt)), VerificationStatus.VERIFICATION_FAILURE)
    })

    // As with an Xcode receipt, LocalTesting data is not signed by the App Store
    it('should decode a LocalTesting receipt', async () => {
        const receipt = xcodeCreator.signReceipt(receiptPayload("LocalTesting", BUNDLE_ID, RECEIPT_CREATION_DATE))
        const verifier = getReceiptVerifier(xcodeCreator, Environment.LOCAL_TESTING, BUNDLE_ID, false)
        const decoded = await verifier.verifyAndDecodeAppReceipt(encode(receipt))

        expect(decoded.receiptType).toBe("LocalTesting")
        expect(decoded.bundleId).toBe(BUNDLE_ID)
    })

    // Skipping the signature checks must not skip the app identity check
    it('should fail to verify a LocalTesting receipt with the wrong bundle id', async () => {
        const receipt = xcodeCreator.signReceipt(receiptPayload("LocalTesting", BUNDLE_ID, RECEIPT_CREATION_DATE))
        const verifier = getReceiptVerifier(xcodeCreator, Environment.LOCAL_TESTING, "com.example.other", false)
        await expectVerificationFailure(verifier.verifyAndDecodeAppReceipt(encode(receipt)), VerificationStatus.INVALID_APP_IDENTIFIER)
    })

    it('should extract a transaction id from a verified receipt', async () => {
        const transactionId = await getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false).verifyAndExtractTransactionId(encode(sandboxReceipt))
        expect(transactionId).toBe(CONSUMABLE_TRANSACTION_ID)
    })

    // Same output contract as ReceiptUtility: a verified receipt with no in-app purchases yields null
    it('should not extract a transaction id from a receipt without in-app purchases', async () => {
        const transactionId = await getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false).verifyAndExtractTransactionId(encode(withoutInAppPurchasesReceipt))
        expect(transactionId).toBeNull()
    })

    // Unlike ReceiptUtility, extraction refuses a receipt that does not verify
    it('should not extract a transaction id from a receipt signed by a foreign root', async () => {
        const verifier = getReceiptVerifier(receiptCreator, Environment.SANDBOX, BUNDLE_ID, false)
        await expectVerificationFailure(verifier.verifyAndExtractTransactionId(encode(foreignReceipt)), VerificationStatus.VERIFICATION_FAILURE)
    })
})

function getReceiptVerifier(creator: ReceiptCreator, environment: Environment, bundleId: string, enableOnlineChecks: boolean): AppReceiptVerifier {
    return new AppReceiptVerifier([creator.getRootCertificate()], enableOnlineChecks, environment, bundleId)
}

async function expectVerificationFailure(verification: Promise<unknown>, status: VerificationStatus) {
    try {
        await verification
        assert(false)
    } catch (e) {
        expect(e).toBeInstanceOf(VerificationException)
        expect((e as VerificationException).status).toEqual(status)
    }
}

function receiptPayload(receiptType: string, bundleId: string, creationDate: string): Buffer {
    return ReceiptCreator.attributeSet()
        .string(0, receiptType)
        .string(2, bundleId)
        .string(3, APP_VERSION)
        .raw(4, OPAQUE_VALUE)
        .raw(5, SHA1_HASH)
        .date(12, creationDate)
        .date(18, ORIGINAL_PURCHASE_DATE)
        .string(19, ORIGINAL_APP_VERSION)
        .date(21, EXPIRATION_DATE)
        .raw(9999, UNKNOWN_RECEIPT_ATTRIBUTE_VALUE)
        .raw(17, consumablePurchase())
        .raw(17, subscriptionPurchase())
        .build()
}

function consumablePurchase(): Buffer {
    return ReceiptCreator.attributeSet()
        .integer(1701, 1)
        .string(1702, CONSUMABLE_PRODUCT_ID)
        .string(1703, CONSUMABLE_TRANSACTION_ID)
        .date(1704, CONSUMABLE_PURCHASE_DATE)
        .string(1705, CONSUMABLE_TRANSACTION_ID)
        .date(1706, CONSUMABLE_ORIGINAL_PURCHASE_DATE)
        .date(1708, "")
        .integer(1711, 42)
        .date(1712, "")
        .integer(1719, 0)
        .raw(1799, UNKNOWN_IN_APP_ATTRIBUTE_VALUE)
        .build()
}

function subscriptionPurchase(): Buffer {
    return ReceiptCreator.attributeSet()
        .integer(1701, 1)
        .string(1702, SUBSCRIPTION_PRODUCT_ID)
        .string(1703, SUBSCRIPTION_TRANSACTION_ID)
        .date(1704, SUBSCRIPTION_PURCHASE_DATE)
        .string(1705, SUBSCRIPTION_TRANSACTION_ID)
        .date(1706, SUBSCRIPTION_PURCHASE_DATE)
        .date(1708, SUBSCRIPTION_EXPIRES_DATE)
        .integer(1711, 12345)
        .date(1712, SUBSCRIPTION_CANCELLATION_DATE)
        .integer(1719, 1)
        .build()
}

function encode(receipt: Buffer): string {
    return receipt.toString('base64')
}

function truncateToSeconds(date: Date): Date {
    return new Date(Math.floor(date.getTime() / 1000) * 1000)
}
