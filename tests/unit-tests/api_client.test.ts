// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { AccountTenure } from "../../models/AccountTenure";
import { AdvancedCommerceEffective } from "../../models/AdvancedCommerceEffective";
import { AdvancedCommerceRefundReason } from "../../models/AdvancedCommerceRefundReason";
import { AdvancedCommerceRefundType } from "../../models/AdvancedCommerceRefundType";
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
import { ImageSize } from "../../models/ImageSize";
import { InAppOwnershipType } from "../../models/InAppOwnershipType";
import { RefundPreference } from "../../models/RefundPreference";
import { RefundPreferenceV1 } from "../../models/RefundPreferenceV1";
import { AdvancedCommerceRequestRefundRequest, AdvancedCommerceSubscriptionCancelRequest, AdvancedCommerceSubscriptionChangeMetadataRequest, AdvancedCommerceSubscriptionMigrateRequest, AdvancedCommerceSubscriptionPriceChangeRequest, AdvancedCommerceSubscriptionRevokeRequest, APIError, APIException, AppStoreServerAPIClient, ExtendReasonCode, ExtendRenewalDateRequest, GetCustomerGroupsResponse, GetGroupMembersResponse, GetTransactionHistoryVersion, GroupEntry, GroupMemberEntry, GroupType, MassExtendRenewalDateRequest, NotificationHistoryRequest, NotificationHistoryResponseItem, Order, OrderLookupStatus, ProductType, Role, RoleEntry, SendAttemptResult, TransactionHistoryRequest } from "../../index";
import { Response } from "node-fetch";

import jsonwebtoken = require('jsonwebtoken');

type callbackType = (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => void

class AppStoreServerAPIClientForTest extends AppStoreServerAPIClient {

    private callback: callbackType
    private body: string
    private statusCode: number
    private responseHeaders: { [key: string]: string }

    public constructor(signingKey: string, keyId: string, issuerId: string, bundleId: string, environment: Environment, callback: callbackType, body: string, statusCode: number, responseHeaders: { [key: string]: string } = {}) {
        super(signingKey, keyId, issuerId, bundleId, environment)
        this.callback = callback
        this.body = body
        this.statusCode = statusCode
        this.responseHeaders = responseHeaders
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
            status: this.statusCode,
            headers: this.responseHeaders
        }))
    }
}

function getClientWithBody(path: string, callback: callbackType, statusCode: number = 200, responseHeaders: { [key: string]: string } = {}): AppStoreServerAPIClient {
    const body = readFile(path)
    return getAppStoreServerAPIClient(body, statusCode, callback, responseHeaders)
}

function getAppStoreServerAPIClient(body: string, statusCode: number, callback: callbackType, responseHeaders: { [key: string]: string } = {}): AppStoreServerAPIClient {
    const key = getSigningKey()
    return new AppStoreServerAPIClientForTest(key, "keyId", "issuerId", "bundleId", Environment.LOCAL_TESTING, callback, body, statusCode, responseHeaders)
}

function getSigningKey(): string {
    return readFile('tests/resources/certs/testSigningKey.p8')
}

