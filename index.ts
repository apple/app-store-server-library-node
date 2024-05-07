// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import fetch from 'node-fetch';
import { CheckTestNotificationResponse, CheckTestNotificationResponseValidator } from './models/CheckTestNotificationResponse';
import { ConsumptionRequest } from './models/ConsumptionRequest';
import { Environment } from './models/Environment';
import { ExtendRenewalDateRequest } from './models/ExtendRenewalDateRequest';
import { ExtendRenewalDateResponse, ExtendRenewalDateResponseValidator } from './models/ExtendRenewalDateResponse';
import { HistoryResponse, HistoryResponseValidator } from './models/HistoryResponse';
import { MassExtendRenewalDateRequest } from './models/MassExtendRenewalDateRequest';
import { MassExtendRenewalDateResponse, MassExtendRenewalDateResponseValidator } from './models/MassExtendRenewalDateResponse';
import { MassExtendRenewalDateStatusResponse, MassExtendRenewalDateStatusResponseValidator } from './models/MassExtendRenewalDateStatusResponse';
import { OrderLookupResponse, OrderLookupResponseValidator } from './models/OrderLookupResponse';
import { RefundHistoryResponse, RefundHistoryResponseValidator } from './models/RefundHistoryResponse';
import { SendTestNotificationResponse, SendTestNotificationResponseValidator } from './models/SendTestNotificationResponse';
import { StatusResponse, StatusResponseValidator } from './models/StatusResponse';
import { TransactionHistoryRequest } from './models/TransactionHistoryRequest';
import { TransactionInfoResponse, TransactionInfoResponseValidator } from './models/TransactionInfoResponse';
import { Validator } from './models/Validator';
import { Status } from './models/Status';
export { SignedDataVerifier } from './jws_verification'
export { ReceiptUtility } from './receipt_utility'
export { AccountTenure } from "./models/AccountTenure"
export { AutoRenewStatus } from './models/AutoRenewStatus'
export { CheckTestNotificationResponse } from './models/CheckTestNotificationResponse'
export { ConsumptionRequest } from './models/ConsumptionRequest'
export { ConsumptionStatus } from './models/ConsumptionStatus'
export { Data } from './models/Data'
export { DeliveryStatus } from './models/DeliveryStatus'
export { Environment } from './models/Environment'
export { ExpirationIntent } from './models/ExpirationIntent'
export { ExtendReasonCode } from './models/ExtendReasonCode'
export { ExtendRenewalDateRequest } from './models/ExtendRenewalDateRequest'
export { ExtendRenewalDateResponse } from './models/ExtendRenewalDateResponse'
export { SendAttemptResult } from './models/SendAttemptResult'
export { SendAttemptItem } from './models/SendAttemptItem'
export { HistoryResponse } from './models/HistoryResponse'
export { InAppOwnershipType } from './models/InAppOwnershipType'
export { JWSRenewalInfoDecodedPayload } from './models/JWSRenewalInfoDecodedPayload'
export { JWSTransactionDecodedPayload } from './models/JWSTransactionDecodedPayload'
export { LastTransactionsItem } from './models/LastTransactionsItem'
export { LifetimeDollarsPurchased } from './models/LifetimeDollarsPurchased'
export { LifetimeDollarsRefunded } from './models/LifetimeDollarsRefunded'
export { MassExtendRenewalDateRequest } from './models/MassExtendRenewalDateRequest'
export { MassExtendRenewalDateResponse } from './models/MassExtendRenewalDateResponse'
export { MassExtendRenewalDateStatusResponse } from './models/MassExtendRenewalDateStatusResponse'
export { NotificationHistoryRequest } from './models/NotificationHistoryRequest'
export { NotificationHistoryResponse } from './models/NotificationHistoryResponse'
export { NotificationHistoryResponseItem } from './models/NotificationHistoryResponseItem'
export { NotificationTypeV2 } from './models/NotificationTypeV2'
export { OfferType } from './models/OfferType'
export { OrderLookupResponse } from './models/OrderLookupResponse'
export { OrderLookupStatus } from './models/OrderLookupStatus'
export { Platform } from './models/Platform'
export { PlayTime } from './models/PlayTime'
export { PriceIncreaseStatus } from './models/PriceIncreaseStatus'
export { RefundHistoryResponse } from './models/RefundHistoryResponse'
export { ResponseBodyV2 } from './models/ResponseBodyV2'
export { ResponseBodyV2DecodedPayload } from './models/ResponseBodyV2DecodedPayload'
export { RevocationReason } from './models/RevocationReason'
export { SendTestNotificationResponse } from './models/SendTestNotificationResponse'
export { Status } from './models/Status'
export { StatusResponse } from './models/StatusResponse'
export { SubscriptionGroupIdentifierItem } from './models/SubscriptionGroupIdentifierItem'
export { Subtype } from './models/Subtype'
export { Summary } from './models/Summary'
export { TransactionHistoryRequest, Order, ProductType } from './models/TransactionHistoryRequest'
export { TransactionInfoResponse } from './models/TransactionInfoResponse'
export { TransactionReason } from './models/TransactionReason'
export { Type } from './models/Type'
export { UserStatus } from './models/UserStatus'
export { PromotionalOfferSignatureCreator } from './promotional_offer'
export { DecodedSignedData } from './models/DecodedSignedData'
export { AppTransaction } from './models/AppTransaction'

