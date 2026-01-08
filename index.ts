// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import fetch from 'node-fetch';
import { CheckTestNotificationResponse, CheckTestNotificationResponseValidator } from './models/CheckTestNotificationResponse';
import { ConsumptionRequest } from './models/ConsumptionRequest';
import { ConsumptionRequestV1 } from './models/ConsumptionRequestV1';
import { UpdateAppAccountTokenRequest } from './models/UpdateAppAccountTokenRequest'
import { DefaultConfigurationRequest } from './models/DefaultConfigurationRequest';
import { Environment } from './models/Environment';
import { ExtendRenewalDateRequest } from './models/ExtendRenewalDateRequest';
import { ExtendRenewalDateResponse, ExtendRenewalDateResponseValidator } from './models/ExtendRenewalDateResponse';
import { GetImageListResponse, GetImageListResponseValidator } from './models/GetImageListResponse';
import { GetMessageListResponse, GetMessageListResponseValidator } from './models/GetMessageListResponse';
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
import { UploadMessageRequestBody } from './models/UploadMessageRequestBody';
import { Validator } from './models/Validator';
import { Status } from './models/Status';
export { SignedDataVerifier, VerificationException, VerificationStatus } from './jws_verification'
export { ReceiptUtility } from './receipt_utility'
export { AccountTenure } from "./models/AccountTenure"
export { AlternateProduct } from './models/AlternateProduct'
export { AppData } from './models/AppData'
export { AppTransactionInfoResponse } from './models/AppTransactionInfoResponse';
export { AutoRenewStatus } from './models/AutoRenewStatus'
export { CheckTestNotificationResponse } from './models/CheckTestNotificationResponse'
export { ConsumptionRequest } from './models/ConsumptionRequest'
export { ConsumptionRequestV1 } from './models/ConsumptionRequestV1'
export { UpdateAppAccountTokenRequest } from './models/UpdateAppAccountTokenRequest'
export { ConsumptionStatus } from './models/ConsumptionStatus'
export { Data } from './models/Data'
export { DecodedRealtimeRequestBody } from './models/DecodedRealtimeRequestBody'
export { DefaultConfigurationRequest } from './models/DefaultConfigurationRequest'
export { DeliveryStatus } from './models/DeliveryStatus'
export { DeliveryStatusV1 } from './models/DeliveryStatusV1'
export { Environment } from './models/Environment'
export { ExpirationIntent } from './models/ExpirationIntent'
export { ExtendReasonCode } from './models/ExtendReasonCode'
export { ExtendRenewalDateRequest } from './models/ExtendRenewalDateRequest'
export { ExtendRenewalDateResponse } from './models/ExtendRenewalDateResponse'
export { GetImageListResponse } from './models/GetImageListResponse'
export { GetImageListResponseItem } from './models/GetImageListResponseItem'
export { GetMessageListResponse } from './models/GetMessageListResponse'
export { GetMessageListResponseItem } from './models/GetMessageListResponseItem'
export { SendAttemptResult } from './models/SendAttemptResult'
export { SendAttemptItem } from './models/SendAttemptItem'
export { HistoryResponse } from './models/HistoryResponse'
export { ImageState } from './models/ImageState'
export { InAppOwnershipType } from './models/InAppOwnershipType'
export { JWSRenewalInfoDecodedPayload } from './models/JWSRenewalInfoDecodedPayload'
export { JWSTransactionDecodedPayload } from './models/JWSTransactionDecodedPayload'
export { LastTransactionsItem } from './models/LastTransactionsItem'
export { LifetimeDollarsPurchased } from './models/LifetimeDollarsPurchased'
export { LifetimeDollarsRefunded } from './models/LifetimeDollarsRefunded'
export { MassExtendRenewalDateRequest } from './models/MassExtendRenewalDateRequest'
export { MassExtendRenewalDateResponse } from './models/MassExtendRenewalDateResponse'
export { MassExtendRenewalDateStatusResponse } from './models/MassExtendRenewalDateStatusResponse'
export { Message } from './models/Message'
export { MessageState } from './models/MessageState'
export { NotificationHistoryRequest } from './models/NotificationHistoryRequest'
export { NotificationHistoryResponse } from './models/NotificationHistoryResponse'
export { NotificationHistoryResponseItem } from './models/NotificationHistoryResponseItem'
export { NotificationTypeV2 } from './models/NotificationTypeV2'
export { OfferType } from './models/OfferType'
export { OfferDiscountType } from './models/OfferDiscountType'
export { OrderLookupResponse } from './models/OrderLookupResponse'
export { OrderLookupStatus } from './models/OrderLookupStatus'
export { Platform } from './models/Platform'
export { PlayTime } from './models/PlayTime'
export { PriceIncreaseStatus } from './models/PriceIncreaseStatus'
export { PromotionalOffer } from './models/PromotionalOffer'
export { PromotionalOfferSignatureV1 } from './models/PromotionalOfferSignatureV1'
export { PurchasePlatform } from './models/PurchasePlatform'
export { RealtimeRequestBody } from './models/RealtimeRequestBody'
export { RealtimeResponseBody } from './models/RealtimeResponseBody'
export { RefundHistoryResponse } from './models/RefundHistoryResponse'
export { RefundPreference } from './models/RefundPreference'
export { RefundPreferenceV1 } from './models/RefundPreferenceV1'
export { ResponseBodyV2 } from './models/ResponseBodyV2'
export { ResponseBodyV2DecodedPayload } from './models/ResponseBodyV2DecodedPayload'
export { RevocationType } from './models/RevocationType'
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
export { UploadMessageImage } from './models/UploadMessageImage'
export { UploadMessageRequestBody } from './models/UploadMessageRequestBody'
export { UserStatus } from './models/UserStatus'
export { PromotionalOfferSignatureCreator } from './promotional_offer'
export { PromotionalOfferV2SignatureCreator, AdvancedCommerceInAppSignatureCreator, AdvancedCommerceInAppRequest, IntroductoryOfferEligibilitySignatureCreator } from './jws_signature_creator'
export { DecodedSignedData } from './models/DecodedSignedData'
export { AppTransaction } from './models/AppTransaction'
export { ExternalPurchaseToken } from './models/ExternalPurchaseToken'

