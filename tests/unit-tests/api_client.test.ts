// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { AccountTenure } from "../../models/AccountTenure";
import { ConsumptionRequest } from "../../models/ConsumptionRequest";
import { ConsumptionRequestV1 } from "../../models/ConsumptionRequestV1";
import { UpdateAppAccountTokenRequest } from "../../models/UpdateAppAccountTokenRequest";
import { ConsumptionStatus } from "../../models/ConsumptionStatus";
import { DeliveryStatus } from "../../models/DeliveryStatus";
import { DeliveryStatusV1 } from "../../models/DeliveryStatusV1";
import { Environment } from "../../models/Environment";
import { LifetimeDollarsPurchased } from "../../models/LifetimeDollarsPurchased";
import { LifetimeDollarsRefunded } from "../../models/LifetimeDollarsRefunded";
import { NotificationTypeV2 } from "../../models/NotificationTypeV2";
import { Platform } from "../../models/Platform";
import { PlayTime } from "../../models/PlayTime";
import { Status } from "../../models/Status";
import { Subtype } from "../../models/Subtype";
import { UserStatus } from "../../models/UserStatus";
import { readFile } from "../util"
import { InAppOwnershipType } from "../../models/InAppOwnershipType";
import { RefundPreference } from "../../models/RefundPreference";
import { RefundPreferenceV1 } from "../../models/RefundPreferenceV1";
import { APIError, APIException, AppStoreServerAPIClient, ExtendReasonCode, ExtendRenewalDateRequest, GetTransactionHistoryVersion, MassExtendRenewalDateRequest, NotificationHistoryRequest, NotificationHistoryResponseItem, Order, OrderLookupStatus, ProductType, SendAttemptResult, TransactionHistoryRequest } from "../../index";
import { Response } from "node-fetch";

import jsonwebtoken = require('jsonwebtoken');

type callbackType = (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => void

class AppStoreServerAPIClientForTest extends AppStoreServerAPIClient {

    private callback: callbackType
    private body: string
    private statusCode: number

    public constructor(signingKey: string, keyId: string, issuerId: string, bundleId: string, environment: Environment, callback: callbackType, body: string, statusCode: number) {
        super(signingKey, keyId, issuerId, bundleId, environment)
        this.callback = callback
        this.body = body
        this.statusCode = statusCode
    }
    protected async makeFetchRequest(path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }): Promise<Response> {
        // Check Content-Type based on body type
        if (requestBody instanceof Buffer) {
            expect(headers['Content-Type']).toBe('image/png')
        } else if (requestBody !== undefined) {
            expect(typeof requestBody).toBe('string')
            expect(headers['Content-Type']).toBe('application/json')
        } else {
            expect(headers['Content-Type']).toBeUndefined()
        }

        expect('application/json').toBe(headers['Accept'])
        expect(headers['Authorization']).toMatch(/^Bearer .+/)
        const token = headers['Authorization'].substring(7)
        const decodedToken = jsonwebtoken.decode(token) as jsonwebtoken.JwtPayload
        expect(decodedToken['bid']).toBe('bundleId')
        expect(decodedToken['aud']).toBe('appstoreconnect-v1')
        expect(decodedToken['iss']).toBe('issuerId')
        expect(headers['User-Agent']).toMatch(/^app-store-server-library\/node\/.+/)
        this.callback(path, parsedQueryParameters, method, requestBody, headers)
        return Promise.resolve(new Response(this.body, {
            status: this.statusCode
        }))
    }
}

function getClientWithBody(path: string, callback: callbackType, statusCode: number = 200): AppStoreServerAPIClient {
    const body = readFile(path)
    return getAppStoreServerAPIClient(body, statusCode, callback)
}

function getAppStoreServerAPIClient(body: string, statusCode: number, callback: callbackType): AppStoreServerAPIClient {
    const key = getSigningKey()
    return new AppStoreServerAPIClientForTest(key, "keyId", "issuerId", "bundleId", Environment.LOCAL_TESTING, callback, body, statusCode)
}

function getSigningKey(): string {
    return readFile('tests/resources/certs/testSigningKey.p8')
}