import jsonwebtoken = require('jsonwebtoken');
import { NotificationHistoryRequest } from './models/NotificationHistoryRequest';
import { NotificationHistoryResponse, NotificationHistoryResponseValidator } from './models/NotificationHistoryResponse';
import { URLSearchParams } from 'url';

export class AppStoreServerAPIClient {
    private static PRODUCTION_URL = "https://api.storekit.itunes.apple.com";
    private static SANDBOX_URL = "https://api.storekit-sandbox.itunes.apple.com";
    private static LOCAL_TESTING_URL = "https://local-testing-base-url";
    private static USER_AGENT = "app-store-server-library/node/1.2.0";

    private issuerId: string
    private keyId: string
    private signingKey: string
    private bundleId: string
    private urlBase: string

    /**
     * Create an App Store Server API client
     * @param signingKey Your private key downloaded from App Store Connect
     * @param keyId Your private key ID from App Store Connect
     * @param issuerId Your issuer ID from the Keys page in App Store Connect
     * @param bundleId Your app’s bundle ID
     * @param environment The environment to target
     */
    public constructor(signingKey: string, keyId: string, issuerId: string, bundleId: string, environment: Environment) {
        this.issuerId = issuerId
        this.keyId = keyId
        this.bundleId = bundleId
        this.signingKey = signingKey
        switch(environment) {
            case Environment.XCODE:
                throw new Error("Xcode is not a supported environment for an AppStoreServerAPIClient")
            case Environment.PRODUCTION:
                this.urlBase = AppStoreServerAPIClient.PRODUCTION_URL
                break
            case Environment.LOCAL_TESTING:
                this.urlBase = AppStoreServerAPIClient.LOCAL_TESTING_URL
                break
            case Environment.SANDBOX:
                this.urlBase = AppStoreServerAPIClient.SANDBOX_URL
                break
        }
    }