import jsonwebtoken = require('jsonwebtoken');
import { AppTransactionInfoResponse, AppTransactionInfoResponseValidator } from './models/AppTransactionInfoResponse';
import { NotificationHistoryRequest } from './models/NotificationHistoryRequest';
import { NotificationHistoryResponse, NotificationHistoryResponseValidator } from './models/NotificationHistoryResponse';
import { URLSearchParams } from 'url';

export class AppStoreServerAPIClient {
    private static PRODUCTION_URL = "https://api.storekit.itunes.apple.com";
    private static SANDBOX_URL = "https://api.storekit-sandbox.itunes.apple.com";
    private static LOCAL_TESTING_URL = "https://local-testing-base-url";
    private static USER_AGENT = "app-store-server-library/node/2.0.0";

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

    protected async makeRequest<T>(path: string, method: string, queryParameters: { [key: string]: string[]}, body: object | Buffer | null, validator: Validator<T> | null, contentType?: string): Promise<T> {
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
        let requestBody: string | Buffer | undefined = undefined
        if (body instanceof Buffer) {
            requestBody = body
            if (contentType) {
                headers['Content-Type'] = contentType
            }
        } else if (body != null) {
            requestBody = JSON.stringify(body)
            headers['Content-Type'] = 'application/json'
        }

        const response = await this.makeFetchRequest(path, parsedQueryParameters, method, requestBody, headers)

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

    protected async makeFetchRequest(path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) {
        return await fetch(this.urlBase + path + '?' + parsedQueryParameters, {
            method: method,
            body: requestBody,
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
        return await this.makeRequest("/inApps/v1/subscriptions/extend/mass", "POST", {}, massExtendRenewalDateRequest, new MassExtendRenewalDateResponseValidator(), 'application/json');
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
        return await this.makeRequest<ExtendRenewalDateResponse>("/inApps/v1/subscriptions/extend/" + originalTransactionId, "PUT", {}, extendRenewalDateRequest, new ExtendRenewalDateResponseValidator(), 'application/json');
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

        return await this.makeRequest("/inApps/v1/subscriptions/" + transactionId, "GET", queryParameters, null, new StatusResponseValidator(), undefined);
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

        return await this.makeRequest("/inApps/v2/refund/lookup/" + transactionId, "GET", queryParameters, null, new RefundHistoryResponseValidator(), undefined);
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
        return await this.makeRequest("/inApps/v1/subscriptions/extend/mass/" + productId + "/" + requestIdentifier, "GET", {}, null, new MassExtendRenewalDateStatusResponseValidator(), undefined);
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
        return await this.makeRequest("/inApps/v1/notifications/test/" + testNotificationToken, "GET", {}, null, new CheckTestNotificationResponseValidator(), undefined);
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
        return await this.makeRequest("/inApps/v1/notifications/history", "POST", queryParameters, notificationHistoryRequest, new NotificationHistoryResponseValidator(), 'application/json');
    }

    /**
     * Get a customer’s in-app purchase transaction history for your app.
     *
     * @param transactionId The identifier of a transaction that belongs to the customer, and which may be an original transaction identifier.
     * @param revision              A token you provide to get the next set of up to 20 transactions. All responses include a revision token. Note: For requests that use the revision token, include the same query parameters from the initial request. Use the revision token from the previous HistoryResponse.
     * @param version The version of the Get Transaction History endpoint to use. V2 is recommended.
     * @return A response that contains the customer’s transaction history for an app.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/get_transaction_history Get Transaction History}
     */
    public async getTransactionHistory(transactionId: string, revision: string | null, transactionHistoryRequest: TransactionHistoryRequest, version: GetTransactionHistoryVersion = GetTransactionHistoryVersion.V1): Promise<HistoryResponse> {
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
        return await this.makeRequest("/inApps/" + version + "/history/" + transactionId, "GET", queryParameters, null, new HistoryResponseValidator(), undefined);
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
        return await this.makeRequest("/inApps/v1/transactions/" + transactionId, "GET", {}, null, new TransactionInfoResponseValidator(), undefined);
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
        return await this.makeRequest("/inApps/v1/lookup/" + orderId, "GET", {}, null, new OrderLookupResponseValidator(), undefined);
    }

    /**
     * Ask App Store Server Notifications to send a test notification to your server.
     *
     * @return A response that contains the test notification token.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/request_a_test_notification Request a Test Notification}
     */
    public async requestTestNotification(): Promise<SendTestNotificationResponse> {
        return await this.makeRequest("/inApps/v1/notifications/test", "POST", {}, null, new SendTestNotificationResponseValidator(), undefined);
    }

    /**
     * Send consumption information about a consumable in-app purchase to the App Store after your server receives a consumption request notification.
     *
     * @param transactionId The transaction identifier for which you're providing consumption information. You receive this identifier in the CONSUMPTION_REQUEST notification the App Store sends to your server.
     * @param consumptionRequest    The request body containing consumption information.
     * @throws APIException If a response was returned indicating the request could not be processed
     * @deprecated Use {@link sendConsumptionInformation} instead
     * {@link https://developer.apple.com/documentation/appstoreserverapi/send-consumption-information-v1 Send Consumption Information}
     */
    public async sendConsumptionData(transactionId: string, consumptionRequest: ConsumptionRequestV1): Promise<void> {
        await this.makeRequest("/inApps/v1/transactions/consumption/" + transactionId, "PUT", {}, consumptionRequest, null, 'application/json');
    }

    /**
     * Send consumption information about an In-App Purchase to the App Store after your server receives a consumption request notification.
     *
     * @param transactionId The transaction identifier for which you're providing consumption information. You receive this identifier in the CONSUMPTION_REQUEST notification the App Store sends to your server's App Store Server Notifications V2 endpoint.
     * @param consumptionRequest The request body containing consumption information.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/send-consumption-information Send Consumption Information}
     */
    public async sendConsumptionInformation(transactionId: string, consumptionRequest: ConsumptionRequest): Promise<void> {
        await this.makeRequest("/inApps/v2/transactions/consumption/" + transactionId, "PUT", {}, consumptionRequest, null, 'application/json');
    }

    /**
     * Sets the app account token value for a purchase the customer makes outside your app, or updates its value in an existing transaction.
     *
     * @param originalTransactionId The original transaction identifier of the transaction to receive the app account token update.
     * @param updateAppAccountTokenRequest The request body that contains a valid app account token value.
     * @throws APIException If a response was returned indicating the request could not be processed.
     * {@link https://developer.apple.com/documentation/appstoreserverapi/set-app-account-token Set App Account Token}
     */
    public async setAppAccountToken(originalTransactionId: string, updateAppAccountTokenRequest: UpdateAppAccountTokenRequest): Promise<void> {
        await this.makeRequest("/inApps/v1/transactions/" + originalTransactionId + "/appAccountToken", "PUT", {}, updateAppAccountTokenRequest, null, 'application/json');
    }

    /**
     * Upload an image to use for retention messaging.
     *
     * @param imageIdentifier A UUID you provide to uniquely identify the image you upload. Must be lowercase.
     * @param image The image file to upload.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/upload-image Upload Image}
     */
    public async uploadImage(imageIdentifier: string, image: Buffer): Promise<void> {
        await this.makeRequest("/inApps/v1/messaging/image/" + imageIdentifier, "PUT", {}, image, null, 'image/png');
    }

    /**
     * Delete a previously uploaded image.
     *
     * @param imageIdentifier The identifier of the image to delete.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/delete-image Delete Image}
     */
    public async deleteImage(imageIdentifier: string): Promise<void> {
        await this.makeRequest("/inApps/v1/messaging/image/" + imageIdentifier, "DELETE", {}, null, null, undefined);
    }

    /**
     * Get the image identifier and state for all uploaded images.
     *
     * @return A response that contains status information for all images.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/get-image-list Get Image List}
     */
    public async getImageList(): Promise<GetImageListResponse> {
        return await this.makeRequest("/inApps/v1/messaging/image/list", "GET", {}, null, new GetImageListResponseValidator(), undefined);
    }

    /**
     * Upload a message to use for retention messaging.
     *
     * @param messageIdentifier A UUID you provide to uniquely identify the message you upload. Must be lowercase.
     * @param uploadMessageRequestBody The message text to upload.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/upload-message Upload Message}
     */
    public async uploadMessage(messageIdentifier: string, uploadMessageRequestBody: UploadMessageRequestBody): Promise<void> {
        await this.makeRequest("/inApps/v1/messaging/message/" + messageIdentifier, "PUT", {}, uploadMessageRequestBody, null, 'application/json');
    }

    /**
     * Delete a previously uploaded message.
     *
     * @param messageIdentifier The identifier of the message to delete.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/delete-message Delete Message}
     */
    public async deleteMessage(messageIdentifier: string): Promise<void> {
        await this.makeRequest("/inApps/v1/messaging/message/" + messageIdentifier, "DELETE", {}, null, null, undefined);
    }

    /**
     * Get the message identifier and state of all uploaded messages.
     *
     * @return A response that contains status information for all messages.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/get-message-list Get Message List}
     */
    public async getMessageList(): Promise<GetMessageListResponse> {
        return await this.makeRequest("/inApps/v1/messaging/message/list", "GET", {}, null, new GetMessageListResponseValidator(), undefined);
    }

    /**
     * Configure a default message for a specific product in a specific locale.
     *
     * @param productId The product identifier for the default configuration.
     * @param locale The locale for the default configuration.
     * @param defaultConfigurationRequest The request body that includes the message identifier to configure as the default message.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/configure-default-message Configure Default Message}
     */
    public async configureDefaultMessage(productId: string, locale: string, defaultConfigurationRequest: DefaultConfigurationRequest): Promise<void> {
        await this.makeRequest("/inApps/v1/messaging/default/" + productId + "/" + locale, "PUT", {}, defaultConfigurationRequest, null, 'application/json');
    }

    /**
     * Delete a default message for a product in a locale.
     *
     * @param productId The product ID of the default message configuration.
     * @param locale The locale of the default message configuration.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/delete-default-message Delete Default Message}
     */
    public async deleteDefaultMessage(productId: string, locale: string): Promise<void> {
        await this.makeRequest("/inApps/v1/messaging/default/" + productId + "/" + locale, "DELETE", {}, null, null, undefined);
    }

    /**
      * Get a customer's app transaction information for your app.
      *
      * @param transactionId Any originalTransactionId, transactionId or appTransactionId that belongs to the customer for your app.
      * @return A response that contains signed app transaction information for a customer.
      * @throws APIException If a response was returned indicating the request could not be processed
      * {@link https://developer.apple.com/documentation/appstoreserverapi/get-app-transaction-info Get App Transaction Info}
      */
     public async getAppTransactionInfo(transactionId: string): Promise<AppTransactionInfoResponse> {
         return await this.makeRequest("/inApps/v1/transactions/appTransactions/" + transactionId, "GET", {}, null, new AppTransactionInfoResponseValidator(), undefined);
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
     * An error that indicates the endpoint doesn't support an app transaction ID.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/apptransactionidnotsupportederror AppTransactionIdNotSupportedError}
     */
    APP_TRANSACTION_ID_NOT_SUPPORTED_ERROR = 4000048,

    /**
     * An error that indicates the image that's uploading is invalid.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/invalidimageerror InvalidImageError}
     */
    INVALID_IMAGE = 4000161,

    /**
     * An error that indicates the header text is too long.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/headertoolongerror HeaderTooLongError}
     */
    HEADER_TOO_LONG = 4000162,

    /**
     * An error that indicates the body text is too long.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/bodytoolongerror BodyTooLongError}
     */
    BODY_TOO_LONG = 4000163,

    /**
     * An error that indicates the locale is invalid.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/invalidlocaleerror InvalidLocaleError}
     */
    INVALID_LOCALE = 4000164,

    /**
     * An error that indicates the alternative text for an image is too long.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/alttexttoolongerror AltTextTooLongError}
     */
    ALT_TEXT_TOO_LONG = 4000175,

    /**
     * An error that indicates the app account token value is not a valid UUID.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidappaccounttokenuuiderror InvalidAppAccountTokenUUIDError}
     */
    INVALID_APP_ACCOUNT_TOKEN_UUID_ERROR = 4000183,

    /**
     * An error that indicates the transaction is for a product the customer obtains through Family Sharing, which the endpoint doesn’t support.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/familytransactionnotsupportederror FamilyTransactionNotSupportedError}
     */
    FAMILY_TRANSACTION_NOT_SUPPORTED_ERROR = 4000185,

    /**
     * An error that indicates the endpoint expects an original transaction identifier.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/transactionidisnotoriginaltransactioniderror TransactionIdIsNotOriginalTransactionIdError}
     */
    TRANSACTION_ID_IS_NOT_ORIGINAL_TRANSACTION_ID_ERROR = 4000187,

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
     * An error that indicates when you reach the maximum number of uploaded images.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/maximumnumberofimagesreachederror MaximumNumberOfImagesReachedError}
     */
    MAXIMUM_NUMBER_OF_IMAGES_REACHED = 4030014,

    /**
     * An error that indicates when you reach the maximum number of uploaded messages.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/maximumnumberofmessagesreachederror MaximumNumberOfMessagesReachedError}
     */
    MAXIMUM_NUMBER_OF_MESSAGES_REACHED = 4030016,

    /**
     * An error that indicates the message isn't in the approved state, so you can't configure it as a default message.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/messagenotapprovederror MessageNotApprovedError}
     */
    MESSAGE_NOT_APPROVED = 4030017,

    /**
     * An error that indicates the image isn't in the approved state, so you can't configure it as part of a default message.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/imagenotapprovederror ImageNotApprovedError}
     */
    IMAGE_NOT_APPROVED = 4030018,

    /**
     * An error that indicates the image is currently in use as part of a message, so you can't delete it.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/imageinuseerror ImageInUseError}
     */
    IMAGE_IN_USE = 4030019,

    /**
     * An error that indicates the App Store account wasn't found.
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
     * An error that indicates the system can't find the image identifier.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/imagenotfounderror ImageNotFoundError}
     */
    IMAGE_NOT_FOUND = 4040014,

    /**
     * An error that indicates the system can't find the message identifier.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/messagenotfounderror MessageNotFoundError}
     */
    MESSAGE_NOT_FOUND = 4040015,

    /**
     * An error response that indicates an app transaction doesn’t exist for the specified customer.
     * 
     * {@link https://developer.apple.com/documentation/appstoreserverapi/apptransactiondoesnotexisterror AppTransactionDoesNotExistError}
     */
    APP_TRANSACTION_DOES_NOT_EXIST_ERROR = 4040019,

    /**
     * An error that indicates the image identifier already exists.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/imagealreadyexistserror ImageAlreadyExistsError}
     */
    IMAGE_ALREADY_EXISTS = 4090000,

    /**
     * An error that indicates the message identifier already exists.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/messagealreadyexistserror MessageAlreadyExistsError}
     */
    MESSAGE_ALREADY_EXISTS = 4090001,

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

export enum GetTransactionHistoryVersion {
    /**
     * @deprecated
     */
    V1 = "v1",
    V2 = "v2",
}