describe('The api client ', () => {
    
    it('calls extendRenewalDateForAllActiveSubscribers', async () => {
       const client = getClientWithBody("tests/resources/models/extendRenewalDateForAllActiveSubscribersResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("POST").toBe(method)
            expect("/inApps/v1/subscriptions/extend/mass").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)

            expect(requestBody).toBeTruthy()
            expect(typeof requestBody).toBe('string')
            const body = JSON.parse(requestBody as string)
            expect(45).toBe(body.extendByDays)
            expect(1).toBe(body.extendReasonCode)
            expect("fdf964a4-233b-486c-aac1-97d8d52688ac").toBe(body.requestIdentifier)
            expect(["USA", "MEX"]).toStrictEqual(body.storefrontCountryCodes)
            expect("com.example.productId").toBe(body.productId)
        });

        const extendRenewalDateRequest: MassExtendRenewalDateRequest = {
            extendByDays: 45,
            extendReasonCode: ExtendReasonCode.CUSTOMER_SATISFACTION,
            requestIdentifier: "fdf964a4-233b-486c-aac1-97d8d52688ac",
            storefrontCountryCodes: ["USA", "MEX"],
            productId: "com.example.productId"
        }

        const massExtendRenewalDateResponse = await client.extendRenewalDateForAllActiveSubscribers(extendRenewalDateRequest);

        expect(massExtendRenewalDateResponse).toBeTruthy()
        expect("758883e8-151b-47b7-abd0-60c4d804c2f5").toBe(massExtendRenewalDateResponse.requestIdentifier)
    })

    it('calls extendSubscriptionRenewalDate', async () => {
       const client = getClientWithBody("tests/resources/models/extendSubscriptionRenewalDateResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/subscriptions/extend/4124214").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)

            expect(requestBody).toBeTruthy()
            expect(typeof requestBody).toBe('string')
            const body = JSON.parse(requestBody as string)
            expect(45).toBe(body.extendByDays)
            expect(1).toBe(body.extendReasonCode)
            expect("fdf964a4-233b-486c-aac1-97d8d52688ac").toBe(body.requestIdentifier)
        });

        const extendRenewalDateRequest: ExtendRenewalDateRequest = {
            extendByDays: 45,
            extendReasonCode: ExtendReasonCode.CUSTOMER_SATISFACTION,
            requestIdentifier: "fdf964a4-233b-486c-aac1-97d8d52688ac"
        }

        const extendRenewalDateResponse = await client.extendSubscriptionRenewalDate("4124214", extendRenewalDateRequest);

        expect(extendRenewalDateResponse).toBeTruthy()
        expect("2312412").toBe(extendRenewalDateResponse.originalTransactionId)
        expect("9993").toBe(extendRenewalDateResponse.webOrderLineItemId)
        expect(extendRenewalDateResponse.success).toBe(true)
        expect(1698148900000).toBe(extendRenewalDateResponse.effectiveDate)
    })

    it('calls getAllSubscriptionStatuses', async () => {
       const client = getClientWithBody("tests/resources/models/getAllSubscriptionStatusesResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/inApps/v1/subscriptions/4321").toBe(path)
            expect(["2", "1"]).toStrictEqual(parsedQueryParameters.getAll("status"))
            expect(requestBody).toBeUndefined()
        });

        const statusResponse = await client.getAllSubscriptionStatuses("4321", [Status.EXPIRED, Status.ACTIVE]);

        expect(statusResponse).toBeTruthy()
        expect(Environment.LOCAL_TESTING).toBe(statusResponse.environment)
        expect("com.example").toBe(statusResponse.bundleId)
        expect(5454545).toBe(statusResponse.appAppleId)

        const item = [
            {
                subscriptionGroupIdentifier: 'sub_group_one',
                lastTransactions: [
                    {
                        status: Status.ACTIVE,
                        originalTransactionId: "3749183",
                        signedTransactionInfo: "signed_transaction_one",
                        signedRenewalInfo: "signed_renewal_one"
                    },
                    {
                        status: Status.REVOKED,
                        originalTransactionId: "5314314134",
                        signedTransactionInfo: "signed_transaction_two",
                        signedRenewalInfo: "signed_renewal_two"
                    }
                ]
            },
            {
                subscriptionGroupIdentifier: "sub_group_two",
                lastTransactions: [
                    {
                        status: Status.EXPIRED,
                        originalTransactionId: "3413453",
                        signedTransactionInfo: "signed_transaction_three",
                        signedRenewalInfo: "signed_renewal_three"
                    }
                ]
            }
        ]
        expect(statusResponse.data).toStrictEqual(item)
    })

    it('calls getRefundHistory', async () => {
       const client = getClientWithBody("tests/resources/models/getRefundHistoryResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/inApps/v2/refund/lookup/555555").toBe(path)
            expect("revision_input").toBe(parsedQueryParameters.get("revision"))
            expect(requestBody).toBeUndefined()
        });

        const refundHistoryResponse = await client.getRefundHistory("555555", "revision_input");

        expect(refundHistoryResponse).toBeTruthy()
        expect(["signed_transaction_one", "signed_transaction_two"]).toStrictEqual(refundHistoryResponse.signedTransactions)
        expect("revision_output").toBe(refundHistoryResponse.revision)
        expect(refundHistoryResponse.hasMore).toBe(true)
    })

    it('calls getStatusOfSubscriptionRenewalDateExtensions', async () => {
       const client = getClientWithBody("tests/resources/models/getStatusOfSubscriptionRenewalDateExtensionsResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/inApps/v1/subscriptions/extend/mass/20fba8a0-2b80-4a7d-a17f-85c1854727f8/com.example.product").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        const massExtendRenewalDateStatusResponse = await client.getStatusOfSubscriptionRenewalDateExtensions("com.example.product", "20fba8a0-2b80-4a7d-a17f-85c1854727f8");

        expect(massExtendRenewalDateStatusResponse).toBeTruthy()
        expect("20fba8a0-2b80-4a7d-a17f-85c1854727f8").toBe(massExtendRenewalDateStatusResponse.requestIdentifier)
        expect(massExtendRenewalDateStatusResponse.complete).toBe(true)
        expect(1698148900000).toBe(massExtendRenewalDateStatusResponse.completeDate)
        expect(30).toBe(massExtendRenewalDateStatusResponse.succeededCount)
        expect(2).toBe(massExtendRenewalDateStatusResponse.failedCount)
    })

    it('calls getTestNotificationStatus', async () => {
       const client = getClientWithBody("tests/resources/models/getTestNotificationStatusResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/inApps/v1/notifications/test/8cd2974c-f905-492a-bf9a-b2f47c791d19").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        const checkTestNotificationResponse = await client.getTestNotificationStatus("8cd2974c-f905-492a-bf9a-b2f47c791d19");

        expect(checkTestNotificationResponse).toBeTruthy();
        expect("signed_payload").toBe(checkTestNotificationResponse.signedPayload)
        const sendAttemptItems = [
            {
                attemptDate: 1698148900000,
                sendAttemptResult: SendAttemptResult.NO_RESPONSE
            },
            {
                attemptDate: 1698148950000,
                sendAttemptResult: SendAttemptResult.SUCCESS
            }
        ]
        expect(sendAttemptItems).toStrictEqual(checkTestNotificationResponse.sendAttempts)
    })

    it('calls getNotificationHistoryResponse', async () => {
       const client = getClientWithBody("tests/resources/models/getNotificationHistoryResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("POST").toBe(method)
            expect("/inApps/v1/notifications/history").toBe(path)
            expect("a036bc0e-52b8-4bee-82fc-8c24cb6715d6").toBe(parsedQueryParameters.get("paginationToken"))
            expect(requestBody).toBeTruthy()
            expect(typeof requestBody).toBe('string')
            const body = JSON.parse(requestBody as string)
            expect(1698148900000).toBe(body.startDate)
            expect(1698148950000).toBe(body.endDate)
            expect("SUBSCRIBED").toBe(body.notificationType)
            expect("INITIAL_BUY").toBe(body.notificationSubtype)
            expect("999733843").toBe(body.transactionId)
            expect(body.onlyFailures).toBe(true);
        });

        const notificationHistoryRequest: NotificationHistoryRequest = {
            startDate: 1698148900000,
            endDate: 1698148950000,
            notificationType: NotificationTypeV2.SUBSCRIBED,
            notificationSubtype: Subtype.INITIAL_BUY,
            transactionId: "999733843",
            onlyFailures: true
        }

        const notificationHistoryResponse = await client.getNotificationHistory("a036bc0e-52b8-4bee-82fc-8c24cb6715d6", notificationHistoryRequest);

        expect(notificationHistoryResponse).toBeTruthy()
        expect("57715481-805a-4283-8499-1c19b5d6b20a").toBe(notificationHistoryResponse.paginationToken)
        expect(notificationHistoryResponse.hasMore).toBe(true)
        const expectedNotificationHistory: NotificationHistoryResponseItem[] = [
            {
                sendAttempts: [
                    {
                        attemptDate: 1698148900000,
                        sendAttemptResult: SendAttemptResult.NO_RESPONSE
                    },
                    {
                        attemptDate: 1698148950000,
                        sendAttemptResult: SendAttemptResult.SUCCESS
                    }
                ],
                signedPayload: "signed_payload_one"
            },
            {
                sendAttempts: [
                    {
                        attemptDate: 1698148800000,
                        sendAttemptResult: SendAttemptResult.CIRCULAR_REDIRECT
                    }
                ],
                signedPayload: "signed_payload_two"
            }
        ]
        expect(expectedNotificationHistory).toStrictEqual(notificationHistoryResponse.notificationHistory)
    })

    it('calls getTransactionHistory V1', async () => {
       const client = getClientWithBody("tests/resources/models/transactionHistoryResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/inApps/v1/history/1234").toBe(path)
            expect("revision_input").toBe(parsedQueryParameters.get("revision"))
            expect("123455").toBe(parsedQueryParameters.get("startDate"))
            expect("123456").toBe(parsedQueryParameters.get("endDate"))
            expect(["com.example.1", "com.example.2"]).toStrictEqual(parsedQueryParameters.getAll("productId"))
            expect(["CONSUMABLE", "AUTO_RENEWABLE"]).toStrictEqual(parsedQueryParameters.getAll("productType"))
            expect("ASCENDING").toBe(parsedQueryParameters.get("sort"))
            expect(["sub_group_id", "sub_group_id_2"]).toStrictEqual(parsedQueryParameters.getAll("subscriptionGroupIdentifier"))
            expect("FAMILY_SHARED").toBe(parsedQueryParameters.get("inAppOwnershipType"))
            expect("false").toBe(parsedQueryParameters.get("revoked"))
            expect(requestBody).toBeUndefined()
        });

        const request: TransactionHistoryRequest = {
            sort: Order.ASCENDING,
            productTypes: [ProductType.CONSUMABLE, ProductType.AUTO_RENEWABLE],
            endDate: 123456,
            startDate: 123455,
            revoked: false,
            inAppOwnershipType: InAppOwnershipType.FAMILY_SHARED,
            productIds: ["com.example.1", "com.example.2"],
            subscriptionGroupIdentifiers: ["sub_group_id", "sub_group_id_2"]
        }

        const historyResponse = await client.getTransactionHistory("1234", "revision_input", request, GetTransactionHistoryVersion.V1);

        expect(historyResponse).toBeTruthy()
        expect("revision_output").toBe(historyResponse.revision)
        expect(historyResponse.hasMore).toBe(true)
        expect("com.example").toBe(historyResponse.bundleId)
        expect(323232).toBe(historyResponse.appAppleId)
        expect(Environment.LOCAL_TESTING).toBe(historyResponse.environment)
        expect(["signed_transaction_value", "signed_transaction_value2"]).toStrictEqual(historyResponse.signedTransactions)
    })

    it('calls getTransactionHistory V2', async () => {
        const client = getClientWithBody("tests/resources/models/transactionHistoryResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
             expect("GET").toBe(method)
             expect("/inApps/v2/history/1234").toBe(path)
             expect("revision_input").toBe(parsedQueryParameters.get("revision"))
             expect("123455").toBe(parsedQueryParameters.get("startDate"))
             expect("123456").toBe(parsedQueryParameters.get("endDate"))
             expect(["com.example.1", "com.example.2"]).toStrictEqual(parsedQueryParameters.getAll("productId"))
             expect(["CONSUMABLE", "AUTO_RENEWABLE"]).toStrictEqual(parsedQueryParameters.getAll("productType"))
             expect("ASCENDING").toBe(parsedQueryParameters.get("sort"))
             expect(["sub_group_id", "sub_group_id_2"]).toStrictEqual(parsedQueryParameters.getAll("subscriptionGroupIdentifier"))
             expect("FAMILY_SHARED").toBe(parsedQueryParameters.get("inAppOwnershipType"))
             expect("false").toBe(parsedQueryParameters.get("revoked"))
             expect(requestBody).toBeUndefined()
         });
 
         const request: TransactionHistoryRequest = {
             sort: Order.ASCENDING,
             productTypes: [ProductType.CONSUMABLE, ProductType.AUTO_RENEWABLE],
             endDate: 123456,
             startDate: 123455,
             revoked: false,
             inAppOwnershipType: InAppOwnershipType.FAMILY_SHARED,
             productIds: ["com.example.1", "com.example.2"],
             subscriptionGroupIdentifiers: ["sub_group_id", "sub_group_id_2"]
         }
 
         const historyResponse = await client.getTransactionHistory("1234", "revision_input", request, GetTransactionHistoryVersion.V2);
 
         expect(historyResponse).toBeTruthy()
         expect("revision_output").toBe(historyResponse.revision)
         expect(historyResponse.hasMore).toBe(true)
         expect("com.example").toBe(historyResponse.bundleId)
         expect(323232).toBe(historyResponse.appAppleId)
         expect(Environment.LOCAL_TESTING).toBe(historyResponse.environment)
         expect(["signed_transaction_value", "signed_transaction_value2"]).toStrictEqual(historyResponse.signedTransactions)
     })

    it('calls getTransactionInfo', async () => {
       const client = getClientWithBody("tests/resources/models/transactionInfoResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/inApps/v1/transactions/1234").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        const transactionInfoResponse = await client.getTransactionInfo("1234");

        expect(transactionInfoResponse).toBeTruthy()
        expect("signed_transaction_info_value").toBe(transactionInfoResponse.signedTransactionInfo)
    })

    it('calls lookUpOrderId', async () => {
       const client = getClientWithBody("tests/resources/models/lookupOrderIdResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/inApps/v1/lookup/W002182").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        const orderLookupResponse = await client.lookUpOrderId("W002182");

        expect(orderLookupResponse).toBeTruthy()
        expect(OrderLookupStatus.INVALID).toBe(orderLookupResponse.status)
        expect(["signed_transaction_one", "signed_transaction_two"]).toStrictEqual(orderLookupResponse.signedTransactions)
    })

    it('calls requestTestNotification', async () => {
       const client = getClientWithBody("tests/resources/models/requestTestNotificationResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("POST").toBe(method)
            expect("/inApps/v1/notifications/test").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        const sendTestNotificationResponse = await client.requestTestNotification();

        expect(sendTestNotificationResponse).toBeTruthy()
        expect("ce3af791-365e-4c60-841b-1674b43c1609").toBe(sendTestNotificationResponse.testNotificationToken)
    })

    it('calls sendConsumptionData', async () => {
       const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/transactions/consumption/49571273").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)

            expect(requestBody).toBeTruthy()
            expect(typeof requestBody).toBe('string')
            const body = JSON.parse(requestBody as string)
            expect(body.customerConsented).toBe(true)
            expect(1).toBe(body.consumptionStatus)
            expect(2).toBe(body.platform)
            expect(body.sampleContentProvided).toBe(false)
            expect(3).toBe(body.deliveryStatus)
            expect("7389a31a-fb6d-4569-a2a6-db7d85d84813").toBe(body.appAccountToken)
            expect(4).toBe(body.accountTenure)
            expect(5).toBe(body.playTime)
            expect(6).toBe(body.lifetimeDollarsRefunded)
            expect(7).toBe(body.lifetimeDollarsPurchased)
            expect(4).toBe(body.userStatus)
            expect(3).toBe(body.refundPreference)
        });

        const consumptionRequest: ConsumptionRequestV1 = {
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
        }

        client.sendConsumptionData("49571273", consumptionRequest);
    })

    it('calls sendConsumptionInformation with all fields', async () => {
       const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v2/transactions/consumption/49571273").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)

            expect(requestBody).toBeTruthy()
            expect(typeof requestBody).toBe('string')
            const body = JSON.parse(requestBody as string)
            expect(body.customerConsented).toBe(true)
            expect(50000).toBe(body.consumptionPercentage)
            expect("DELIVERED").toBe(body.deliveryStatus)
            expect("GRANT_FULL").toBe(body.refundPreference)
            expect(body.sampleContentProvided).toBe(false)
        });

        const consumptionRequest: ConsumptionRequest = {
            customerConsented: true,
            consumptionPercentage: 50000,
            deliveryStatus: DeliveryStatus.DELIVERED,
            refundPreference: RefundPreference.GRANT_FULL,
            sampleContentProvided: false
        }

        client.sendConsumptionInformation("49571273", consumptionRequest);
    })

    it('calls sendConsumptionInformation with only required fields', async () => {
       const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v2/transactions/consumption/49571273").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)

            expect(requestBody).toBeTruthy()
            expect(typeof requestBody).toBe('string')
            const body = JSON.parse(requestBody as string)
            expect(body.customerConsented).toBe(true)
            expect("UNDELIVERED_QUALITY_ISSUE").toBe(body.deliveryStatus)
            expect(body.sampleContentProvided).toBe(true)
            expect(body.consumptionPercentage).toBeUndefined()
            expect(body.refundPreference).toBeUndefined()
        });

        const consumptionRequest: ConsumptionRequest = {
            customerConsented: true,
            deliveryStatus: DeliveryStatus.UNDELIVERED_QUALITY_ISSUE,
            sampleContentProvided: true
        }

        client.sendConsumptionInformation("49571273", consumptionRequest);
    })

    it('calls getTransactionInfo but receives a general internal error', async () => {
        const client = getClientWithBody("tests/resources/models/apiException.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
             expect("GET").toBe(method)
             expect("/inApps/v1/transactions/1234").toBe(path)
             expect(parsedQueryParameters.entries.length).toBe(0)
             expect(requestBody).toBeUndefined()
         }, 500);
 
         try {
            const transactionInfoResponse = await client.getTransactionInfo("1234");
            fail('this test call is expected to throw')
         } catch (e) {
            let error = e as APIException
            expect(error.httpStatusCode).toBe(500)
            expect(error.apiError).toBe(APIError.GENERAL_INTERNAL)
            expect(error.errorMessage).toBe("An unknown error occurred.")
         }
     })

     it('calls getTransactionInfo but receives a rate limit exceeded error', async () => {
        const client = getClientWithBody("tests/resources/models/apiTooManyRequestsException.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
             expect("GET").toBe(method)
             expect("/inApps/v1/transactions/1234").toBe(path)
             expect(parsedQueryParameters.entries.length).toBe(0)
             expect(requestBody).toBeUndefined()
         }, 429);
 
         try {
            const transactionInfoResponse = await client.getTransactionInfo("1234");
            fail('this test call is expected to throw')
         } catch (e) {
            let error = e as APIException
            expect(error.httpStatusCode).toBe(429)
            expect(error.apiError).toBe(APIError.RATE_LIMIT_EXCEEDED)
            expect(error.errorMessage).toBe("Rate limit exceeded.")
         }
     })

     it('calls getTransactionInfo but receives an unknown/new error code', async () => {
        const client = getClientWithBody("tests/resources/models/apiUnknownError.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
             expect("GET").toBe(method)
             expect("/inApps/v1/transactions/1234").toBe(path)
             expect(parsedQueryParameters.entries.length).toBe(0)
             expect(requestBody).toBeUndefined()
         }, 400);
 
         try {
            const transactionInfoResponse = await client.getTransactionInfo("1234");
            fail('this test call is expected to throw')
         } catch (e) {
            let error = e as APIException
            expect(error.httpStatusCode).toBe(400)
            expect(error.apiError).toBe(9990000)
            expect(error.errorMessage).toBe("Testing error.")
         }
     })

     it('calls getTransactionHistory but receives an unknown environment', async () => {
        const client = getClientWithBody("tests/resources/models/transactionHistoryResponseWithMalformedEnvironment.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
        });

        const request: TransactionHistoryRequest = {
            sort: Order.ASCENDING,
            productTypes: [ProductType.CONSUMABLE, ProductType.AUTO_RENEWABLE],
            endDate: 123456,
            startDate: 123455,
            revoked: false,
            inAppOwnershipType: InAppOwnershipType.FAMILY_SHARED,
            productIds: ["com.example.1", "com.example.2"],
            subscriptionGroupIdentifiers: ["sub_group_id", "sub_group_id_2"]
        }

        const historyResponse = await client.getTransactionHistory("1234", "revision_input", request, GetTransactionHistoryVersion.V2);
        expect(historyResponse.environment).toBe("LocalTestingxxx")
     })

     it('calls getTransactionHistory but receives a malformed appAppleId', async () => {
        const client = getClientWithBody("tests/resources/models/transactionHistoryResponseWithMalformedAppAppleId.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
        });

        const request: TransactionHistoryRequest = {
            sort: Order.ASCENDING,
            productTypes: [ProductType.CONSUMABLE, ProductType.AUTO_RENEWABLE],
            endDate: 123456,
            startDate: 123455,
            revoked: false,
            inAppOwnershipType: InAppOwnershipType.FAMILY_SHARED,
            productIds: ["com.example.1", "com.example.2"],
            subscriptionGroupIdentifiers: ["sub_group_id", "sub_group_id_2"]
        }

        try {
            await client.getTransactionHistory("1234", "revision_input", request);
            fail('this test call is expected to throw')
        } catch (e) {
            return;
        }
     })
     
     it('throws an error when the XCODE environment is passed', async () => {
         try {
            const key = getSigningKey()
            new AppStoreServerAPIClient(key, "keyId", "issuerId", "bundleId", Environment.XCODE)
            fail('this test call is expected to throw')
         } catch (e) {
            let error = e as Error
            expect(error.message).toBe("Xcode is not a supported environment for an AppStoreServerAPIClient")
         }
     })

    it('calls setAppAccountToken', async () => {
        const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/transactions/49571273/appAccountToken").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)

            expect(requestBody).toBeTruthy()
            expect(typeof requestBody).toBe('string')
            const body = JSON.parse(requestBody as string)
            expect("7389a31a-fb6d-4569-a2a6-db7d85d84813").toBe(body.appAccountToken)
        });

        const updateAppAccountTokenRequest: UpdateAppAccountTokenRequest = {
            appAccountToken: "7389a31a-fb6d-4569-a2a6-db7d85d84813"
        }

        client.setAppAccountToken("49571273", updateAppAccountTokenRequest);
    })

    it('calls setAppAccountToken but receives an invalid UUID error', async () => {
        const client = getClientWithBody("tests/resources/models/invalidAppAccountTokenUUIDError.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/transactions/49571273/appAccountToken").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)
            expect(requestBody).toBeTruthy()
        }, 400);

        try {
            const updateAppAccountTokenRequest: UpdateAppAccountTokenRequest = {
                appAccountToken: "abc"
            }
            await client.setAppAccountToken("49571273", updateAppAccountTokenRequest);
            fail('this test call is expected to throw')
        } catch (e) {
            let error = e as APIException
            expect(error.httpStatusCode).toBe(400)
            expect(error.apiError).toBe(4000183)
            expect(error.errorMessage).toBe("Invalid request. The app account token field must be a valid UUID.")
        }
    })

    it('calls setAppAccountToken but receives family transaction not supported error', async () => {
        const client = getClientWithBody("tests/resources/models/familyTransactionNotSupportedError.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/transactions/1234/appAccountToken").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)
            expect(requestBody).toBeTruthy()
        }, 400);

        try {
            const updateAppAccountTokenRequest: UpdateAppAccountTokenRequest = {
                appAccountToken: "7389a31a-fb6d-4569-a2a6-db7d85d84813"
            }
            await client.setAppAccountToken("1234", updateAppAccountTokenRequest);
            fail('this test call is expected to throw')
        } catch (e) {
            let error = e as APIException
            expect(error.httpStatusCode).toBe(400)
            expect(error.apiError).toBe(4000185)
            expect(error.errorMessage).toBe("Invalid request. Family Sharing transactions aren't supported by this endpoint.")
        }
    })

    it('calls setAppAccountToken but transactionId not originalTransactionId error', async () => {
        const client = getClientWithBody("tests/resources/models/transactionIdNotOriginalTransactionId.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/transactions/1234/appAccountToken").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)
            expect(requestBody).toBeTruthy()
        }, 400);

        try {
            const updateAppAccountTokenRequest: UpdateAppAccountTokenRequest = {
                appAccountToken: "7389a31a-fb6d-4569-a2a6-db7d85d84813"
            }
            await client.setAppAccountToken("1234", updateAppAccountTokenRequest);
            fail('this test call is expected to throw')
        } catch (e) {
            let error = e as APIException
            expect(error.httpStatusCode).toBe(400)
            expect(error.apiError).toBe(4000187)
            expect(error.errorMessage).toBe("Invalid request. The transaction ID provided is not an original transaction ID.")
        }
    })

    it('calls uploadImage', async () => {
        const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/messaging/image/a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)
            expect(requestBody).toBeTruthy()
            expect(requestBody).toBeInstanceOf(Buffer)
            expect(Buffer.from([1, 2, 3])).toEqual(requestBody)
        });

        await client.uploadImage("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890", Buffer.from([1, 2, 3]))
    })

    it('calls deleteImage', async () => {
        const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("DELETE").toBe(method)
            expect("/inApps/v1/messaging/image/a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        await client.deleteImage("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890")
    })

    it('calls getImageList', async () => {
        const client = getClientWithBody("tests/resources/models/getImageListResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/inApps/v1/messaging/image/list").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        const response = await client.getImageList()

        expect(response).toBeTruthy()
        expect(response.imageIdentifiers).toBeDefined()
        expect(response.imageIdentifiers?.length).toBe(1)
        expect(response.imageIdentifiers?.[0].imageIdentifier).toBe("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890")
        expect(response.imageIdentifiers?.[0].imageState).toBe("APPROVED")
    })

    it('calls uploadMessage', async () => {
        const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/messaging/message/a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)
            expect(requestBody).toBeTruthy()
            expect(typeof requestBody).toBe('string')

            const body = JSON.parse(requestBody as string)
            expect("Header text").toBe(body.header)
            expect("Body text").toBe(body.body)
            expect(body.image).toBeUndefined()
        });

        const uploadMessageRequestBody = {
            header: "Header text",
            body: "Body text"
        }
        await client.uploadMessage("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890", uploadMessageRequestBody)
    })

    it('calls uploadMessage with image', async () => {
        const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/messaging/message/a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)
            expect(requestBody).toBeTruthy()
            expect(typeof requestBody).toBe('string')

            const body = JSON.parse(requestBody as string)
            expect("Header text").toBe(body.header)
            expect("Body text").toBe(body.body)
            expect(body.image).toBeDefined()
            expect("b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901").toBe(body.image.imageIdentifier)
            expect("Alt text").toBe(body.image.altText)
        });

        const uploadMessageRequestBody = {
            header: "Header text",
            body: "Body text",
            image: {
                imageIdentifier: "b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901",
                altText: "Alt text"
            }
        }
        await client.uploadMessage("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890", uploadMessageRequestBody)
    })

    it('calls deleteMessage', async () => {
        const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("DELETE").toBe(method)
            expect("/inApps/v1/messaging/message/a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        await client.deleteMessage("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890")
    })

    it('calls getMessageList', async () => {
        const client = getClientWithBody("tests/resources/models/getMessageListResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/inApps/v1/messaging/message/list").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        const response = await client.getMessageList()

        expect(response).toBeTruthy()
        expect(response.messageIdentifiers).toBeDefined()
        expect(response.messageIdentifiers?.length).toBe(1)
        expect(response.messageIdentifiers?.[0].messageIdentifier).toBe("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890")
        expect(response.messageIdentifiers?.[0].messageState).toBe("APPROVED")
    })

    it('calls configureDefaultMessage', async () => {
        const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/messaging/default/com.example.product/en-US").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)
            expect(requestBody).toBeTruthy()
            expect(typeof requestBody).toBe('string')

            const body = JSON.parse(requestBody as string)
            expect("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890").toBe(body.messageIdentifier)
        });

        const defaultConfigurationRequest = {
            messageIdentifier: "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890"
        }
        await client.configureDefaultMessage("com.example.product", "en-US", defaultConfigurationRequest)
    })

    it('calls deleteDefaultMessage', async () => {
        const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("DELETE").toBe(method)
            expect("/inApps/v1/messaging/default/com.example.product/en-US").toBe(path)
            expect(parsedQueryParameters.entries.length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        await client.deleteDefaultMessage("com.example.product", "en-US")
    })

    it('calls getAppTransactionInfo', async () => {
        const client = getClientWithBody("tests/resources/models/appTransactionInfoResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
             expect("GET").toBe(method)
             expect("/inApps/v1/transactions/appTransactions/1234").toBe(path)
             expect(parsedQueryParameters.entries.length).toBe(0)
             expect(requestBody).toBeUndefined()
         });

         const appTransactionInfoResponse = await client.getAppTransactionInfo("1234");

         expect(appTransactionInfoResponse).toBeTruthy()
         expect("signed_app_transaction_info_value").toBe(appTransactionInfoResponse.signedAppTransactionInfo)
     })

     it('calls getAppTransactionInfo but receives invalid transaction id error', async () => {
         const client = getClientWithBody("tests/resources/models/invalidTransactionIdError.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
              expect("GET").toBe(method)
              expect("/inApps/v1/transactions/appTransactions/invalid_id").toBe(path)
              expect(parsedQueryParameters.entries.length).toBe(0)
              expect(requestBody).toBeUndefined()
          }, 400);

          try {
             const appTransactionInfoResponse = await client.getAppTransactionInfo("invalid_id");
             fail('this test call is expected to throw')
          } catch (e) {
             let error = e as APIException
             expect(error.httpStatusCode).toBe(400)
             expect(error.apiError).toBe(APIError.INVALID_TRANSACTION_ID)
             expect(error.errorMessage).toBe("Invalid transaction id.")
          }
      })

      it('calls getAppTransactionInfo but receives app transaction does not exist error', async () => {
         const client = getClientWithBody("tests/resources/models/appTransactionDoesNotExistError.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
              expect("GET").toBe(method)
              expect("/inApps/v1/transactions/appTransactions/5678").toBe(path)
              expect(parsedQueryParameters.entries.length).toBe(0)
              expect(requestBody).toBeUndefined()
          }, 404);

          try {
             const appTransactionInfoResponse = await client.getAppTransactionInfo("5678");
             fail('this test call is expected to throw')
          } catch (e) {
             let error = e as APIException
             expect(error.httpStatusCode).toBe(404)
             expect(error.apiError).toBe(APIError.APP_TRANSACTION_DOES_NOT_EXIST_ERROR)
             expect(error.errorMessage).toBe("No AppTransaction exists for the customer.")
          }
      })

      it('calls getAppTransactionInfo but receives transaction id not found error', async () => {
         const client = getClientWithBody("tests/resources/models/transactionIdNotFoundError.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
              expect("GET").toBe(method)
              expect("/inApps/v1/transactions/appTransactions/9999").toBe(path)
              expect(parsedQueryParameters.entries.length).toBe(0)
              expect(requestBody).toBeUndefined()
          }, 404);

          try {
             const appTransactionInfoResponse = await client.getAppTransactionInfo("9999");
             fail('this test call is expected to throw')
          } catch (e) {
             let error = e as APIException
             expect(error.httpStatusCode).toBe(404)
             expect(error.apiError).toBe(APIError.TRANSACTION_ID_NOT_FOUND)
             expect(error.errorMessage).toBe("Transaction id not found.")
          }
      })
})