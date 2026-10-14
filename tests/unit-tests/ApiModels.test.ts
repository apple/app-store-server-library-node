// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { NotificationHistoryResponseValidator } from "../../models/NotificationHistoryResponse"
import { StatusResponseValidator } from "../../models/StatusResponse"
import { TransactionCommitmentInfoValidator } from "../../models/TransactionCommitmentInfo"
import { JWSTransactionDecodedPayloadValidator } from "../../models/JWSTransactionDecodedPayload"
import { MassExtendRenewalDateResponseValidator } from "../../models/MassExtendRenewalDateResponse"
import { MassExtendRenewalDateStatusResponseValidator } from "../../models/MassExtendRenewalDateStatusResponse"
import { RealtimeUrlResponseValidator } from "../../models/RealtimeUrlResponse"
import { SummaryValidator } from "../../models/Summary"
import { RefundPreferenceV1, RefundPreferenceV1Validator } from "../../models/RefundPreferenceV1"
import { ExtendRenewalDateRequest, ExtendRenewalDateRequestValidator } from "../../models/ExtendRenewalDateRequest"
import { MassExtendRenewalDateRequest, MassExtendRenewalDateRequestValidator } from "../../models/MassExtendRenewalDateRequest"
import { NotificationHistoryRequest, NotificationHistoryRequestValidator } from "../../models/NotificationHistoryRequest"
import { ConsumptionRequest, ConsumptionRequestValidator } from "../../models/ConsumptionRequest"
import { ConsumptionRequestV1, ConsumptionRequestV1Validator } from "../../models/ConsumptionRequestV1"
import { UpdateAppAccountTokenRequest, UpdateAppAccountTokenRequestValidator } from "../../models/UpdateAppAccountTokenRequest"
import { ExtendReasonCode } from "../../models/ExtendReasonCode"
import { NotificationTypeV2 } from "../../models/NotificationTypeV2"
import { Subtype } from "../../models/Subtype"
import { DeliveryStatus } from "../../models/DeliveryStatus"
import { RefundPreference } from "../../models/RefundPreference"
import { ConsumptionStatus } from "../../models/ConsumptionStatus"
import { Platform } from "../../models/Platform"
import { DeliveryStatusV1 } from "../../models/DeliveryStatusV1"
import { AccountTenure } from "../../models/AccountTenure"
import { PlayTime } from "../../models/PlayTime"
import { LifetimeDollarsRefunded } from "../../models/LifetimeDollarsRefunded"
import { LifetimeDollarsPurchased } from "../../models/LifetimeDollarsPurchased"
import { UserStatus } from "../../models/UserStatus"
import { Validator } from "../../models/Validator"
import { Equals, expectRequestBodyValidation, readFile, RequiredKeys } from "../util"

describe('NotificationHistoryResponse', () => {
    it('should validate a valid NotificationHistoryResponse', () => {
        const notificationHistoryResponse = JSON.parse(readFile('tests/resources/models/getNotificationHistoryResponse.json'))

        expect(new NotificationHistoryResponseValidator().validate(notificationHistoryResponse)).toBe(true)
    })

    it('should reject a notification history item with an invalid signedPayload type', () => {
        const notificationHistoryResponse = {
            notificationHistory: [
                {
                    signedPayload: 12345,
                    sendAttempts: []
                }
            ]
        }

        expect(new NotificationHistoryResponseValidator().validate(notificationHistoryResponse)).toBe(false)
    })

    it('should reject a notification history item with an invalid sendAttempts type', () => {
        const notificationHistoryResponse = {
            notificationHistory: [
                {
                    signedPayload: "signed_payload",
                    sendAttempts: "not-an-array"
                }
            ]
        }

        expect(new NotificationHistoryResponseValidator().validate(notificationHistoryResponse)).toBe(false)
    })

    it('should reject a notification history item with an invalid sendAttemptItem', () => {
        const notificationHistoryResponse = {
            notificationHistory: [
                {
                    signedPayload: "signed_payload",
                    sendAttempts: [
                        {
                            attemptDate: "1698148900000",
                            sendAttemptResult: "SUCCESS"
                        }
                    ]
                }
            ]
        }

        expect(new NotificationHistoryResponseValidator().validate(notificationHistoryResponse)).toBe(false)
    })
})