    protected async makeRequest<T>(path: string, method: string, queryParameters: { [key: string]: string[]}, body: object | null, validator: Validator<T> | null): Promise<T> {
        const headers: { [key: string]: string } = {
            'User-Agent': AppStoreServerAPIClient.USER_AGENT,
            'Authorization': 'Bearer ' + this.createBearerToken(),
            'Accept': 'application/json',
        }
        const parsedQueryParameters = new URLSearchParams()
        for (const queryParam in queryParameters) {
            for (const queryVal of queryParameters[queryParam]) {
                parsedQueryParameters.append(queryParam, queryVal)
            }
        }
        let stringBody = undefined
        if (body != null) {
            stringBody = JSON.stringify(body)
            headers['Content-Type'] = 'application/json'
        }

        const response = await this.makeFetchRequest(path, parsedQueryParameters, method, stringBody, headers)

        if(response.ok) {
            // Success
            if (validator == null) {
                return null as T
            }

            const responseBody = await response.json()

            if (!validator.validate(responseBody)) {
                throw new Error("Unexpected response body format")
            }

            return responseBody
        }

        try {
            const responseBody = await response.json()
            const errorCode = responseBody['errorCode']
            const errorMessage = responseBody['errorMessage']

            if (errorCode) {
                throw new APIException(response.status, errorCode, errorMessage)
            }

            throw new APIException(response.status)
        } catch (e) {
            if (e instanceof APIException) {
                throw e
            }

            throw new APIException(response.status)
        }
    }

    protected async makeFetchRequest(path: string, parsedQueryParameters: URLSearchParams, method: string, stringBody: string | undefined, headers: { [key: string]: string; }) {
        return await fetch(this.urlBase + path + '?' + parsedQueryParameters, {
            method: method,
            body: stringBody,
            headers: headers
        });
    }

    /**
     * Uses a subscription’s product identifier to extend the renewal date for all of its eligible active subscribers.
     *
     * @param massExtendRenewalDateRequest The request body for extending a subscription renewal date for all of its active subscribers.
     * @return A response that indicates the server successfully received the subscription-renewal-date extension request.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/extend_subscription_renewal_dates_for_all_active_subscribers Extend Subscription Renewal Dates for All Active Subscribers}
     */
    public async extendRenewalDateForAllActiveSubscribers(massExtendRenewalDateRequest: MassExtendRenewalDateRequest): Promise<MassExtendRenewalDateResponse> {
        return await this.makeRequest("/inApps/v1/subscriptions/extend/mass", "POST", {}, massExtendRenewalDateRequest, new MassExtendRenewalDateResponseValidator());
    }

    /**
     * Extends the renewal date of a customer’s active subscription using the original transaction identifier.
     *
     * @param originalTransactionId    The original transaction identifier of the subscription receiving a renewal date extension.
     * @param extendRenewalDateRequest The request body containing subscription-renewal-extension data.
     * @return A response that indicates whether an individual renewal-date extension succeeded, and related details.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/extend_a_subscription_renewal_date Extend a Subscription Renewal Date}
     */
    public async extendSubscriptionRenewalDate(originalTransactionId: string, extendRenewalDateRequest: ExtendRenewalDateRequest): Promise<ExtendRenewalDateResponse> {
        return await this.makeRequest<ExtendRenewalDateResponse>("/inApps/v1/subscriptions/extend/" + originalTransactionId, "PUT", {}, extendRenewalDateRequest, new ExtendRenewalDateResponseValidator());
    }

    /**
     * Get the statuses for all of a customer’s auto-renewable subscriptions in your app.
     *
     * @param transactionId The identifier of a transaction that belongs to the customer, and which may be an original transaction identifier.
     * @param status An optional filter that indicates the status of subscriptions to include in the response. Your query may specify more than one status query parameter.
     * @return A response that contains status information for all of a customer’s auto-renewable subscriptions in your app.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/get_all_subscription_statuses Get All Subscription Statuses}
     */
    public async getAllSubscriptionStatuses(transactionId: string, status: Status[] | undefined = undefined): Promise<StatusResponse> {
        const queryParameters: { [key: string]: [string]} = {}
        if (status != null) {
            queryParameters["status"] = status.map(s => s.toString()) as [string];
        }

        return await this.makeRequest("/inApps/v1/subscriptions/" + transactionId, "GET", queryParameters, null, new StatusResponseValidator());
    }