describe('The api client ', () => {
    
    it('percent-encodes path parameters', async () => {
        const client = getClientWithBody("tests/resources/models/transactionInfoResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string) => {
            expect("GET").toBe(method)
            expect("/inApps/v1/transactions/..%2F..%2Fv1%2Fnotifications%2Ftest%3Ffoo%3Dbar%23fragment").toBe(path)
            expect(parsedQueryParameters.toString()).toBe("")
        })

        await client.getTransactionInfo("../../v1/notifications/test?foo=bar#fragment")
    })

    it('percent-encodes multiple path parameters', async () => {
        const client = getClientWithBody("tests/resources/models/getDefaultMessageResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string) => {
            expect("GET").toBe(method)
            expect("/inApps/v1/messaging/default/com.example%2Fproduct/en%20US").toBe(path)
        })

        await client.getDefaultMessage("com.example/product", "en US")
    })

    it('rejects dot and empty path parameters', async () => {
        const client = getClientWithBody("tests/resources/models/transactionInfoResponse.json", () => {
            fail()
        })

        for (const pathParameter of ["..", ".", ""]) {
            await expect(client.getTransactionInfo(pathParameter)).rejects.toThrow(Error)
            await expect(client.getDefaultMessage("com.example", pathParameter)).rejects.toThrow(Error)
        }
    })

    it('calls extendRenewalDateForAllActiveSubscribers', async () => {
       const client = getClientWithBody("tests/resources/models/extendRenewalDateForAllActiveSubscribersResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("POST").toBe(method)
            expect("/inApps/v1/subscriptions/extend/mass").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)

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
            expect([...parsedQueryParameters.entries()].length).toBe(0)

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
            expect([...parsedQueryParameters.entries()].length).toBe(0)
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
            expect([...parsedQueryParameters.entries()].length).toBe(0)
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
            expect([...parsedQueryParameters.entries()].length).toBe(0)
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
            expect([...parsedQueryParameters.entries()].length).toBe(0)
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
            expect([...parsedQueryParameters.entries()].length).toBe(0)
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
            expect([...parsedQueryParameters.entries()].length).toBe(0)

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

        await client.sendConsumptionData("49571273", consumptionRequest);
    })

    it('calls sendConsumptionData with only required fields and an empty appAccountToken', async () => {
       const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/transactions/consumption/49571273").toBe(path)

            expect(requestBody).toBeTruthy()
            expect(typeof requestBody).toBe('string')
            const body = JSON.parse(requestBody as string)
            expect(body.customerConsented).toBe(true)
            expect(0).toBe(body.consumptionStatus)
            expect(0).toBe(body.platform)
            expect(body.sampleContentProvided).toBe(false)
            expect(0).toBe(body.deliveryStatus)
            expect("").toBe(body.appAccountToken)
            expect(0).toBe(body.accountTenure)
            expect(0).toBe(body.playTime)
            expect(0).toBe(body.lifetimeDollarsRefunded)
            expect(0).toBe(body.lifetimeDollarsPurchased)
            expect(0).toBe(body.userStatus)
            expect(body.refundPreference).toBeUndefined()
        });

        const consumptionRequest: ConsumptionRequestV1 = {
            customerConsented: true,
            consumptionStatus: ConsumptionStatus.UNDECLARED,
            platform: Platform.UNDECLARED,
            sampleContentProvided: false,
            deliveryStatus: DeliveryStatusV1.DELIVERED_AND_WORKING_PROPERLY,
            appAccountToken: "",
            accountTenure: AccountTenure.UNDECLARED,
            playTime: PlayTime.UNDECLARED,
            lifetimeDollarsRefunded: LifetimeDollarsRefunded.UNDECLARED,
            lifetimeDollarsPurchased: LifetimeDollarsPurchased.UNDECLARED,
            userStatus: UserStatus.UNDECLARED
        }

        await client.sendConsumptionData("49571273", consumptionRequest);
    })

    it.each([
        ['omits it', {}],
        ['sets it to undefined', { appAccountToken: undefined }],
        ['sets it to null', { appAccountToken: null }],
    ])('calls sendConsumptionData with an empty appAccountToken when the caller %s', async (_, appAccountToken) => {
        let body: any = undefined
        const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/transactions/consumption/49571273").toBe(path)
            body = JSON.parse(requestBody as string)
        });

        const consumptionRequest = {
            customerConsented: true,
            consumptionStatus: ConsumptionStatus.UNDECLARED,
            platform: Platform.UNDECLARED,
            sampleContentProvided: false,
            deliveryStatus: DeliveryStatusV1.DELIVERED_AND_WORKING_PROPERLY,
            ...appAccountToken,
            accountTenure: AccountTenure.UNDECLARED,
            playTime: PlayTime.UNDECLARED,
            lifetimeDollarsRefunded: LifetimeDollarsRefunded.UNDECLARED,
            lifetimeDollarsPurchased: LifetimeDollarsPurchased.UNDECLARED,
            userStatus: UserStatus.UNDECLARED
        } as unknown as ConsumptionRequestV1

        await client.sendConsumptionData("49571273", consumptionRequest);

        expect(body).toBeTruthy()
        expect(body.appAccountToken).toBe("")
        expect(body.customerConsented).toBe(true)
        expect(body.userStatus).toBe(0)
        expect(consumptionRequest).toStrictEqual(expect.objectContaining(appAccountToken))
        expect('appAccountToken' in consumptionRequest).toBe('appAccountToken' in appAccountToken)
    })

    it('calls sendConsumptionInformation with all fields', async () => {
       const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v2/transactions/consumption/49571273").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)

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

        await client.sendConsumptionInformation("49571273", consumptionRequest);
    })

    it('calls sendConsumptionInformation with only required fields', async () => {
       const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v2/transactions/consumption/49571273").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)

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

        await client.sendConsumptionInformation("49571273", consumptionRequest);
    })

    it('calls getTransactionInfo but receives a general internal error', async () => {
        const client = getClientWithBody("tests/resources/models/apiException.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
             expect("GET").toBe(method)
             expect("/inApps/v1/transactions/1234").toBe(path)
             expect([...parsedQueryParameters.entries()].length).toBe(0)
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
            expect(error.name).toBe("APIException")
         }
     })

     it('calls getTransactionInfo but receives a rate limit exceeded error', async () => {
        const client = getClientWithBody("tests/resources/models/apiTooManyRequestsException.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
             expect("GET").toBe(method)
             expect("/inApps/v1/transactions/1234").toBe(path)
             expect([...parsedQueryParameters.entries()].length).toBe(0)
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
            expect(error.retryAfter).toBeNull()
         }
     })

     it('calls getTransactionInfo but receives a rate limit exceeded error with a Retry-After header', async () => {
        const client = getClientWithBody("tests/resources/models/apiTooManyRequestsException.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
             expect("GET").toBe(method)
             expect("/inApps/v1/transactions/1234").toBe(path)
         }, 429, { 'Retry-After': '1698148900000' });

         try {
            await client.getTransactionInfo("1234");
            fail('this test call is expected to throw')
         } catch (e) {
            let error = e as APIException
            expect(error.httpStatusCode).toBe(429)
            expect(error.apiError).toBe(APIError.RATE_LIMIT_EXCEEDED)
            expect(error.retryAfter).toBe(1698148900000)
            expect(error.headers['retry-after']).toEqual(['1698148900000'])
         }
     })

     it('calls getTransactionInfo but receives a rate limit exceeded error with a malformed Retry-After header', async () => {
        const rawRetryAfterValues = ['', ' ', 'not-a-number', '1698148900000.0', '+1698148900000', '-1698148900000', '1698148900000abc', '99999999999999999999', 'Wed, 21 Oct 2015 07:28:00 GMT']

        for (const rawRetryAfter of rawRetryAfterValues) {
            const client = getClientWithBody("tests/resources/models/apiTooManyRequestsException.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            }, 429, { 'Retry-After': rawRetryAfter });

            try {
                await client.getTransactionInfo("1234");
                fail('this test call is expected to throw')
            } catch (e) {
                let error = e as APIException
                expect(error.httpStatusCode).toBe(429)
                expect(error.retryAfter).toBeNull()
                expect(error.headers['retry-after']).toEqual([rawRetryAfter])
            }
        }
     })

     it('calls getTransactionInfo but receives an unknown/new error code', async () => {
        const client = getClientWithBody("tests/resources/models/apiUnknownError.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
             expect("GET").toBe(method)
             expect("/inApps/v1/transactions/1234").toBe(path)
             expect([...parsedQueryParameters.entries()].length).toBe(0)
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

        await expect(client.getTransactionHistory("1234", "revision_input", request, GetTransactionHistoryVersion.V2)).rejects.toThrow("Unexpected response body format")
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
            expect([...parsedQueryParameters.entries()].length).toBe(0)

            expect(requestBody).toBeTruthy()
            expect(typeof requestBody).toBe('string')
            const body = JSON.parse(requestBody as string)
            expect("7389a31a-fb6d-4569-a2a6-db7d85d84813").toBe(body.appAccountToken)
        });

        const updateAppAccountTokenRequest: UpdateAppAccountTokenRequest = {
            appAccountToken: "7389a31a-fb6d-4569-a2a6-db7d85d84813"
        }

        await client.setAppAccountToken("49571273", updateAppAccountTokenRequest);
    })

    it('calls setAppAccountToken but receives an invalid UUID error', async () => {
        const client = getClientWithBody("tests/resources/models/invalidAppAccountTokenUUIDError.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/transactions/49571273/appAccountToken").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)
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
            expect([...parsedQueryParameters.entries()].length).toBe(0)
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
            expect([...parsedQueryParameters.entries()].length).toBe(0)
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
            expect([...parsedQueryParameters.entries()].length).toBe(0)
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
            expect([...parsedQueryParameters.entries()].length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        await client.deleteImage("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890")
    })

    it('calls getImageList', async () => {
        const client = getClientWithBody("tests/resources/models/getImageListResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/inApps/v1/messaging/image/list").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        const response = await client.getImageList()

        expect(response).toBeTruthy()
        expect(response.imageIdentifiers).toBeDefined()
        expect(response.imageIdentifiers?.length).toBe(1)
        expect(response.imageIdentifiers?.[0].imageIdentifier).toBe("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890")
        expect(response.imageIdentifiers?.[0].imageState).toBe("APPROVED")
        expect(response.imageIdentifiers?.[0].imageSize).toBe("FULL_SIZE")
    })

    it('calls uploadMessage', async () => {
        const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/messaging/message/a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)
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
            expect([...parsedQueryParameters.entries()].length).toBe(0)
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
            expect([...parsedQueryParameters.entries()].length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        await client.deleteMessage("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890")
    })

    it('calls getMessageList', async () => {
        const client = getClientWithBody("tests/resources/models/getMessageListResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/inApps/v1/messaging/message/list").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)
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
            expect([...parsedQueryParameters.entries()].length).toBe(0)
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
            expect([...parsedQueryParameters.entries()].length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        await client.deleteDefaultMessage("com.example.product", "en-US")
    })

    it('calls getDefaultMessage', async () => {
        const client = getClientWithBody("tests/resources/models/getDefaultMessageResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/inApps/v1/messaging/default/com.example.product/en-US").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        const response = await client.getDefaultMessage("com.example.product", "en-US")

        expect(response).toBeTruthy()
        expect(response.messageIdentifier).toBe("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890")
    })

    it('calls uploadImage with imageSize', async () => {
        const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/messaging/image/a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890").toBe(path)
            expect(parsedQueryParameters.get("imageSize")).toBe("FULL_SIZE")
            expect(requestBody).toBeTruthy()
            expect(requestBody).toBeInstanceOf(Buffer)
            expect(Buffer.from([1, 2, 3])).toEqual(requestBody)
        });

        await client.uploadImage("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890", Buffer.from([1, 2, 3]), "FULL_SIZE")
    })

    it('calls uploadImage with an ImageSize value', async () => {
        const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/messaging/image/a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890").toBe(path)
            expect([...parsedQueryParameters.entries()]).toStrictEqual([["imageSize", "BULLET_POINT"]])
            expect(Buffer.from([1, 2, 3])).toEqual(requestBody)
        });

        await client.uploadImage("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890", Buffer.from([1, 2, 3]), ImageSize.BULLET_POINT)
    })

    it('calls configureRealtimeURL', async () => {
        const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/messaging/realtime/url").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)
            expect(requestBody).toBeTruthy()
            expect(typeof requestBody).toBe('string')

            const body = JSON.parse(requestBody as string)
            expect("https://example.com/realtime").toBe(body.realtimeURL)
        });

        await client.configureRealtimeURL({ realtimeURL: "https://example.com/realtime" })
    })

    it('calls deleteRealtimeURL', async () => {
        const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("DELETE").toBe(method)
            expect("/inApps/v1/messaging/realtime/url").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        await client.deleteRealtimeURL()
    })

    it('calls getRealtimeURL', async () => {
        const client = getClientWithBody("tests/resources/models/getRealtimeUrlResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/inApps/v1/messaging/realtime/url").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        const response = await client.getRealtimeURL()

        expect(response).toBeTruthy()
        expect(response.realtimeURL).toBe("https://example.com/realtime")
    })

    it('calls uploadMessage with bullet points', async () => {
        const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v1/messaging/message/a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)
            expect(requestBody).toBeTruthy()
            expect(typeof requestBody).toBe('string')

            const body = JSON.parse(requestBody as string)
            expect("Header text").toBe(body.header)
            expect("Body text").toBe(body.body)
            expect("ABOVE_IMAGE").toBe(body.headerPosition)
            expect(body.image).toBeDefined()
            expect("b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901").toBe(body.image.imageIdentifier)
            expect("Alt text").toBe(body.image.altText)
            expect(body.bulletPoints).toBeDefined()
            expect(body.bulletPoints.length).toBe(1)
            expect("Bullet text").toBe(body.bulletPoints[0].text)
            expect("c3d4e5f6-a7b8-9012-c3d4-e5f6a7b89012").toBe(body.bulletPoints[0].imageIdentifier)
            expect("Bullet alt text").toBe(body.bulletPoints[0].altText)
        });

        const uploadMessageRequestBody = {
            header: "Header text",
            body: "Body text",
            headerPosition: "ABOVE_IMAGE",
            image: {
                imageIdentifier: "b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901",
                altText: "Alt text"
            },
            bulletPoints: [
                {
                    text: "Bullet text",
                    imageIdentifier: "c3d4e5f6-a7b8-9012-c3d4-e5f6a7b89012",
                    altText: "Bullet alt text"
                }
            ]
        }
        await client.uploadMessage("a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890", uploadMessageRequestBody)
    })

    it('calls initiatePerformanceTest', async () => {
        const client = getClientWithBody("tests/resources/models/performanceTestResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("POST").toBe(method)
            expect("/inApps/v1/messaging/performanceTest").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)
            expect(requestBody).toBeTruthy()
            expect(typeof requestBody).toBe('string')

            const body = JSON.parse(requestBody as string)
            expect("70000500092808").toBe(body.originalTransactionId)
        });

        const response = await client.initiatePerformanceTest({ originalTransactionId: "70000500092808" })

        expect(response).toBeTruthy()
        expect(response.requestId).toBe("c4b87a1d-2e3f-4a5b-9c6d-7e8f9a0b1c2d")
        expect(response.config).toBeTruthy()
        expect(response.config.maxConcurrentRequests).toBe(10)
        expect(response.config.totalRequests).toBe(100)
        expect(response.config.totalDuration).toBe(60000)
        expect(response.config.responseTimeThreshold).toBe(500)
        expect(response.config.successRateThreshold).toBe(95)
    })

    it('calls getPerformanceTestResults with the request identifier in lowercase', async () => {
        let calledPath: string | undefined = undefined
        const client = getClientWithBody("tests/resources/models/performanceTestResultResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            calledPath = path
        });

        await client.getPerformanceTestResults("C4B87A1D-2E3F-4A5B-9C6D-7E8F9A0B1C2D")

        expect(calledPath).toBe("/inApps/v1/messaging/performanceTest/result/c4b87a1d-2e3f-4a5b-9c6d-7e8f9a0b1c2d")
    })

    it('calls getPerformanceTestResults', async () => {
        const client = getClientWithBody("tests/resources/models/performanceTestResultResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/inApps/v1/messaging/performanceTest/result/c4b87a1d-2e3f-4a5b-9c6d-7e8f9a0b1c2d").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        const response = await client.getPerformanceTestResults("c4b87a1d-2e3f-4a5b-9c6d-7e8f9a0b1c2d")

        expect(response).toBeTruthy()
        expect(response.config).toBeTruthy()
        expect(response.config.maxConcurrentRequests).toBe(10)
        expect(response.config.totalRequests).toBe(100)
        expect(response.config.totalDuration).toBe(60000)
        expect(response.config.responseTimeThreshold).toBe(500)
        expect(response.config.successRateThreshold).toBe(95)
        expect(response.target).toBe("https://example.com/retention")
        expect(response.result).toBe("PASS")
        expect(response.successRate).toBe(98)
        expect(response.numPending).toBe(0)
        expect(response.responseTimes).toBeTruthy()
        expect(response.responseTimes.average).toBe(120)
        expect(response.responseTimes.p50).toBe(100)
        expect(response.responseTimes.p90).toBe(200)
        expect(response.responseTimes.p95).toBe(250)
        expect(response.responseTimes.p99).toBe(400)
        expect(response.failures).toBeTruthy()
        expect(response.failures["TIMED_OUT"]).toBe(1)
        expect(response.failures["NO_RESPONSE"]).toBe(1)
    })

    it('calls getAppTransactionInfo', async () => {
        const client = getClientWithBody("tests/resources/models/appTransactionInfoResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
             expect("GET").toBe(method)
             expect("/inApps/v1/transactions/appTransactions/1234").toBe(path)
             expect([...parsedQueryParameters.entries()].length).toBe(0)
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
              expect([...parsedQueryParameters.entries()].length).toBe(0)
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
              expect([...parsedQueryParameters.entries()].length).toBe(0)
              expect(requestBody).toBeUndefined()
          }, 404);

          try {
             const appTransactionInfoResponse = await client.getAppTransactionInfo("5678");
             fail('this test call is expected to throw')
          } catch (e) {
             let error = e as APIException
             expect(error.httpStatusCode).toBe(404)
             expect(error.apiError).toBe(APIError.APP_TRANSACTION_DOES_NOT_EXIST)
             expect(error.errorMessage).toBe("No AppTransaction exists for the customer.")
          }
      })

      it('calls getAppTransactionInfo but receives transaction id not found error', async () => {
         const client = getClientWithBody("tests/resources/models/transactionIdNotFoundError.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
              expect("GET").toBe(method)
              expect("/inApps/v1/transactions/appTransactions/9999").toBe(path)
              expect([...parsedQueryParameters.entries()].length).toBe(0)
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

    it('calls finishTransaction', async () => {
        const client = getAppStoreServerAPIClient("", 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("POST").toBe(method)
            expect("/inApps/v1/transactions/1234/finish").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        await client.finishTransaction("1234");
    })

    it('calls changeSubscriptionPrice', async () => {
        const client = getClientWithBody("tests/resources/models/advancedCommerceSubscriptionPriceChangeResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("POST").toBe(method)
            expect("/advancedCommerce/v1/subscription/changePrice/4124214").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)

            expect(requestBody).toBeTruthy()
            const body = JSON.parse(requestBody as string)
            expect("7c80bb86-f892-4b21-a919-1357811d6c4f").toBe(body.requestInfo.requestReferenceId)
            expect("USD").toBe(body.currency)
            expect("USA").toBe(body.storefront)
            expect("AD_FREE_1M").toBe(body.items[0].SKU)
            expect(12990).toBe(body.items[0].price)
            expect(["ADVANCED_FEATURES_1M"]).toStrictEqual(body.items[0].dependentSKUs)
        });

        const subscriptionPriceChangeRequest: AdvancedCommerceSubscriptionPriceChangeRequest = {
            requestInfo: {
                requestReferenceId: "7c80bb86-f892-4b21-a919-1357811d6c4f"
            },
            items: [
                {
                    SKU: "AD_FREE_1M",
                    price: 12990,
                    dependentSKUs: ["ADVANCED_FEATURES_1M"]
                }
            ],
            currency: "USD",
            storefront: "USA"
        }

        const response = await client.changeSubscriptionPrice("4124214", subscriptionPriceChangeRequest);

        expect(response).toBeTruthy()
        expect("signed_renewal_info").toBe(response.signedRenewalInfo)
        expect("signed_transaction_info").toBe(response.signedTransactionInfo)
    })

    it('calls cancelSubscription', async () => {
        const client = getClientWithBody("tests/resources/models/advancedCommerceSubscriptionCancelResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("POST").toBe(method)
            expect("/advancedCommerce/v1/subscription/cancel/4124214").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)

            expect(requestBody).toBeTruthy()
            const body = JSON.parse(requestBody as string)
            expect("932c6903-0ab8-4469-9f21-015f6fab013c").toBe(body.requestInfo.requestReferenceId)
            expect("USA").toBe(body.storefront)
        });

        const subscriptionCancelRequest: AdvancedCommerceSubscriptionCancelRequest = {
            requestInfo: {
                requestReferenceId: "932c6903-0ab8-4469-9f21-015f6fab013c"
            },
            storefront: "USA"
        }

        const response = await client.cancelSubscription("4124214", subscriptionCancelRequest);

        expect(response).toBeTruthy()
        expect("signed_renewal_info").toBe(response.signedRenewalInfo)
        expect("signed_transaction_info").toBe(response.signedTransactionInfo)
    })

    it('calls revokeSubscription', async () => {
        const client = getClientWithBody("tests/resources/models/advancedCommerceSubscriptionRevokeResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("POST").toBe(method)
            expect("/advancedCommerce/v1/subscription/revoke/4124214").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)

            expect(requestBody).toBeTruthy()
            const body = JSON.parse(requestBody as string)
            expect("932c6903-0ab8-4469-9f21-015f6fab013c").toBe(body.requestInfo.requestReferenceId)
            expect("UNINTENDED_PURCHASE").toBe(body.refundReason)
            expect(true).toBe(body.refundRiskingPreference)
            expect("PRORATED").toBe(body.refundType)
            expect("USA").toBe(body.storefront)
        });

        const subscriptionRevokeRequest: AdvancedCommerceSubscriptionRevokeRequest = {
            requestInfo: {
                requestReferenceId: "932c6903-0ab8-4469-9f21-015f6fab013c"
            },
            refundReason: AdvancedCommerceRefundReason.UNINTENDED_PURCHASE,
            refundRiskingPreference: true,
            refundType: AdvancedCommerceRefundType.PRORATED,
            storefront: "USA"
        }

        const response = await client.revokeSubscription("4124214", subscriptionRevokeRequest);

        expect(response).toBeTruthy()
        expect("signed_renewal_info").toBe(response.signedRenewalInfo)
        expect("signed_transaction_info").toBe(response.signedTransactionInfo)
    })

    it('calls requestTransactionRefund', async () => {
        const client = getClientWithBody("tests/resources/models/advancedCommerceRequestRefundResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("POST").toBe(method)
            expect("/advancedCommerce/v1/transaction/requestRefund/4124214").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)

            expect(requestBody).toBeTruthy()
            const body = JSON.parse(requestBody as string)
            expect("932c6903-0ab8-4469-9f21-015f6fab013c").toBe(body.requestInfo.requestReferenceId)
            expect(true).toBe(body.refundRiskingPreference)
            expect("USD").toBe(body.currency)
            expect("USA").toBe(body.storefront)
            expect("AD_FREE_1M").toBe(body.items[0].SKU)
            expect("UNSATISFIED_WITH_PURCHASE").toBe(body.items[0].refundReason)
            expect("FULL").toBe(body.items[0].refundType)
            expect(true).toBe(body.items[0].revoke)
        });

        const requestRefundRequest: AdvancedCommerceRequestRefundRequest = {
            requestInfo: {
                requestReferenceId: "932c6903-0ab8-4469-9f21-015f6fab013c"
            },
            items: [
                {
                    SKU: "AD_FREE_1M",
                    refundReason: AdvancedCommerceRefundReason.UNSATISFIED_WITH_PURCHASE,
                    refundType: AdvancedCommerceRefundType.FULL,
                    revoke: true
                }
            ],
            refundRiskingPreference: true,
            currency: "USD",
            storefront: "USA"
        }

        const response = await client.requestTransactionRefund("4124214", requestRefundRequest);

        expect(response).toBeTruthy()
        expect("signed_transaction_info_value").toBe(response.signedTransactionInfo)
        expect(response.signedRenewalInfo).toBeUndefined()
    })

    it('calls changeSubscriptionMetadata', async () => {
        const client = getClientWithBody("tests/resources/models/advancedCommerceSubscriptionChangeMetadataResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("POST").toBe(method)
            expect("/advancedCommerce/v1/subscription/changeMetadata/4124214").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)

            expect(requestBody).toBeTruthy()
            const body = JSON.parse(requestBody as string)
            expect("932c6903-0ab8-4469-9f21-015f6fab013c").toBe(body.requestInfo.requestReferenceId)
            expect("NEXT_BILL_CYCLE").toBe(body.descriptors.effective)
            expect("Remove ads and unlock advanced features.").toBe(body.descriptors.description)
            expect("Ad-free package").toBe(body.descriptors.displayName)
            expect("AD_FREE_1M").toBe(body.items[0].currentSKU)
            expect("NEXT_BILL_CYCLE").toBe(body.items[0].effective)
            expect("AD_FREE_1M_V2").toBe(body.items[0].SKU)
            expect("USA").toBe(body.storefront)
            expect("C003-00-1").toBe(body.taxCode)
        });

        const subscriptionChangeMetadataRequest: AdvancedCommerceSubscriptionChangeMetadataRequest = {
            requestInfo: {
                requestReferenceId: "932c6903-0ab8-4469-9f21-015f6fab013c"
            },
            descriptors: {
                effective: AdvancedCommerceEffective.NEXT_BILL_CYCLE,
                description: "Remove ads and unlock advanced features.",
                displayName: "Ad-free package"
            },
            items: [
                {
                    currentSKU: "AD_FREE_1M",
                    effective: AdvancedCommerceEffective.NEXT_BILL_CYCLE,
                    SKU: "AD_FREE_1M_V2"
                }
            ],
            storefront: "USA",
            taxCode: "C003-00-1"
        }

        const response = await client.changeSubscriptionMetadata("4124214", subscriptionChangeMetadataRequest);

        expect(response).toBeTruthy()
        expect("signed_renewal_info").toBe(response.signedRenewalInfo)
        expect("signed_transaction_info").toBe(response.signedTransactionInfo)
    })

    it('calls migrateSubscriptionToAdvancedCommerceAPI', async () => {
        const client = getClientWithBody("tests/resources/models/advancedCommerceSubscriptionMigrateResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("POST").toBe(method)
            expect("/advancedCommerce/v1/subscription/migrate/4124214").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)

            expect(requestBody).toBeTruthy()
            const body = JSON.parse(requestBody as string)
            expect("932c6903-0ab8-4469-9f21-015f6fab013c").toBe(body.requestInfo.requestReferenceId)
            expect("Remove ads and unlock advanced features.").toBe(body.descriptors.description)
            expect("Ad-free package").toBe(body.descriptors.displayName)
            expect("AD_FREE_1M").toBe(body.items[0].SKU)
            expect("Remove ads for the service.").toBe(body.items[0].description)
            expect("Ad-free monthly plan").toBe(body.items[0].displayName)
            expect("com.example.base").toBe(body.targetProductId)
            expect("C003-00-1").toBe(body.taxCode)
            expect("USA").toBe(body.storefront)
        });

        const subscriptionMigrateRequest: AdvancedCommerceSubscriptionMigrateRequest = {
            requestInfo: {
                requestReferenceId: "932c6903-0ab8-4469-9f21-015f6fab013c"
            },
            descriptors: {
                description: "Remove ads and unlock advanced features.",
                displayName: "Ad-free package"
            },
            items: [
                {
                    SKU: "AD_FREE_1M",
                    description: "Remove ads for the service.",
                    displayName: "Ad-free monthly plan"
                }
            ],
            targetProductId: "com.example.base",
            taxCode: "C003-00-1",
            storefront: "USA"
        }

        const response = await client.migrateSubscriptionToAdvancedCommerceAPI("4124214", subscriptionMigrateRequest);

        expect(response).toBeTruthy()
        expect("signed_renewal_info_value").toBe(response.signedRenewalInfo)
        expect("signed_transaction_info_value").toBe(response.signedTransactionInfo)
    })

    it('calls getRefundHistory without a revision', async () => {
        const client = getClientWithBody("tests/resources/models/getRefundHistoryResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/inApps/v2/refund/lookup/555555").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        const refundHistoryResponse = await client.getRefundHistory("555555", undefined as unknown as string | null);

        expect(refundHistoryResponse).toBeTruthy()
    })

    it('calls getTransactionHistory without a version and uses V1', async () => {
        const client = getClientWithBody("tests/resources/models/transactionHistoryResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/inApps/v1/history/1234").toBe(path)
            expect([...parsedQueryParameters.entries()].length).toBe(0)
            expect(requestBody).toBeUndefined()
        });

        const historyResponse = await client.getTransactionHistory("1234", null, {});

        expect(historyResponse).toBeTruthy()
    })

    it('calls getTransactionInfo but receives an error without an error code', async () => {
        const client = getAppStoreServerAPIClient("", 500, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
        });

        try {
            await client.getTransactionInfo("1234");
            fail('this test call is expected to throw')
        } catch (e) {
            let error = e as APIException
            expect(error).toBeInstanceOf(APIException)
            expect(error.httpStatusCode).toBe(500)
            expect(error.apiError).toBeNull()
            expect(error.errorMessage).toBeNull()
        }
    })

    it('calls sendConsumptionInformation but receives a consumption percentage out of range error', async () => {
        const client = getAppStoreServerAPIClient(JSON.stringify({ errorCode: 4000207, errorMessage: "Invalid request. The consumption percentage is outside the valid range." }), 400, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("PUT").toBe(method)
            expect("/inApps/v2/transactions/consumption/49571273").toBe(path)
        });

        const consumptionRequest: ConsumptionRequest = {
            customerConsented: true,
            consumptionPercentage: 100000,
            deliveryStatus: DeliveryStatus.DELIVERED,
            sampleContentProvided: false
        }

        try {
            await client.sendConsumptionInformation("49571273", consumptionRequest);
            fail('this test call is expected to throw')
        } catch (e) {
            let error = e as APIException
            expect(error.httpStatusCode).toBe(400)
            expect(error.apiError).toBe(APIError.CONSUMPTION_PERCENTAGE_OUT_OF_RANGE)
            expect(error.errorMessage).toBe("Invalid request. The consumption percentage is outside the valid range.")
        }
    })

    it.each([
        ['extendSubscriptionRenewalDate', 'extendByDays 0', (client: AppStoreServerAPIClient) => client.extendSubscriptionRenewalDate("4124214", { extendByDays: 0, extendReasonCode: ExtendReasonCode.CUSTOMER_SATISFACTION, requestIdentifier: "id" })],
        ['extendSubscriptionRenewalDate', 'extendByDays 91', (client: AppStoreServerAPIClient) => client.extendSubscriptionRenewalDate("4124214", { extendByDays: 91, extendReasonCode: ExtendReasonCode.CUSTOMER_SATISFACTION, requestIdentifier: "id" })],
        ['extendSubscriptionRenewalDate', 'a requestIdentifier of 129 characters', (client: AppStoreServerAPIClient) => client.extendSubscriptionRenewalDate("4124214", { extendByDays: 45, extendReasonCode: ExtendReasonCode.CUSTOMER_SATISFACTION, requestIdentifier: "a".repeat(129) })],
        ['extendRenewalDateForAllActiveSubscribers', 'extendByDays 0', (client: AppStoreServerAPIClient) => client.extendRenewalDateForAllActiveSubscribers({ extendByDays: 0, extendReasonCode: ExtendReasonCode.CUSTOMER_SATISFACTION, requestIdentifier: "id", productId: "com.example.productId" })],
        ['extendRenewalDateForAllActiveSubscribers', 'extendByDays 91', (client: AppStoreServerAPIClient) => client.extendRenewalDateForAllActiveSubscribers({ extendByDays: 91, extendReasonCode: ExtendReasonCode.CUSTOMER_SATISFACTION, requestIdentifier: "id", productId: "com.example.productId" })],
        ['extendRenewalDateForAllActiveSubscribers', 'a requestIdentifier of 129 characters', (client: AppStoreServerAPIClient) => client.extendRenewalDateForAllActiveSubscribers({ extendByDays: 45, extendReasonCode: ExtendReasonCode.CUSTOMER_SATISFACTION, requestIdentifier: "a".repeat(129), productId: "com.example.productId" })],
        ['extendRenewalDateForAllActiveSubscribers', 'a storefront country code of 4 characters', (client: AppStoreServerAPIClient) => client.extendRenewalDateForAllActiveSubscribers({ extendByDays: 45, extendReasonCode: ExtendReasonCode.CUSTOMER_SATISFACTION, requestIdentifier: "id", productId: "com.example.productId", storefrontCountryCodes: ["USA", "ABCD"] })],
        ['sendConsumptionInformation', 'consumptionPercentage -1', (client: AppStoreServerAPIClient) => client.sendConsumptionInformation("49571273", { customerConsented: true, consumptionPercentage: -1, deliveryStatus: DeliveryStatus.DELIVERED, sampleContentProvided: false })],
        ['sendConsumptionInformation', 'consumptionPercentage 100001', (client: AppStoreServerAPIClient) => client.sendConsumptionInformation("49571273", { customerConsented: true, consumptionPercentage: 100001, deliveryStatus: DeliveryStatus.DELIVERED, sampleContentProvided: false })],
    ] as [string, string, (client: AppStoreServerAPIClient) => Promise<unknown>][])('does not send a %s request with %s (a documented limit)', async (_, __, call) => {
        let requests = 0
        const client = getAppStoreServerAPIClient("", 200, () => { requests++ });
        await expect(call(client)).rejects.toThrow("Unexpected request body format")
        expect(requests).toBe(0)
    })

    it('calls changeSubscriptionPrice but receives a subscription does not exist error', async () => {
        const client = getAppStoreServerAPIClient(JSON.stringify({ errorCode: 4030008, errorMessage: "The subscription doesn't exist." }), 403, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("POST").toBe(method)
            expect("/advancedCommerce/v1/subscription/changePrice/4124214").toBe(path)
        });

        const subscriptionPriceChangeRequest: AdvancedCommerceSubscriptionPriceChangeRequest = {
            requestInfo: {
                requestReferenceId: "7c80bb86-f892-4b21-a919-1357811d6c4f"
            },
            items: [
                {
                    SKU: "AD_FREE_1M",
                    price: 12990
                }
            ]
        }

        try {
            await client.changeSubscriptionPrice("4124214", subscriptionPriceChangeRequest);
            fail('this test call is expected to throw')
        } catch (e) {
            let error = e as APIException
            expect(error.httpStatusCode).toBe(403)
            expect(error.apiError).toBe(APIError.SUBSCRIPTION_DOES_NOT_EXIST)
            expect(error.errorMessage).toBe("The subscription doesn't exist.")
        }
    })

    it.each([
        ['extendRenewalDateForAllActiveSubscribers', (client: AppStoreServerAPIClient, body: any) => client.extendRenewalDateForAllActiveSubscribers(body), () => ({
            extendByDays: 45,
            extendReasonCode: ExtendReasonCode.CUSTOMER_SATISFACTION,
            requestIdentifier: "fdf964a4-233b-486c-aac1-97d8d52688ac",
            storefrontCountryCodes: ["USA", "MEX"],
            productId: "com.example.productId"
        }), ['extendByDays', 'extendReasonCode', 'requestIdentifier', 'productId']],
        ['extendSubscriptionRenewalDate', (client: AppStoreServerAPIClient, body: any) => client.extendSubscriptionRenewalDate("4124214", body), () => ({
            extendByDays: 45,
            extendReasonCode: ExtendReasonCode.CUSTOMER_SATISFACTION,
            requestIdentifier: "fdf964a4-233b-486c-aac1-97d8d52688ac"
        }), ['extendByDays', 'extendReasonCode', 'requestIdentifier']],
        ['getNotificationHistory', (client: AppStoreServerAPIClient, body: any) => client.getNotificationHistory("a036bc0e-52b8-4bee-82fc-8c24cb6715d6", body), () => ({
            startDate: 1698148900000,
            endDate: 1698148950000,
            notificationType: NotificationTypeV2.SUBSCRIBED
        }), ['startDate', 'endDate']],
        ['sendConsumptionData', (client: AppStoreServerAPIClient, body: any) => client.sendConsumptionData("49571273", body), () => ({
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
            userStatus: UserStatus.LIMITED_ACCESS
        }), ['customerConsented', 'consumptionStatus', 'platform', 'sampleContentProvided', 'deliveryStatus', 'accountTenure', 'playTime', 'lifetimeDollarsRefunded', 'lifetimeDollarsPurchased', 'userStatus']],
        ['sendConsumptionInformation', (client: AppStoreServerAPIClient, body: any) => client.sendConsumptionInformation("49571273", body), () => ({
            customerConsented: true,
            deliveryStatus: DeliveryStatus.DELIVERED,
            sampleContentProvided: false
        }), ['customerConsented', 'deliveryStatus', 'sampleContentProvided']],
        ['setAppAccountToken', (client: AppStoreServerAPIClient, body: any) => client.setAppAccountToken("49571273", body), () => ({
            appAccountToken: "7389a31a-fb6d-4569-a2a6-db7d85d84813"
        }), ['appAccountToken']],
    ] as [string, (client: AppStoreServerAPIClient, body: any) => Promise<unknown>, () => any, string[]][])('does not send a %s request whose body is missing or lacks a required field', async (_, call, completeBody, requiredKeys) => {
        let requests = 0
        const client = getAppStoreServerAPIClient("", 200, () => { requests++ });

        await expect(call(client, null)).rejects.toThrow("Unexpected request body format")
        await expect(call(client, undefined)).rejects.toThrow("Unexpected request body format")
        for (const requiredKey of requiredKeys) {
            const body = completeBody()
            delete body[requiredKey]
            await expect(call(client, body)).rejects.toThrow("Unexpected request body format")
            const wrongType = completeBody()
            wrongType[requiredKey] = typeof wrongType[requiredKey] === 'number' ? String(wrongType[requiredKey]) : 1
            await expect(call(client, wrongType)).rejects.toThrow("Unexpected request body format")
        }
        expect(requests).toBe(0)

        await call(client, completeBody()).catch(() => undefined)
        expect(requests).toBe(1)
    })

    it('sends request bodies whose enum fields hold raw values newer than the library', async () => {
        const sentBodies: any[] = []
        const recordBody = (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined) => {
            sentBodies.push(JSON.parse(requestBody as string))
        }
        const massExtendRenewalDateRequest: MassExtendRenewalDateRequest = {
            extendByDays: 45,
            extendReasonCode: 99,
            requestIdentifier: "fdf964a4-233b-486c-aac1-97d8d52688ac",
            productId: "com.example.productId"
        }
        const extendRenewalDateRequest: ExtendRenewalDateRequest = {
            extendByDays: 45,
            extendReasonCode: 99,
            requestIdentifier: "fdf964a4-233b-486c-aac1-97d8d52688ac"
        }
        const notificationHistoryRequest: NotificationHistoryRequest = {
            startDate: 1698148900000,
            endDate: 1698148950000,
            notificationType: "NEW_NOTIFICATION_TYPE",
            notificationSubtype: "NEW_SUBTYPE"
        }

        await getClientWithBody("tests/resources/models/extendRenewalDateForAllActiveSubscribersResponse.json", recordBody).extendRenewalDateForAllActiveSubscribers(massExtendRenewalDateRequest)
        await getClientWithBody("tests/resources/models/extendSubscriptionRenewalDateResponse.json", recordBody).extendSubscriptionRenewalDate("4124214", extendRenewalDateRequest)
        await getClientWithBody("tests/resources/models/getNotificationHistoryResponse.json", recordBody).getNotificationHistory(null, notificationHistoryRequest)

        expect(sentBodies).toEqual([massExtendRenewalDateRequest, extendRenewalDateRequest, notificationHistoryRequest])
        expect(sentBodies.map(body => [body.extendReasonCode, body.notificationType, body.notificationSubtype])).toEqual([
            [99, undefined, undefined],
            [99, undefined, undefined],
            [undefined, "NEW_NOTIFICATION_TYPE", "NEW_SUBTYPE"],
        ])
    })

    it('does not send a changeSubscriptionPrice request with an invalid SKU', async () => {
        let called = false
        const client = getAppStoreServerAPIClient("", 200, () => { called = true });

        const subscriptionPriceChangeRequest: AdvancedCommerceSubscriptionPriceChangeRequest = {
            requestInfo: {
                requestReferenceId: "7c80bb86-f892-4b21-a919-1357811d6c4f"
            },
            items: [
                {
                    SKU: "a".repeat(129),
                    price: 12990
                }
            ]
        }

        await expect(client.changeSubscriptionPrice("4124214", subscriptionPriceChangeRequest)).rejects.toThrow("Unexpected request body format")
        expect(called).toBe(false)
    })

    it('does not send a cancelSubscription request without a request body', async () => {
        let called = false
        const client = getAppStoreServerAPIClient("", 200, () => { called = true });

        await expect(client.cancelSubscription("4124214", null as unknown as AdvancedCommerceSubscriptionCancelRequest)).rejects.toThrow("Unexpected request body format")
        expect(called).toBe(false)
    })

    it('does not send a revokeSubscription request without a refund risking preference', async () => {
        let called = false
        const client = getAppStoreServerAPIClient("", 200, () => { called = true });

        const subscriptionRevokeRequest = {
            requestInfo: {
                requestReferenceId: "932c6903-0ab8-4469-9f21-015f6fab013c"
            },
            refundReason: AdvancedCommerceRefundReason.UNINTENDED_PURCHASE,
            refundType: AdvancedCommerceRefundType.PRORATED
        } as AdvancedCommerceSubscriptionRevokeRequest

        await expect(client.revokeSubscription("4124214", subscriptionRevokeRequest)).rejects.toThrow("Unexpected request body format")
        expect(called).toBe(false)
    })

    it('does not send a requestTransactionRefund request without items', async () => {
        let called = false
        const client = getAppStoreServerAPIClient("", 200, () => { called = true });

        const requestRefundRequest: AdvancedCommerceRequestRefundRequest = {
            requestInfo: {
                requestReferenceId: "932c6903-0ab8-4469-9f21-015f6fab013c"
            },
            items: [],
            refundRiskingPreference: true
        }

        await expect(client.requestTransactionRefund("4124214", requestRefundRequest)).rejects.toThrow("Unexpected request body format")
        expect(called).toBe(false)
    })

    it('does not send a changeSubscriptionMetadata request with a description that is too long', async () => {
        let called = false
        const client = getAppStoreServerAPIClient("", 200, () => { called = true });

        const subscriptionChangeMetadataRequest: AdvancedCommerceSubscriptionChangeMetadataRequest = {
            requestInfo: {
                requestReferenceId: "932c6903-0ab8-4469-9f21-015f6fab013c"
            },
            descriptors: {
                effective: AdvancedCommerceEffective.NEXT_BILL_CYCLE,
                description: "a".repeat(46)
            }
        }

        await expect(client.changeSubscriptionMetadata("4124214", subscriptionChangeMetadataRequest)).rejects.toThrow("Unexpected request body format")
        expect(called).toBe(false)
    })

    it('does not send a migrateSubscriptionToAdvancedCommerceAPI request with a display name that is too long', async () => {
        let called = false
        const client = getAppStoreServerAPIClient("", 200, () => { called = true });

        const subscriptionMigrateRequest: AdvancedCommerceSubscriptionMigrateRequest = {
            requestInfo: {
                requestReferenceId: "932c6903-0ab8-4469-9f21-015f6fab013c"
            },
            descriptors: {
                description: "Remove ads and unlock advanced features.",
                displayName: "a".repeat(31)
            },
            items: [
                {
                    SKU: "AD_FREE_1M",
                    description: "Remove ads for the service.",
                    displayName: "Ad-free monthly plan"
                }
            ],
            targetProductId: "com.example.base",
            taxCode: "C003-00-1"
        }

        await expect(client.migrateSubscriptionToAdvancedCommerceAPI("4124214", subscriptionMigrateRequest)).rejects.toThrow("Unexpected request body format")
        expect(called).toBe(false)
    })

    it('rejects a cancelSubscription response without the required signedRenewalInfo', async () => {
        const client = getAppStoreServerAPIClient(JSON.stringify({ signedTransactionInfo: "signed_transaction_info" }), 200, () => {});

        const subscriptionCancelRequest: AdvancedCommerceSubscriptionCancelRequest = {
            requestInfo: {
                requestReferenceId: "932c6903-0ab8-4469-9f21-015f6fab013c"
            }
        }

        await expect(client.cancelSubscription("4124214", subscriptionCancelRequest)).rejects.toThrow("Unexpected response body format")
    })

    it('rejects a requestTransactionRefund response without the required signedTransactionInfo', async () => {
        const client = getAppStoreServerAPIClient(JSON.stringify({ signedRenewalInfo: "signed_renewal_info" }), 200, () => {});

        const requestRefundRequest: AdvancedCommerceRequestRefundRequest = {
            requestInfo: {
                requestReferenceId: "932c6903-0ab8-4469-9f21-015f6fab013c"
            },
            items: [
                {
                    SKU: "AD_FREE_1M",
                    refundReason: AdvancedCommerceRefundReason.UNSATISFIED_WITH_PURCHASE,
                    refundType: AdvancedCommerceRefundType.FULL,
                    revoke: true
                }
            ],
            refundRiskingPreference: true
        }

        await expect(client.requestTransactionRefund("4124214", requestRefundRequest)).rejects.toThrow("Unexpected response body format")
    })

    it('has one APIError name per error code', async () => {
        const names = Object.keys(APIError).filter(key => isNaN(Number(key)))
        const codes = new Set(names.map(name => APIError[name as keyof typeof APIError]))
        expect(codes.size).toBe(names.length)
        for (const removedName of ['APP_TRANSACTION_ID_NOT_SUPPORTED_ERROR', 'INVALID_APP_ACCOUNT_TOKEN_UUID_ERROR', 'FAMILY_TRANSACTION_NOT_SUPPORTED_ERROR', 'TRANSACTION_ID_IS_NOT_ORIGINAL_TRANSACTION_ID_ERROR', 'APP_TRANSACTION_DOES_NOT_EXIST_ERROR']) {
            expect(names).not.toContain(removedName)
        }
        expect(APIError.APP_TRANSACTION_ID_NOT_SUPPORTED).toBe(4000048)
        expect(APIError.INVALID_APP_ACCOUNT_TOKEN_UUID).toBe(4000183)
        expect(APIError.FAMILY_TRANSACTION_NOT_SUPPORTED).toBe(4000185)
        expect(APIError.TRANSACTION_ID_IS_NOT_ORIGINAL_TRANSACTION_ID).toBe(4000187)
        expect(APIError.APP_TRANSACTION_DOES_NOT_EXIST).toBe(4040019)
        expect(APIError[4040019]).toBe('APP_TRANSACTION_DOES_NOT_EXIST')
    })

    it('calls getCustomerGroups', async () => {
        const client = getClientWithBody("tests/resources/models/getCustomerGroupsResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/groups/v1/currentGroups/1234").toBe(path)
            expect(Array.from(parsedQueryParameters.entries())).toStrictEqual([])
            expect(requestBody).toBeUndefined()
        });

        const getCustomerGroupsResponse: GetCustomerGroupsResponse = await client.getCustomerGroups("1234");

        expect(getCustomerGroupsResponse).toBeTruthy()
        const roles: RoleEntry[] = [
            {
                productId: "example.productId.one",
                role: Role.ADMIN
            },
            {
                productId: "example.productId.two",
                role: Role.NONE
            }
        ]
        const expectedGroups: GroupEntry[] = [
            {
                groupId: "900000000000000000",
                groupType: GroupType.ORGANIZATION,
                roles: roles
            },
            {
                groupId: "900000000000000001",
                groupType: GroupType.CONSUMER
            }
        ]
        expect(getCustomerGroupsResponse.groups).toStrictEqual(expectedGroups)
        expect(getCustomerGroupsResponse.groups![1].roles).toBeUndefined()
    })

    it('calls getCustomerGroups and receives an empty list of groups', async () => {
        const client = getAppStoreServerAPIClient('{"groups": []}', 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/groups/v1/currentGroups/1234").toBe(path)
        });

        const getCustomerGroupsResponse = await client.getCustomerGroups("1234");

        expect(getCustomerGroupsResponse.groups).toStrictEqual([])
    })

    it('calls getCustomerGroups and receives unknown groupType and role values', async () => {
        const body = JSON.stringify({
            groups: [
                {
                    groupId: "900000000000000000",
                    groupType: "NEW_GROUP_TYPE",
                    roles: [
                        {
                            productId: "example.productId.one",
                            role: "NEW_ROLE"
                        }
                    ]
                }
            ]
        })
        const client = getAppStoreServerAPIClient(body, 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/groups/v1/currentGroups/1234").toBe(path)
        });

        const getCustomerGroupsResponse = await client.getCustomerGroups("1234");

        expect(getCustomerGroupsResponse.groups![0].groupType).toBe("NEW_GROUP_TYPE")
        expect(getCustomerGroupsResponse.groups![0].roles![0].role).toBe("NEW_ROLE")
    })

    it('calls getCustomerGroups but receives a malformed response', async () => {
        const malformedBodies = [
            { groups: "900000000000000000" },
            { groups: [{ groupId: 900000000000000000 }] },
            { groups: [{ groupType: 1 }] },
            { groups: [{ roles: { productId: "example.productId.one" } }] },
            { groups: [{ roles: [{ productId: 1 }] }] },
            { groups: [{ roles: [{ role: true }] }] }
        ]
        for (const malformedBody of malformedBodies) {
            const client = getAppStoreServerAPIClient(JSON.stringify(malformedBody), 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
                expect("/groups/v1/currentGroups/1234").toBe(path)
            });

            await expect(client.getCustomerGroups("1234")).rejects.toThrow("Unexpected response body format")
        }
    })

    it('calls getCustomerGroups but receives transaction id not found error', async () => {
        const client = getClientWithBody("tests/resources/models/transactionIdNotFoundError.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/groups/v1/currentGroups/9999").toBe(path)
            expect(Array.from(parsedQueryParameters.entries())).toStrictEqual([])
            expect(requestBody).toBeUndefined()
        }, 404);

        const error = await client.getCustomerGroups("9999").then(() => null, (e) => e)

        expect(error).toBeInstanceOf(APIException)
        expect((error as APIException).httpStatusCode).toBe(404)
        expect((error as APIException).apiError).toBe(APIError.TRANSACTION_ID_NOT_FOUND)
        expect((error as APIException).errorMessage).toBe("Transaction id not found.")
    })

    it('calls getGroupMembers', async () => {
        const client = getClientWithBody("tests/resources/models/getGroupMembersResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/groups/v1/group/900000000000000000").toBe(path)
            expect(Array.from(parsedQueryParameters.entries())).toStrictEqual([
                ["paginationToken", "c1f4b6a8-3c5e-4d8a-9b2f-6e7d8c9a0b12"],
                ["limit", "50"]
            ])
            expect(requestBody).toBeUndefined()
        });

        const getGroupMembersResponse: GetGroupMembersResponse = await client.getGroupMembers("900000000000000000", "c1f4b6a8-3c5e-4d8a-9b2f-6e7d8c9a0b12", 50);

        expect(getGroupMembersResponse).toBeTruthy()
        const expectedMembers: GroupMemberEntry[] = [
            {
                appTransactionId: "700000000000000000"
            },
            {
                appTransactionId: "700000000000000001"
            }
        ]
        expect(getGroupMembersResponse.members).toStrictEqual(expectedMembers)
        expect(getGroupMembersResponse.paginationToken).toBe("1d1b7a4e-7f47-4d3a-9f2c-2a6f0b9c5e11")
        expect(getGroupMembersResponse.hasMore).toBe(true)
    })

    it('calls getGroupMembers without optional parameters', async () => {
        const body = JSON.stringify({
            members: [
                {
                    appTransactionId: "700000000000000000"
                }
            ],
            hasMore: false
        })
        const expectedQueryParameters: string[][] = []
        const client = getAppStoreServerAPIClient(body, 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/groups/v1/group/900000000000000000").toBe(path)
            expect(Array.from(parsedQueryParameters.entries())).toStrictEqual(expectedQueryParameters)
            expect(requestBody).toBeUndefined()
        });

        const getGroupMembersResponse = await client.getGroupMembers("900000000000000000");

        expect(getGroupMembersResponse.members).toStrictEqual([{ appTransactionId: "700000000000000000" }])
        expect(getGroupMembersResponse.paginationToken).toBeUndefined()
        expect(getGroupMembersResponse.hasMore).toBe(false)

        await client.getGroupMembers("900000000000000000", null, null);
        await client.getGroupMembers("900000000000000000", undefined, undefined);
    })

    it('calls getGroupMembers with only a limit', async () => {
        const client = getClientWithBody("tests/resources/models/getGroupMembersResponse.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/groups/v1/group/900000000000000000").toBe(path)
            expect(Array.from(parsedQueryParameters.entries())).toStrictEqual([["limit", "100"]])
            expect(requestBody).toBeUndefined()
        });

        const getGroupMembersResponse = await client.getGroupMembers("900000000000000000", null, 100);

        expect(getGroupMembersResponse.hasMore).toBe(true)
    })

    it('calls getGroupMembers but receives a malformed response', async () => {
        const malformedBodies = [
            { members: { appTransactionId: "700000000000000000" } },
            { members: [{ appTransactionId: 700000000000000000 }] },
            { paginationToken: 1 },
            { hasMore: "true" }
        ]
        for (const malformedBody of malformedBodies) {
            const client = getAppStoreServerAPIClient(JSON.stringify(malformedBody), 200, (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
                expect("/groups/v1/group/900000000000000000").toBe(path)
            });

            await expect(client.getGroupMembers("900000000000000000")).rejects.toThrow("Unexpected response body format")
        }
    })

    it('calls getGroupMembers but receives group not found error', async () => {
        const client = getClientWithBody("tests/resources/models/groupNotFoundError.json", (path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) => {
            expect("GET").toBe(method)
            expect("/groups/v1/group/123").toBe(path)
            expect(Array.from(parsedQueryParameters.entries())).toStrictEqual([])
            expect(requestBody).toBeUndefined()
        }, 404);

        const error = await client.getGroupMembers("123").then(() => null, (e) => e)

        expect(error).toBeInstanceOf(APIException)
        expect((error as APIException).httpStatusCode).toBe(404)
        expect((error as APIException).apiError).toBe(APIError.GROUP_NOT_FOUND)
        expect((error as APIException).errorMessage).toBe("Group not found.")
    })
})