describe('StatusResponse', () => {
    it('should validate a valid StatusResponse', () => {
        const statusResponse = JSON.parse(readFile('tests/resources/models/getAllSubscriptionStatusesResponse.json'))

        expect(new StatusResponseValidator().validate(statusResponse)).toBe(true)
    })

    it('should accept an unknown subscription status value', () => {
        const statusResponse = {
            data: [
                {
                    subscriptionGroupIdentifier: "sub_group_one",
                    lastTransactions: [
                        {
                            status: 99,
                            originalTransactionId: "3749183"
                        }
                    ]
                }
            ]
        }

        expect(new StatusResponseValidator().validate(statusResponse)).toBe(true)
    })

    it('should reject a StatusResponse with an invalid data type', () => {
        const statusResponse = {
            bundleId: "com.example",
            data: "not-an-array"
        }

        expect(new StatusResponseValidator().validate(statusResponse)).toBe(false)
    })

    it('should reject a SubscriptionGroupIdentifierItem with an invalid subscriptionGroupIdentifier type', () => {
        const statusResponse = {
            data: [
                {
                    subscriptionGroupIdentifier: 1,
                    lastTransactions: []
                }
            ]
        }

        expect(new StatusResponseValidator().validate(statusResponse)).toBe(false)
    })

    it('should reject a SubscriptionGroupIdentifierItem with an invalid lastTransactions type', () => {
        const statusResponse = {
            data: [
                {
                    subscriptionGroupIdentifier: "sub_group_one",
                    lastTransactions: 5
                }
            ]
        }

        expect(new StatusResponseValidator().validate(statusResponse)).toBe(false)
    })

    it('should reject a LastTransactionsItem with an invalid status type', () => {
        const statusResponse = {
            data: [
                {
                    subscriptionGroupIdentifier: "sub_group_one",
                    lastTransactions: [
                        {
                            status: "ACTIVE",
                            originalTransactionId: "3749183"
                        }
                    ]
                }
            ]
        }

        expect(new StatusResponseValidator().validate(statusResponse)).toBe(false)
    })

    it('should reject a LastTransactionsItem with an invalid signedTransactionInfo type', () => {
        const statusResponse = {
            data: [
                {
                    subscriptionGroupIdentifier: "sub_group_one",
                    lastTransactions: [
                        {
                            status: 1,
                            signedTransactionInfo: 12345
                        }
                    ]
                }
            ]
        }

        expect(new StatusResponseValidator().validate(statusResponse)).toBe(false)
    })
})

describe('TransactionCommitmentInfo', () => {
    it('should reject a billingPeriodNumber outside the documented range', () => {
        const transactionCommitmentInfo = {
            billingPeriodNumber: 24,
            commitmentExpiresDate: 1698150000000,
            commitmentPrice: 119880,
            totalBillingPeriods: 24
        }

        expect(new TransactionCommitmentInfoValidator().validate(transactionCommitmentInfo)).toBe(false)
        expect(new TransactionCommitmentInfoValidator().validate({ billingPeriodNumber: 0 })).toBe(false)
        expect(new TransactionCommitmentInfoValidator().validate({ billingPeriodNumber: 1 })).toBe(true)
        expect(new TransactionCommitmentInfoValidator().validate({ billingPeriodNumber: 12 })).toBe(true)
    })

    it('should reject a billingPeriodNumber with an invalid type', () => {
        const transactionCommitmentInfo = {
            billingPeriodNumber: "3"
        }

        expect(new TransactionCommitmentInfoValidator().validate(transactionCommitmentInfo)).toBe(false)
    })

    it('should reject a decoded transaction with a billingPeriodNumber outside the documented range', () => {
        const transaction = JSON.parse(readFile('tests/resources/models/signedTransaction.json'))
        transaction.commitmentInfo.billingPeriodNumber = 24
        transaction.commitmentInfo.totalBillingPeriods = 24

        expect(new JWSTransactionDecodedPayloadValidator().validate(transaction)).toBe(false)
    })
})