    /**
     * Get a paginated list of all of a customer’s refunded in-app purchases for your app.
     *
     * @param transactionId The identifier of a transaction that belongs to the customer, and which may be an original transaction identifier.
     * @param revision              A token you provide to get the next set of up to 20 transactions. All responses include a revision token. Use the revision token from the previous RefundHistoryResponse.
     * @return A response that contains status information for all of a customer’s auto-renewable subscriptions in your app.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/get_refund_history Get Refund History}
     */
    public async getRefundHistory(transactionId: string, revision: string | null): Promise<RefundHistoryResponse> {
        const queryParameters: { [key: string]: [string]} = {}
        if (revision !== null) {
            queryParameters["revision"] = [revision];
        }

        return await this.makeRequest("/inApps/v2/refund/lookup/" + transactionId, "GET", queryParameters, null, new RefundHistoryResponseValidator());
    }

    /**
     * Checks whether a renewal date extension request completed, and provides the final count of successful or failed extensions.
     *
     * @param requestIdentifier The UUID that represents your request to the Extend Subscription Renewal Dates for All Active Subscribers endpoint.
     * @param productId         The product identifier of the auto-renewable subscription that you request a renewal-date extension for.
     * @return A response that indicates the current status of a request to extend the subscription renewal date to all eligible subscribers.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/get_status_of_subscription_renewal_date_extensions Get Status of Subscription Renewal Date Extensions}
     */
    public async getStatusOfSubscriptionRenewalDateExtensions(requestIdentifier: string, productId: string): Promise<MassExtendRenewalDateStatusResponse> {
        return await this.makeRequest("/inApps/v1/subscriptions/extend/mass/" + productId + "/" + requestIdentifier, "GET", {}, null, new MassExtendRenewalDateStatusResponseValidator());
    }

    /**
     * Check the status of the test App Store server notification sent to your server.
     *
     * @param testNotificationToken The test notification token received from the Request a Test Notification endpoint
     * @return A response that contains the contents of the test notification sent by the App Store server and the result from your server.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/get_test_notification_status Get Test Notification Status}
     */
    public async getTestNotificationStatus(testNotificationToken: string): Promise<CheckTestNotificationResponse> {
        return await this.makeRequest("/inApps/v1/notifications/test/" + testNotificationToken, "GET", {}, null, new CheckTestNotificationResponseValidator());
    }

    /**
     * Get a list of notifications that the App Store server attempted to send to your server.
     *
     * @param paginationToken An optional token you use to get the next set of up to 20 notification history records. All responses that have more records available include a paginationToken. Omit this parameter the first time you call this endpoint.
     * @param notificationHistoryRequest The request body that includes the start and end dates, and optional query constraints.
     * @return A response that contains the App Store Server Notifications history for your app.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/get_notification_history Get Notification History}
     */
    public async getNotificationHistory(paginationToken: string | null, notificationHistoryRequest: NotificationHistoryRequest): Promise<NotificationHistoryResponse> {
        const queryParameters: { [key: string]: [string]} = {}
        if (paginationToken != null) {
            queryParameters["paginationToken"] = [paginationToken];
        }
        return await this.makeRequest("/inApps/v1/notifications/history", "POST", queryParameters, notificationHistoryRequest, new NotificationHistoryResponseValidator());
    }

