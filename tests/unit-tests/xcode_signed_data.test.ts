// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import assert = require("assert");
import { VerificationException, VerificationStatus } from "../../jws_verification";
import { AutoRenewStatus } from "../../models/AutoRenewStatus";
import { Environment } from "../../models/Environment";
import { InAppOwnershipType } from "../../models/InAppOwnershipType";
import { OfferType } from "../../models/OfferType";
import { TransactionReason } from "../../models/TransactionReason";
import { Type } from "../../models/Type";
import { getSignedPayloadVerifierWithDefaultAppAppleId, readFile } from "../util";

const XCODE_BUNDLE_ID = "com.example.naturelab.backyardbirds.example"

describe('Xcode signed data verification', () => {
    it('should decode an Xcode signed app transaction', async () => {
        const verifier = getSignedPayloadVerifierWithDefaultAppAppleId(Environment.XCODE, XCODE_BUNDLE_ID)
        const encodedAppTransaction = readFile('tests/resources/xcode/xcode-signed-app-transaction')

        const appTransaction = await verifier.verifyAndDecodeAppTransaction(encodedAppTransaction)

        expect(appTransaction).toBeTruthy()
        expect(appTransaction.appAppleId).toBeUndefined()
        expect(XCODE_BUNDLE_ID).toBe(appTransaction.bundleId)
        expect("1").toBe(appTransaction.applicationVersion)
        expect(appTransaction.versionExternalIdentifier).toBeUndefined()
        expect(-62135769600000).toBe(appTransaction.originalPurchaseDate)
        expect("1").toBe(appTransaction.originalApplicationVersion)
        expect("cYUsXc53EbYc0pOeXG5d6/31LGHeVGf84sqSN0OrJi5u/j2H89WWKgS8N0hMsMlf").toBe(appTransaction.deviceVerification)
        expect("48c8b92d-ce0d-4229-bedf-e61b4f9cfc92").toBe(appTransaction.deviceVerificationNonce)
        expect(appTransaction.preorderDate).toBeUndefined()
        expect(Environment.XCODE).toBe(appTransaction.receiptType)
    })

    it('should decode an Xcode signed transaction', async () => {
        const verifier = getSignedPayloadVerifierWithDefaultAppAppleId(Environment.XCODE, XCODE_BUNDLE_ID)
        const encodedTransaction = readFile('tests/resources/xcode/xcode-signed-transaction')

        const transaction = await verifier.verifyAndDecodeTransaction(encodedTransaction)

        expect("0").toBe(transaction.originalTransactionId)
        expect("0").toBe(transaction.transactionId)
        expect("0").toBe(transaction.webOrderLineItemId)
        expect(XCODE_BUNDLE_ID).toBe(transaction.bundleId)
        expect("pass.premium").toBe(transaction.productId)
        expect("6F3A93AB").toBe(transaction.subscriptionGroupIdentifier)
        expect(1697679936049.7297).toBe(transaction.purchaseDate)
        expect(1697679936049.7297).toBe(transaction.originalPurchaseDate)
        expect(1700358336049.7297).toBe(transaction.expiresDate)
        expect(1).toBe(transaction.quantity)
        expect(Type.AUTO_RENEWABLE_SUBSCRIPTION).toBe(transaction.type)
        expect(transaction.appAccountToken).toBeUndefined()
        expect(InAppOwnershipType.PURCHASED).toBe(transaction.inAppOwnershipType)
        expect(1697679936056.485).toBe(transaction.signedDate)
        expect(transaction.revocationReason).toBeUndefined()
        expect(transaction.revocationDate).toBeUndefined()
        expect(transaction.isUpgraded).toBe(false)
        expect(OfferType.INTRODUCTORY_OFFER).toBe(transaction.offerType)
        expect(transaction.offerIdentifier).toBeUndefined()
        expect(Environment.XCODE).toBe(transaction.environment)
        expect("USA").toBe(transaction.storefront)
        expect("143441").toBe(transaction.storefrontId)
        expect(TransactionReason.PURCHASE).toBe(transaction.transactionReason)
    })

    it('should decode an Xcode signed renewal info', async () => {
        const verifier = getSignedPayloadVerifierWithDefaultAppAppleId(Environment.XCODE, XCODE_BUNDLE_ID)
        const encodedRenewalInfo = readFile('tests/resources/xcode/xcode-signed-renewal-info')

        const renewalInfo = await verifier.verifyAndDecodeRenewalInfo(encodedRenewalInfo)

        expect(renewalInfo.expirationIntent).toBeUndefined()
        expect("0").toBe(renewalInfo.originalTransactionId)
        expect("pass.premium").toBe(renewalInfo.autoRenewProductId)
        expect("pass.premium").toBe(renewalInfo.productId)
        expect(AutoRenewStatus.ON).toBe(renewalInfo.autoRenewStatus)
        expect(renewalInfo.isInBillingRetryPeriod).toBeUndefined()
        expect(renewalInfo.priceIncreaseStatus).toBeUndefined()
        expect(renewalInfo.gracePeriodExpiresDate).toBeUndefined()
        expect(renewalInfo.offerType).toBeUndefined()
        expect(renewalInfo.offerIdentifier).toBeUndefined()
        expect(1697679936711.0747).toBe(renewalInfo.signedDate)
        expect(Environment.XCODE).toBe(renewalInfo.environment)
        expect(1697679936049.7297).toBe(renewalInfo.recentSubscriptionStartDate)
        expect(1700358336049.7297).toBe(renewalInfo.renewalDate)
    })

    it('should fail to verify an Xcode signed app transaction in the production environment', async () => {
        const verifier = getSignedPayloadVerifierWithDefaultAppAppleId(Environment.PRODUCTION, XCODE_BUNDLE_ID)
        const encodedAppTransaction = readFile('tests/resources/xcode/xcode-signed-app-transaction')
        try {
            await verifier.verifyAndDecodeAppTransaction(encodedAppTransaction)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.INVALID_CHAIN_LENGTH)
        }
    })
})