describe('Decoded models', () => {
    it('should check their documented limits', () => {
        const cases: [Validator<any>, string, any, any][] = [
            [new TransactionCommitmentInfoValidator(), 'billingPeriodNumber', 12, 13],
            [new TransactionCommitmentInfoValidator(), 'billingPeriodNumber', 1, 0],
            [new JWSTransactionDecodedPayloadValidator(), 'revocationPercentage', 100000, 100001],
            [new JWSTransactionDecodedPayloadValidator(), 'revocationPercentage', 0, -1],
            [new SummaryValidator(), 'storefrontCountryCodes', ['USA'], ['USAA']],
            [new MassExtendRenewalDateResponseValidator(), 'requestIdentifier', 'a'.repeat(128), 'a'.repeat(129)],
            [new MassExtendRenewalDateStatusResponseValidator(), 'requestIdentifier', 'a'.repeat(128), 'a'.repeat(129)],
            [new RealtimeUrlResponseValidator(), 'realtimeURL', 'a'.repeat(256), 'a'.repeat(257)],
        ]
        for (const [validator, key, valid, invalid] of cases) {
            expect(validator.validate({ [key]: valid })).toBe(true)
            expect(validator.validate({ [key]: invalid })).toBe(false)
        }
    })
})

describe('RefundPreferenceV1', () => {
    it('should validate RefundPreferenceV1 values', () => {
        const validator = new RefundPreferenceV1Validator()

        expect(validator.validate(3)).toBe(true)
        expect(validator.validate("3")).toBe(false)
    })
})

describe('Request bodies', () => {
    it('should require the fields the documentation marks as required', () => {
        const extendRenewalDateRequest: Equals<RequiredKeys<ExtendRenewalDateRequest>, 'extendByDays' | 'extendReasonCode' | 'requestIdentifier'> = true
        const massExtendRenewalDateRequest: Equals<RequiredKeys<MassExtendRenewalDateRequest>, 'extendByDays' | 'extendReasonCode' | 'requestIdentifier' | 'productId'> = true
        const notificationHistoryRequest: Equals<RequiredKeys<NotificationHistoryRequest>, 'startDate' | 'endDate'> = true
        const consumptionRequest: Equals<RequiredKeys<ConsumptionRequest>, 'customerConsented' | 'sampleContentProvided' | 'deliveryStatus'> = true
        const consumptionRequestV1: Equals<RequiredKeys<ConsumptionRequestV1>, 'customerConsented' | 'consumptionStatus' | 'platform' | 'sampleContentProvided' | 'deliveryStatus' | 'appAccountToken' | 'accountTenure' | 'playTime' | 'lifetimeDollarsRefunded' | 'lifetimeDollarsPurchased' | 'userStatus'> = true
        const updateAppAccountTokenRequest: Equals<RequiredKeys<UpdateAppAccountTokenRequest>, 'appAccountToken'> = true

        expect([extendRenewalDateRequest, massExtendRenewalDateRequest, notificationHistoryRequest, consumptionRequest, consumptionRequestV1, updateAppAccountTokenRequest]).not.toContain(false)
    })

    it('should not build an ExtendRenewalDateRequest without its required fields', () => {
        // @ts-expect-error
        const extendRenewalDateRequest: ExtendRenewalDateRequest = {
            extendByDays: 45,
            extendReasonCode: ExtendReasonCode.CUSTOMER_SATISFACTION
        }

        expect(extendRenewalDateRequest.requestIdentifier).toBeUndefined()
    })

    it('should not build a NotificationHistoryRequest without its required fields', () => {
        // @ts-expect-error
        const notificationHistoryRequest: NotificationHistoryRequest = {
            startDate: 1698148900000
        }

        expect(notificationHistoryRequest.endDate).toBeUndefined()
    })
})