    /**
     * Get a customer’s in-app purchase transaction history for your app.
     *
     * @param transactionId The identifier of a transaction that belongs to the customer, and which may be an original transaction identifier.
     * @param revision              A token you provide to get the next set of up to 20 transactions. All responses include a revision token. Note: For requests that use the revision token, include the same query parameters from the initial request. Use the revision token from the previous HistoryResponse.
     * @return A response that contains the customer’s transaction history for an app.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/get_transaction_history Get Transaction History}
     */
    public async getTransactionHistory(transactionId: string, revision: string | null, transactionHistoryRequest: TransactionHistoryRequest): Promise<HistoryResponse> {
        const queryParameters: { [key: string]: string[]} = {}
        if (revision != null) {
            queryParameters["revision"] = [revision];
        }
        if (transactionHistoryRequest.startDate) {
            queryParameters["startDate"] = [transactionHistoryRequest.startDate.toString()];
        }
        if (transactionHistoryRequest.endDate) {
            queryParameters["endDate"] = [transactionHistoryRequest.endDate.toString()];
        }
        if (transactionHistoryRequest.productIds) {
            queryParameters["productId"] = transactionHistoryRequest.productIds;
        }
        if (transactionHistoryRequest.productTypes) {
            queryParameters["productType"] = transactionHistoryRequest.productTypes;
        }
        if (transactionHistoryRequest.sort) {
            queryParameters["sort"] = [transactionHistoryRequest.sort];
        }
        if (transactionHistoryRequest.subscriptionGroupIdentifiers) {
            queryParameters["subscriptionGroupIdentifier"] = transactionHistoryRequest.subscriptionGroupIdentifiers;
        }
        if (transactionHistoryRequest.inAppOwnershipType) {
            queryParameters["inAppOwnershipType"] = [transactionHistoryRequest.inAppOwnershipType];
        }
        if (transactionHistoryRequest.revoked !== undefined) {
            queryParameters["revoked"] = [transactionHistoryRequest.revoked.toString()];
        }
        return await this.makeRequest("/inApps/v1/history/" + transactionId, "GET", queryParameters, null, new HistoryResponseValidator());
    }

    /**
     * Get information about a single transaction for your app.
     *
     * @param transactionId The identifier of a transaction that belongs to the customer, and which may be an original transaction identifier.
     * @return A response that contains signed transaction information for a single transaction.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/get_transaction_info Get Transaction Info}
     */
    public async getTransactionInfo(transactionId: string): Promise<TransactionInfoResponse> {
        return await this.makeRequest("/inApps/v1/transactions/" + transactionId, "GET", {}, null, new TransactionInfoResponseValidator());
    }

    /**
     * Get a customer’s in-app purchases from a receipt using the order ID.
     *
     * @param orderId The order ID for in-app purchases that belong to the customer.
     * @return A response that includes the order lookup status and an array of signed transactions for the in-app purchases in the order.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/look_up_order_id Look Up Order ID}
     */
    public async lookUpOrderId(orderId: string): Promise<OrderLookupResponse> {
        return await this.makeRequest("/inApps/v1/lookup/" + orderId, "GET", {}, null, new OrderLookupResponseValidator());
    }

    /**
     * Ask App Store Server Notifications to send a test notification to your server.
     *
     * @return A response that contains the test notification token.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/request_a_test_notification Request a Test Notification}
     */
    public async requestTestNotification(): Promise<SendTestNotificationResponse> {
        return await this.makeRequest("/inApps/v1/notifications/test", "POST", {}, null, new SendTestNotificationResponseValidator());
    }

    /**
     * Send consumption information about a consumable in-app purchase to the App Store after your server receives a consumption request notification.
     *
     * @param transactionId The transaction identifier for which you’re providing consumption information. You receive this identifier in the CONSUMPTION_REQUEST notification the App Store sends to your server.
     * @param consumptionRequest    The request body containing consumption information.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/send_consumption_information Send Consumption Information}
     */
    public async sendConsumptionData(transactionId: string, consumptionRequest: ConsumptionRequest): Promise<void> {
        await this.makeRequest("/inApps/v1/transactions/consumption/" + transactionId, "PUT", {}, consumptionRequest, null);
    }

    private createBearerToken(): string {
        const payload = {
            bid: this.bundleId
        }
        return jsonwebtoken.sign(payload, this.signingKey, { algorithm: 'ES256', keyid: this.keyId, issuer: this.issuerId, audience: 'appstoreconnect-v1', expiresIn: '5m'});
    }
}


export class APIException extends Error {
    public httpStatusCode: number
    public apiError: number | APIError | null
    public errorMessage: string | null

    constructor(httpStatusCode: number, apiError: number | null = null, errorMessage: string | null = null) {
        super()
        this.httpStatusCode = httpStatusCode
        this.apiError = apiError
        this.errorMessage = errorMessage
    }
}

