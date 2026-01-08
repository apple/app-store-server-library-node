// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { AutoRenewStatus } from "../../models/AutoRenewStatus";
import { Environment } from "../../models/Environment";
import { ExpirationIntent } from "../../models/ExpirationIntent";
import { NotificationTypeV2 } from "../../models/NotificationTypeV2";
import { OfferType } from "../../models/OfferType";
import { PriceIncreaseStatus } from "../../models/PriceIncreaseStatus";
import { PurchasePlatform } from "../../models/PurchasePlatform";
import { Status } from "../../models/Status";
import { Subtype } from "../../models/Subtype";
import { createSignedDataFromJson, getDefaultSignedPayloadVerifier } from "../util"
import { InAppOwnershipType } from "../../models/InAppOwnershipType";
import { RevocationReason } from "../../models/RevocationReason";
import { RevocationType } from "../../models/RevocationType";
import { TransactionReason } from "../../models/TransactionReason";
import { Type } from "../../models/Type";
import { ConsumptionRequestReason } from "../../models/ConsumptionRequestReason";
import { OfferDiscountType } from "../../models/OfferDiscountType";
import { JWSTransactionDecodedPayloadValidator } from "../../models/JWSTransactionDecodedPayload";


describe('Testing decoding of signed data', () => {
    it('should decode an app transaction', async () => {
        const signedAppTransaction = createSignedDataFromJson("tests/resources/models/appTransaction.json")

        const appTransaction = await getDefaultSignedPayloadVerifier().verifyAndDecodeAppTransaction(signedAppTransaction)

        expect(Environment.LOCAL_TESTING).toBe(appTransaction.receiptType)
        expect(531412).toBe(appTransaction.appAppleId)
        expect("com.example").toBe(appTransaction.bundleId)
        expect("1.2.3").toBe(appTransaction.applicationVersion)
        expect(512).toBe(appTransaction.versionExternalIdentifier)
        expect(1698148900000).toBe(appTransaction.receiptCreationDate)
        expect(1698148800000).toBe(appTransaction.originalPurchaseDate)
        expect("1.1.2").toBe(appTransaction.originalApplicationVersion)
        expect("device_verification_value").toBe(appTransaction.deviceVerification)
        expect("48ccfa42-7431-4f22-9908-7e88983e105a").toBe(appTransaction.deviceVerificationNonce)
        expect(1698148700000).toBe(appTransaction.preorderDate)
        expect("71134").toBe(appTransaction.appTransactionId)
        expect(PurchasePlatform.IOS).toBe(appTransaction.originalPlatform)
    })
    it('should decode a renewal info', async () => {
        const signedRenewalInfo = createSignedDataFromJson("tests/resources/models/signedRenewalInfo.json")

        const renewalInfo = await getDefaultSignedPayloadVerifier().verifyAndDecodeRenewalInfo(signedRenewalInfo)

        expect(ExpirationIntent.CUSTOMER_CANCELLED).toBe(renewalInfo.expirationIntent)
        expect("12345").toBe(renewalInfo.originalTransactionId)
        expect("com.example.product.2").toBe(renewalInfo.autoRenewProductId)
        expect("com.example.product").toBe(renewalInfo.productId)
        expect(AutoRenewStatus.ON).toBe(renewalInfo.autoRenewStatus)
        expect(renewalInfo.isInBillingRetryPeriod).toBe(true)
        expect(PriceIncreaseStatus.CUSTOMER_HAS_NOT_RESPONDED).toBe(renewalInfo.priceIncreaseStatus)
        expect(1698148900000).toBe(renewalInfo.gracePeriodExpiresDate)
        expect(OfferType.PROMOTIONAL_OFFER).toBe(renewalInfo.offerType)
        expect("abc.123").toBe(renewalInfo.offerIdentifier)
        expect(1698148800000).toBe(renewalInfo.signedDate)
        expect(Environment.LOCAL_TESTING).toBe(renewalInfo.environment)
        expect(1698148800000).toBe(renewalInfo.recentSubscriptionStartDate)
        expect(1698148850000).toBe(renewalInfo.renewalDate)
        expect(9990).toBe(renewalInfo.renewalPrice)
        expect("USD").toBe(renewalInfo.currency)
        expect(OfferDiscountType.PAY_AS_YOU_GO).toBe(renewalInfo.offerDiscountType)
        expect(["eligible1", "eligible2"]).toStrictEqual(renewalInfo.eligibleWinBackOfferIds)
        expect("71134").toBe(renewalInfo.appTransactionId)
        expect("P1Y").toBe(renewalInfo.offerPeriod)
        expect("7e3fb20b-4cdb-47cc-936d-99d65f608138").toBe(renewalInfo.appAccountToken)
    })
    it('should decode a transaction info', async () => {
        const signedTransaction = createSignedDataFromJson("tests/resources/models/signedTransaction.json")

        const transaction = await getDefaultSignedPayloadVerifier().verifyAndDecodeTransaction(signedTransaction)

        expect("12345").toBe(transaction.originalTransactionId)
        expect("23456").toBe(transaction.transactionId)
        expect("34343").toBe(transaction.webOrderLineItemId)
        expect("com.example").toBe(transaction.bundleId)
        expect("com.example.product").toBe(transaction.productId)
        expect("55555").toBe(transaction.subscriptionGroupIdentifier)
        expect(1698148800000).toBe(transaction.originalPurchaseDate)
        expect(1698148900000).toBe(transaction.purchaseDate)
        expect(1698148950000).toBe(transaction.revocationDate)
        expect(1698149000000).toBe(transaction.expiresDate)
        expect(1).toBe(transaction.quantity)
        expect(Type.AUTO_RENEWABLE_SUBSCRIPTION).toBe(transaction.type)
        expect("7e3fb20b-4cdb-47cc-936d-99d65f608138").toBe(transaction.appAccountToken)
        expect(InAppOwnershipType.PURCHASED).toBe(transaction.inAppOwnershipType)
        expect(1698148900000).toBe(transaction.signedDate)
        expect(RevocationReason.REFUNDED_DUE_TO_ISSUE).toBe(transaction.revocationReason)
        expect("abc.123").toBe(transaction.offerIdentifier)
        expect(transaction.isUpgraded).toBe(true)
        expect(OfferType.INTRODUCTORY_OFFER).toBe(transaction.offerType)
        expect("USA").toBe(transaction.storefront)
        expect("143441").toBe(transaction.storefrontId)
        expect(TransactionReason.PURCHASE).toBe(transaction.transactionReason)
        expect(Environment.LOCAL_TESTING).toBe(transaction.environment)
        expect(10990).toBe(transaction.price)
        expect("USD").toBe(transaction.currency)
        expect(OfferDiscountType.PAY_AS_YOU_GO).toBe(transaction.offerDiscountType)
        expect("71134").toBe(transaction.appTransactionId)
        expect("P1Y").toBe(transaction.offerPeriod)
    })
    it('should decode a transaction with revocation', async () => {
        const signedTransaction = createSignedDataFromJson("tests/resources/models/signedTransactionWithRevocation.json")

        const transaction = await getDefaultSignedPayloadVerifier().verifyAndDecodeTransaction(signedTransaction)

        expect("12345").toBe(transaction.originalTransactionId)
        expect("23456").toBe(transaction.transactionId)
        expect("34343").toBe(transaction.webOrderLineItemId)
        expect("com.example").toBe(transaction.bundleId)
        expect("com.example.product").toBe(transaction.productId)
        expect("55555").toBe(transaction.subscriptionGroupIdentifier)
        expect(1698148800000).toBe(transaction.originalPurchaseDate)
        expect(1698148900000).toBe(transaction.purchaseDate)
        expect(1698148950000).toBe(transaction.revocationDate)
        expect(1698149000000).toBe(transaction.expiresDate)
        expect(1).toBe(transaction.quantity)
        expect(Type.AUTO_RENEWABLE_SUBSCRIPTION).toBe(transaction.type)
        expect("7e3fb20b-4cdb-47cc-936d-99d65f608138").toBe(transaction.appAccountToken)
        expect(InAppOwnershipType.PURCHASED).toBe(transaction.inAppOwnershipType)
        expect(1698148900000).toBe(transaction.signedDate)
        expect(RevocationReason.REFUNDED_DUE_TO_ISSUE).toBe(transaction.revocationReason)
        expect("abc.123").toBe(transaction.offerIdentifier)
        expect(transaction.isUpgraded).toBe(true)
        expect(OfferType.INTRODUCTORY_OFFER).toBe(transaction.offerType)
        expect("USA").toBe(transaction.storefront)
        expect("143441").toBe(transaction.storefrontId)
        expect(TransactionReason.PURCHASE).toBe(transaction.transactionReason)
        expect(Environment.LOCAL_TESTING).toBe(transaction.environment)
        expect(10990).toBe(transaction.price)
        expect("USD").toBe(transaction.currency)
        expect(OfferDiscountType.PAY_AS_YOU_GO).toBe(transaction.offerDiscountType)
        expect("71134").toBe(transaction.appTransactionId)
        expect("P1Y").toBe(transaction.offerPeriod)
        expect(RevocationType.REFUND_PRORATED).toBe(transaction.revocationType)
        expect(50000).toBe(transaction.revocationPercentage)
    })
    it('should decode a signed notification', async () => {
        const signedNotification = createSignedDataFromJson("tests/resources/models/signedNotification.json")

        const notification = await getDefaultSignedPayloadVerifier().verifyAndDecodeNotification(signedNotification)

        expect(NotificationTypeV2.SUBSCRIBED).toBe(notification.notificationType)
        expect(Subtype.INITIAL_BUY).toBe(notification.subtype)
        expect("002e14d5-51f5-4503-b5a8-c3a1af68eb20").toBe(notification.notificationUUID)
        expect("2.0").toBe(notification.version)
        expect(1698148900000).toBe(notification.signedDate)
        expect(notification.data).toBeTruthy()
        expect(notification.summary).toBeFalsy()
        expect(notification.externalPurchaseToken).toBeFalsy()
        expect(Environment.LOCAL_TESTING).toBe(notification.data!.environment)
        expect(41234).toBe(notification.data!.appAppleId)
        expect("com.example").toBe(notification.data!.bundleId)
        expect("1.2.3").toBe(notification.data!.bundleVersion)
        expect("signed_transaction_info_value").toBe(notification.data!.signedTransactionInfo)
        expect("signed_renewal_info_value").toBe(notification.data!.signedRenewalInfo)
        expect(Status.ACTIVE).toBe(notification.data!.status)
        expect(notification.data!.consumptionRequestReason).toBeFalsy()
    })
    it('should decode a signed CONSUMPTION_REQUEST notification', async () => {
        const signedNotification = createSignedDataFromJson("tests/resources/models/signedConsumptionRequestNotification.json")

        const notification = await getDefaultSignedPayloadVerifier().verifyAndDecodeNotification(signedNotification)

        expect(NotificationTypeV2.CONSUMPTION_REQUEST).toBe(notification.notificationType)
        expect(notification.subtype).toBeFalsy()
        expect("002e14d5-51f5-4503-b5a8-c3a1af68eb20").toBe(notification.notificationUUID)
        expect("2.0").toBe(notification.version)
        expect(1698148900000).toBe(notification.signedDate)
        expect(notification.data).toBeTruthy()
        expect(notification.summary).toBeFalsy()
        expect(notification.externalPurchaseToken).toBeFalsy()
        expect(Environment.LOCAL_TESTING).toBe(notification.data!.environment)
        expect(41234).toBe(notification.data!.appAppleId)
        expect("com.example").toBe(notification.data!.bundleId)
        expect("1.2.3").toBe(notification.data!.bundleVersion)
        expect("signed_transaction_info_value").toBe(notification.data!.signedTransactionInfo)
        expect("signed_renewal_info_value").toBe(notification.data!.signedRenewalInfo)
        expect(Status.ACTIVE).toBe(notification.data!.status)
        expect(ConsumptionRequestReason.UNINTENDED_PURCHASE).toBe(notification.data!.consumptionRequestReason)
    })
    it('should decode a signed summary notification', async () => {
        const signedNotification = createSignedDataFromJson("tests/resources/models/signedSummaryNotification.json")

        const notification = await getDefaultSignedPayloadVerifier().verifyAndDecodeNotification(signedNotification)

        expect(NotificationTypeV2.RENEWAL_EXTENSION).toBe(notification.notificationType)
        expect(Subtype.SUMMARY).toBe(notification.subtype)
        expect("002e14d5-51f5-4503-b5a8-c3a1af68eb20").toBe(notification.notificationUUID)
        expect("2.0").toBe(notification.version)
        expect(1698148900000).toBe(notification.signedDate)
        expect(notification.data).toBeFalsy();
        expect(notification.summary).toBeTruthy();
        expect(notification.externalPurchaseToken).toBeFalsy()
        expect(Environment.LOCAL_TESTING).toBe(notification.summary!.environment)
        expect(41234).toBe(notification.summary!.appAppleId)
        expect("com.example").toBe(notification.summary!.bundleId)
        expect("com.example.product").toBe(notification.summary!.productId)
        expect("efb27071-45a4-4aca-9854-2a1e9146f265").toBe(notification.summary!.requestIdentifier)
        expect(["CAN", "USA", "MEX"]).toStrictEqual(notification.summary!.storefrontCountryCodes)
        expect(5).toBe(notification.summary!.succeededCount)
        expect(2).toBe(notification.summary!.failedCount)
    })

    it('should decode a signed external purchase token notification', async () => {
        const signedNotification = createSignedDataFromJson("tests/resources/models/signedExternalPurchaseTokenNotification.json")

        const verifier = await getDefaultSignedPayloadVerifier();
        (verifier as any).verifyNotification = function(bundleId?: string, appAppleId?: number, environment?: string) {
            expect(bundleId).toBe("com.example")
            expect(appAppleId).toBe(55555)
            expect(environment).toBe(Environment.PRODUCTION)
        }
        const notification = await verifier.verifyAndDecodeNotification(signedNotification)

        expect(NotificationTypeV2.EXTERNAL_PURCHASE_TOKEN).toBe(notification.notificationType)
        expect(Subtype.UNREPORTED).toBe(notification.subtype)
        expect("002e14d5-51f5-4503-b5a8-c3a1af68eb20").toBe(notification.notificationUUID)
        expect("2.0").toBe(notification.version)
        expect(1698148900000).toBe(notification.signedDate)
        expect(notification.data).toBeFalsy();
        expect(notification.summary).toBeFalsy();
        expect(notification.externalPurchaseToken).toBeTruthy()
        expect("b2158121-7af9-49d4-9561-1f588205523e").toBe(notification.externalPurchaseToken!.externalPurchaseId)
        expect(1698148950000).toBe(notification.externalPurchaseToken!.tokenCreationDate)
        expect(55555).toBe(notification.externalPurchaseToken!.appAppleId)
        expect("com.example").toBe(notification.externalPurchaseToken!.bundleId)
    })

    it('should decode a signed sandbox external purchase token notification', async () => {
        const signedNotification = createSignedDataFromJson("tests/resources/models/signedExternalPurchaseTokenSandboxNotification.json")

        const verifier = await getDefaultSignedPayloadVerifier();
        (verifier as any).verifyNotification = function(bundleId?: string, appAppleId?: number, environment?: string) {
            expect(bundleId).toBe("com.example")
            expect(appAppleId).toBe(55555)
            expect(environment).toBe(Environment.SANDBOX)
        }
        const notification = await verifier.verifyAndDecodeNotification(signedNotification)

        expect(NotificationTypeV2.EXTERNAL_PURCHASE_TOKEN).toBe(notification.notificationType)
        expect(Subtype.UNREPORTED).toBe(notification.subtype)
        expect("002e14d5-51f5-4503-b5a8-c3a1af68eb20").toBe(notification.notificationUUID)
        expect("2.0").toBe(notification.version)
        expect(1698148900000).toBe(notification.signedDate)
        expect(notification.data).toBeFalsy();
        expect(notification.summary).toBeFalsy();
        expect(notification.externalPurchaseToken).toBeTruthy()
        expect("SANDBOX_b2158121-7af9-49d4-9561-1f588205523e").toBe(notification.externalPurchaseToken!.externalPurchaseId)
        expect(1698148950000).toBe(notification.externalPurchaseToken!.tokenCreationDate)
        expect(55555).toBe(notification.externalPurchaseToken!.appAppleId)
        expect("com.example").toBe(notification.externalPurchaseToken!.bundleId)
    })

    it('should decode a signed RESCIND_CONSENT notification', async () => {
        const signedNotification = createSignedDataFromJson("tests/resources/models/signedRescindConsentNotification.json")

        const verifier = await getDefaultSignedPayloadVerifier();
        (verifier as any).verifyNotification = function(bundleId?: string, appAppleId?: number, environment?: string) {
            expect(bundleId).toBe("com.example")
            expect(appAppleId).toBe(41234)
            expect(environment).toBe(Environment.LOCAL_TESTING)
        }
        const notification = await verifier.verifyAndDecodeNotification(signedNotification)

        expect(NotificationTypeV2.RESCIND_CONSENT).toBe(notification.notificationType)
        expect(notification.subtype).toBeFalsy()
        expect("002e14d5-51f5-4503-b5a8-c3a1af68eb20").toBe(notification.notificationUUID)
        expect("2.0").toBe(notification.version)
        expect(1698148900000).toBe(notification.signedDate)
        expect(notification.data).toBeFalsy();
        expect(notification.summary).toBeFalsy();
        expect(notification.externalPurchaseToken).toBeFalsy()
        expect(notification.appData).toBeTruthy()
        expect(Environment.LOCAL_TESTING).toBe(notification.appData!.environment)
        expect(41234).toBe(notification.appData!.appAppleId)
        expect("com.example").toBe(notification.appData!.bundleId)
        expect("signed_app_transaction_info_value").toBe(notification.appData!.signedAppTransactionInfo)
    })

    it('should validate valid transaction with revocationType as string', () => {
        const validator = new JWSTransactionDecodedPayloadValidator()
        const validTransaction = {
            originalTransactionId: "12345",
            transactionId: "23456",
            bundleId: "com.example",
            productId: "com.example.product",
            revocationType: "REFUND_FULL"
        }

        expect(validator.validate(validTransaction)).toBe(true)
    })
})