describe('Request body validators', () => {
    it.each([
        ['ExtendRenewalDateRequest', new ExtendRenewalDateRequestValidator(), (): ExtendRenewalDateRequest => ({
            extendByDays: 45,
            extendReasonCode: ExtendReasonCode.CUSTOMER_SATISFACTION,
            requestIdentifier: "fdf964a4-233b-486c-aac1-97d8d52688ac"
        }), ['extendByDays', 'extendReasonCode', 'requestIdentifier']],
        ['MassExtendRenewalDateRequest', new MassExtendRenewalDateRequestValidator(), (): MassExtendRenewalDateRequest => ({
            extendByDays: 45,
            extendReasonCode: ExtendReasonCode.CUSTOMER_SATISFACTION,
            requestIdentifier: "fdf964a4-233b-486c-aac1-97d8d52688ac",
            storefrontCountryCodes: ["USA", "MEX"],
            productId: "com.example.productId"
        }), ['extendByDays', 'extendReasonCode', 'requestIdentifier', 'productId']],
        ['NotificationHistoryRequest', new NotificationHistoryRequestValidator(), (): NotificationHistoryRequest => ({
            startDate: 1698148900000,
            endDate: 1698148950000,
            notificationType: NotificationTypeV2.SUBSCRIBED,
            notificationSubtype: Subtype.INITIAL_BUY,
            transactionId: "999733843",
            onlyFailures: true
        }), ['startDate', 'endDate']],
        ['ConsumptionRequest', new ConsumptionRequestValidator(), (): ConsumptionRequest => ({
            customerConsented: true,
            consumptionPercentage: 50000,
            deliveryStatus: DeliveryStatus.DELIVERED,
            refundPreference: RefundPreference.GRANT_FULL,
            sampleContentProvided: false
        }), ['customerConsented', 'deliveryStatus', 'sampleContentProvided']],
        ['ConsumptionRequestV1', new ConsumptionRequestV1Validator(), (): ConsumptionRequestV1 => ({
            customerConsented: true,
            consumptionStatus: ConsumptionStatus.NOT_CONSUMED,
            platform: Platform.NON_APPLE,
            sampleContentProvided: false,
            deliveryStatus: DeliveryStatusV1.DID_NOT_DELIVER_DUE_TO_SERVER_OUTAGE,
            appAccountToken: "7389a31a-fb6d-4569-a2a6-db7d85d84813",
            accountTenure: AccountTenure.THIRTY_DAYS_TO_NINETY_DAYS,
            playTime: PlayTime.ONE_DAY_TO_FOUR_DAYS,
            lifetimeDollarsRefunded: LifetimeDollarsRefunded.ONE_THOUSAND_DOLLARS_TO_ONE_THOUSAND_NINE_HUNDRED_NINETY_NINE_DOLLARS_AND_NINETY_NINE_CENTS,
            lifetimeDollarsPurchased: LifetimeDollarsPurchased.TWO_THOUSAND_DOLLARS_OR_GREATER,
            userStatus: UserStatus.LIMITED_ACCESS,
            refundPreference: RefundPreferenceV1.NO_PREFERENCE
        }), ['customerConsented', 'consumptionStatus', 'platform', 'sampleContentProvided', 'deliveryStatus', 'appAccountToken', 'accountTenure', 'playTime', 'lifetimeDollarsRefunded', 'lifetimeDollarsPurchased', 'userStatus']],
        ['UpdateAppAccountTokenRequest', new UpdateAppAccountTokenRequestValidator(), (): UpdateAppAccountTokenRequest => ({
            appAccountToken: "7389a31a-fb6d-4569-a2a6-db7d85d84813"
        }), ['appAccountToken']],
    ] as [string, Validator<unknown>, () => object, string[]][])('should reject a %s that lacks a required field or has a field of the wrong type', (_, validator, completeBody, requiredKeys) => {
        expectRequestBodyValidation(validator, completeBody, requiredKeys)
    })

    it('should accept unknown enum values in the raw-value fallback fields', () => {
        expect(new ConsumptionRequestValidator().validate({ customerConsented: true, deliveryStatus: "NEW_STATUS", sampleContentProvided: true })).toBe(true)
        expect(new ExtendRenewalDateRequestValidator().validate({ extendByDays: 45, extendReasonCode: 99, requestIdentifier: "fdf964a4-233b-486c-aac1-97d8d52688ac" })).toBe(true)
    })

    it.each([
        ['ExtendRenewalDateRequest', 'extendReasonCode', ExtendReasonCode, new ExtendRenewalDateRequestValidator(), (): ExtendRenewalDateRequest => ({
            extendByDays: 45,
            extendReasonCode: 99,
            requestIdentifier: "fdf964a4-233b-486c-aac1-97d8d52688ac"
        })],
        ['MassExtendRenewalDateRequest', 'extendReasonCode', ExtendReasonCode, new MassExtendRenewalDateRequestValidator(), (): MassExtendRenewalDateRequest => ({
            extendByDays: 45,
            extendReasonCode: 99,
            requestIdentifier: "fdf964a4-233b-486c-aac1-97d8d52688ac",
            productId: "com.example.productId"
        })],
        ['NotificationHistoryRequest', 'notificationType', NotificationTypeV2, new NotificationHistoryRequestValidator(), (): NotificationHistoryRequest => ({
            startDate: 1698148900000,
            endDate: 1698148950000,
            notificationType: "NEW_NOTIFICATION_TYPE"
        })],
        ['NotificationHistoryRequest', 'notificationSubtype', Subtype, new NotificationHistoryRequestValidator(), (): NotificationHistoryRequest => ({
            startDate: 1698148900000,
            endDate: 1698148950000,
            notificationType: NotificationTypeV2.SUBSCRIBED,
            notificationSubtype: "NEW_SUBTYPE"
        })],
    ] as [string, string, object, Validator<unknown>, () => any][])('should accept a %s whose %s is a raw value the enum does not know', (_, key, enumType, validator, body) => {
        expect(Object.values(enumType)).not.toContain(body()[key])
        expect(validator.validate(body())).toBe(true)
    })
})