/**
 * Error codes that App Store Server API responses return.
 * 
 * {@link https://developer.apple.com/documentation/appstoreserverapi/error_codes Error codes}
 */
export enum APIError {
    /**
     * An error that indicates an invalid request.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/generalbadrequesterror GeneralBadRequestError}
     */
    GENERAL_BAD_REQUEST = 4000000,

    /**
     * An error that indicates an invalid app identifier.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidappidentifiererror InvalidAppIdentifierError}
     */
    INVALID_APP_IDENTIFIER = 4000002,

    /**
     * An error that indicates an invalid request revision.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidrequestrevisionerror InvalidRequestRevisionError}
     */
    INVALID_REQUEST_REVISION = 4000005,

    /**
     * An error that indicates an invalid transaction identifier.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidtransactioniderror InvalidTransactionIdError}
     */
    INVALID_TRANSACTION_ID = 4000006,

    /**
     * An error that indicates an invalid original transaction identifier.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidoriginaltransactioniderror InvalidOriginalTransactionIdError}
     */
    INVALID_ORIGINAL_TRANSACTION_ID = 4000008,

    /**
     * An error that indicates an invalid extend-by-days value.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidextendbydayserror InvalidExtendByDaysError}
     */
    INVALID_EXTEND_BY_DAYS = 4000009,

    /**
     * An error that indicates an invalid reason code.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidextendreasoncodeerror InvalidExtendReasonCodeError}
     */
    INVALID_EXTEND_REASON_CODE = 4000010,

    /**
     * An error that indicates an invalid request identifier.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidrequestidentifiererror InvalidRequestIdentifierError}
     */
    INVALID_REQUEST_IDENTIFIER = 4000011,

    /**
     * An error that indicates that the start date is earlier than the earliest allowed date.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/startdatetoofarinpasterror StartDateTooFarInPastError}
     */
    START_DATE_TOO_FAR_IN_PAST = 4000012,

    /**
     * An error that indicates that the end date precedes the start date, or the two dates are equal.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/startdateafterenddateerror StartDateAfterEndDateError}
     */
    START_DATE_AFTER_END_DATE = 4000013,

    /**
     * An error that indicates the pagination token is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidpaginationtokenerror InvalidPaginationTokenError}
     */
    INVALID_PAGINATION_TOKEN = 4000014,

    /**
     * An error that indicates the start date is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidstartdateerror InvalidStartDateError}
     */
    INVALID_START_DATE = 4000015,

    /**
     * An error that indicates the end date is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidenddateerror InvalidEndDateError}
     */
    INVALID_END_DATE = 4000016,
    
    /**
     * An error that indicates the pagination token expired.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/paginationtokenexpirederror PaginationTokenExpiredError}
     */
    PAGINATION_TOKEN_EXPIRED = 4000017,

    /**
     * An error that indicates the notification type or subtype is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidnotificationtypeerror InvalidNotificationTypeError}
     */
    INVALID_NOTIFICATION_TYPE = 4000018,

    /**
     * An error that indicates the request is invalid because it has too many constraints applied.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/multiplefilterssuppliederror MultipleFiltersSuppliedError}
     */
    MULTIPLE_FILTERS_SUPPLIED = 4000019,

    /**
     * An error that indicates the test notification token is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidtestnotificationtokenerror InvalidTestNotificationTokenError}
     */
    INVALID_TEST_NOTIFICATION_TOKEN = 4000020,

    /**
     * An error that indicates an invalid sort parameter.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidsorterror InvalidSortError}
     */
    INVALID_SORT = 4000021,

    /**
     * An error that indicates an invalid product type parameter.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidproducttypeerror InvalidProductTypeError}
     */
    INVALID_PRODUCT_TYPE = 4000022,

    /**
     * An error that indicates the product ID parameter is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidproductiderror InvalidProductIdError}
     */
    INVALID_PRODUCT_ID = 4000023,

    /**
     * An error that indicates an invalid subscription group identifier.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidsubscriptiongroupidentifiererror InvalidSubscriptionGroupIdentifierError}
     */
    INVALID_SUBSCRIPTION_GROUP_IDENTIFIER = 4000024,