describe('Request body limits', () => {
    const extendRequest = (extendByDays: number, requestIdentifier = "id"): ExtendRenewalDateRequest => ({
        extendByDays,
        extendReasonCode: ExtendReasonCode.CUSTOMER_SATISFACTION,
        requestIdentifier
    })
    const massExtendRequest = (extendByDays: number, requestIdentifier = "id", storefrontCountryCodes?: string[]): MassExtendRenewalDateRequest => ({
        extendByDays,
        extendReasonCode: ExtendReasonCode.CUSTOMER_SATISFACTION,
        requestIdentifier,
        productId: "com.example.productId",
        ...(storefrontCountryCodes ? { storefrontCountryCodes } : {})
    })

    it('should accept extendByDays 1 and 90 and reject 0 and 91', () => {
        for (const extendByDays of [1, 90]) {
            expect(new ExtendRenewalDateRequestValidator().validate(extendRequest(extendByDays))).toBe(true)
            expect(new MassExtendRenewalDateRequestValidator().validate(massExtendRequest(extendByDays))).toBe(true)
        }
        for (const extendByDays of [0, 91]) {
            expect(new ExtendRenewalDateRequestValidator().validate(extendRequest(extendByDays))).toBe(false)
            expect(new MassExtendRenewalDateRequestValidator().validate(massExtendRequest(extendByDays))).toBe(false)
        }
    })

    it('should accept a requestIdentifier of 128 characters and reject 129', () => {
        expect(new ExtendRenewalDateRequestValidator().validate(extendRequest(45, "a".repeat(128)))).toBe(true)
        expect(new MassExtendRenewalDateRequestValidator().validate(massExtendRequest(45, "a".repeat(128)))).toBe(true)
        expect(new ExtendRenewalDateRequestValidator().validate(extendRequest(45, "a".repeat(129)))).toBe(false)
        expect(new MassExtendRenewalDateRequestValidator().validate(massExtendRequest(45, "a".repeat(129)))).toBe(false)
    })

    it('should accept storefront country codes of at most 3 characters', () => {
        expect(new MassExtendRenewalDateRequestValidator().validate(massExtendRequest(45, "id", ["USA", "CA"]))).toBe(true)
        expect(new MassExtendRenewalDateRequestValidator().validate(massExtendRequest(45, "id", ["USA", "ABCD"]))).toBe(false)
    })

    it('should accept consumptionPercentage 0 and 100000 and reject -1 and 100001', () => {
        const consumptionRequest = (consumptionPercentage?: number): ConsumptionRequest => ({
            customerConsented: true,
            deliveryStatus: DeliveryStatus.DELIVERED,
            sampleContentProvided: false,
            ...(consumptionPercentage !== undefined ? { consumptionPercentage } : {})
        })
        expect(new ConsumptionRequestValidator().validate(consumptionRequest())).toBe(true)
        for (const consumptionPercentage of [0, 100000]) {
            expect(new ConsumptionRequestValidator().validate(consumptionRequest(consumptionPercentage))).toBe(true)
        }
        for (const consumptionPercentage of [-1, 100001]) {
            expect(new ConsumptionRequestValidator().validate(consumptionRequest(consumptionPercentage))).toBe(false)
        }
    })
})