    /**
     * An error that indicates the query parameter exclude-revoked is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidexcluderevokederror InvalidExcludeRevokedError}
     * 
     * @deprecated
     */
    INVALID_EXCLUDE_REVOKED = 4000025,

    /**
     * An error that indicates an invalid in-app ownership type parameter.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidinappownershiptypeerror InvalidInAppOwnershipTypeError}
     */
    INVALID_IN_APP_OWNERSHIP_TYPE = 4000026,

    /**
     * An error that indicates a required storefront country code is empty.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidemptystorefrontcountrycodelisterror InvalidEmptyStorefrontCountryCodeListError}
     */
    INVALID_EMPTY_STOREFRONT_COUNTRY_CODE_LIST = 4000027,

    /**
     * An error that indicates a storefront code is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidstorefrontcountrycodeerror InvalidStorefrontCountryCodeError}
     */
    INVALID_STOREFRONT_COUNTRY_CODE = 4000028,

    /**
     * An error that indicates the revoked parameter contains an invalid value.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidrevokederror InvalidRevokedError}
     */
    INVALID_REVOKED = 4000030,

    /**
     * An error that indicates the status parameter is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidstatuserror InvalidStatusError}
     */
    INVALID_STATUS = 4000031,

    /**
     * An error that indicates the value of the account tenure field is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidaccounttenureerror InvalidAccountTenureError}
     */
    INVALID_ACCOUNT_TENURE = 4000032,

    /**
     * An error that indicates the value of the app account token field is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidappaccounttokenerror InvalidAppAccountTokenError}
     */
    INVALID_APP_ACCOUNT_TOKEN = 4000033,

    /**
     * An error that indicates the value of the consumption status field is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidconsumptionstatuserror InvalidConsumptionStatusError}
     */
    INVALID_CONSUMPTION_STATUS = 4000034,

    /**
     * An error that indicates the customer consented field is invalid or doesn’t indicate that the customer consented.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidcustomerconsentederror InvalidCustomerConsentedError}
     */
    INVALID_CUSTOMER_CONSENTED = 4000035,

    /**
     * An error that indicates the value in the delivery status field is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invaliddeliverystatuserror InvalidDeliveryStatusError}
     */
    INVALID_DELIVERY_STATUS = 4000036,

    /**
     * An error that indicates the value in the lifetime dollars purchased field is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidlifetimedollarspurchasederror InvalidLifetimeDollarsPurchasedError}
     */
    INVALID_LIFETIME_DOLLARS_PURCHASED = 4000037,

    /**
     * An error that indicates the value in the lifetime dollars refunded field is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidlifetimedollarsrefundederror InvalidLifetimeDollarsRefundedError}
     */
    INVALID_LIFETIME_DOLLARS_REFUNDED = 4000038,

    /**
     * An error that indicates the value in the platform field is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidplatformerror InvalidPlatformError}
     */
    INVALID_PLATFORM = 4000039,

    /**
     * An error that indicates the value in the playtime field is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidplaytimeerror InvalidPlayTimeError}
     */
    INVALID_PLAY_TIME = 4000040,

    /**
     * An error that indicates the value in the sample content provided field is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidsamplecontentprovidederror InvalidSampleContentProvidedError}
     */
    INVALID_SAMPLE_CONTENT_PROVIDED = 4000041,

    /**
     * An error that indicates the value in the user status field is invalid.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invaliduserstatuserror InvalidUserStatusError}
     */
    INVALID_USER_STATUS = 4000042,

    /**
     * An error that indicates the transaction identifier doesn’t represent a consumable in-app purchase.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidtransactionnotconsumableerror InvalidTransactionNotConsumableError}
     * 
     * @deprecated
     */
    INVALID_TRANSACTION_NOT_CONSUMABLE = 4000043,

    /**
     * An error that indicates the transaction identifier represents an unsupported in-app purchase type.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidtransactiontypenotsupportederror InvalidTransactionTypeNotSupportedError}
     */
    INVALID_TRANSACTION_TYPE_NOT_SUPPORTED = 4000047,

    /**
     * An error that indicates the subscription doesn't qualify for a renewal-date extension due to its subscription state.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/subscriptionextensionineligibleerror SubscriptionExtensionIneligibleError}
     */
    SUBSCRIPTION_EXTENSION_INELIGIBLE = 4030004,

    /**
     * An error that indicates the subscription doesn’t qualify for a renewal-date extension because it has already received the maximum extensions.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/subscriptionmaxextensionerror SubscriptionMaxExtensionError}
     */
    SUBSCRIPTION_MAX_EXTENSION = 4030005,

    /**
     * An error that indicates a subscription isn't directly eligible for a renewal date extension because the user obtained it through Family Sharing.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/familysharedsubscriptionextensionineligibleerror FamilySharedSubscriptionExtensionIneligibleError}
     */
    FAMILY_SHARED_SUBSCRIPTION_EXTENSION_INELIGIBLE = 4030007,

    /**
     * An error that indicates the App Store account wasn’t found.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/accountnotfounderror AccountNotFoundError}
     */
    ACCOUNT_NOT_FOUND = 4040001,

    /**
     * An error response that indicates the App Store account wasn’t found, but you can try again.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/accountnotfoundretryableerror AccountNotFoundRetryableError}
     */
    ACCOUNT_NOT_FOUND_RETRYABLE = 4040002,

    /**
     * An error that indicates the app wasn’t found.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/appnotfounderror AppNotFoundError}
     */
    APP_NOT_FOUND = 4040003,

    /**
     * An error response that indicates the app wasn’t found, but you can try again.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/appnotfoundretryableerror AppNotFoundRetryableError}
     */
    APP_NOT_FOUND_RETRYABLE = 4040004,

    /**
     * An error that indicates an original transaction identifier wasn't found.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/originaltransactionidnotfounderror OriginalTransactionIdNotFoundError}
     */
    ORIGINAL_TRANSACTION_ID_NOT_FOUND = 4040005,

    /**
     * An error response that indicates the original transaction identifier wasn’t found, but you can try again.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/originaltransactionidnotfoundretryableerror OriginalTransactionIdNotFoundRetryableError}
     */
    ORIGINAL_TRANSACTION_ID_NOT_FOUND_RETRYABLE = 4040006,

    /**
     * An error that indicates that the App Store server couldn’t find a notifications URL for your app in this environment.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/servernotificationurlnotfounderror ServerNotificationUrlNotFoundError}
     */
    SERVER_NOTIFICATION_URL_NOT_FOUND = 4040007,

    /**
     * An error that indicates that the test notification token is expired or the test notification status isn’t available.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/testnotificationnotfounderror TestNotificationNotFoundError}
     */
    TEST_NOTIFICATION_NOT_FOUND = 4040008,

    /**
     * An error that indicates the server didn't find a subscription-renewal-date extension request for the request identifier and product identifier you provided.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/statusrequestnotfounderror StatusRequestNotFoundError}
     */
    STATUS_REQUEST_NOT_FOUND = 4040009,

    /**
     * An error that indicates a transaction identifier wasn't found.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/transactionidnotfounderror TransactionIdNotFoundError}
     */
    TRANSACTION_ID_NOT_FOUND = 4040010,

    /**
     * An error that indicates that the request exceeded the rate limit.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/ratelimitexceedederror RateLimitExceededError}
     */
    RATE_LIMIT_EXCEEDED = 4290000,

    /**
     * An error that indicates a general internal error.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/generalinternalerror GeneralInternalError}
     */
    GENERAL_INTERNAL = 5000000,

    /**
     * An error response that indicates an unknown error occurred, but you can try again.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/generalinternalretryableerror GeneralInternalRetryableError}
     */
    GENERAL_INTERNAL_RETRYABLE = 5000001,
}