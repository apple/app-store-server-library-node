// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import fetch from 'node-fetch';
import { CheckTestNotificationResponse, CheckTestNotificationResponseValidator } from './models/CheckTestNotificationResponse';
import { ConsumptionRequest, ConsumptionRequestValidator } from './models/ConsumptionRequest';
import { ConsumptionRequestV1, ConsumptionRequestV1Validator } from './models/ConsumptionRequestV1';
import { UpdateAppAccountTokenRequest, UpdateAppAccountTokenRequestValidator } from './models/UpdateAppAccountTokenRequest'
import { DefaultConfigurationRequest, DefaultConfigurationRequestValidator } from './models/DefaultConfigurationRequest';
import { DefaultConfigurationResponse, DefaultConfigurationResponseValidator } from './models/DefaultConfigurationResponse';
import { Environment } from './models/Environment';
import { ExtendRenewalDateRequest, ExtendRenewalDateRequestValidator } from './models/ExtendRenewalDateRequest';
import { ExtendRenewalDateResponse, ExtendRenewalDateResponseValidator } from './models/ExtendRenewalDateResponse';
import { GetCustomerGroupsResponse, GetCustomerGroupsResponseValidator } from './models/GetCustomerGroupsResponse';
import { GetGroupMembersResponse, GetGroupMembersResponseValidator } from './models/GetGroupMembersResponse';
import { GetImageListResponse, GetImageListResponseValidator } from './models/GetImageListResponse';
import { GetMessageListResponse, GetMessageListResponseValidator } from './models/GetMessageListResponse';
import { HistoryResponse, HistoryResponseValidator } from './models/HistoryResponse';
import { ImageSize } from './models/ImageSize';
import { MassExtendRenewalDateRequest, MassExtendRenewalDateRequestValidator } from './models/MassExtendRenewalDateRequest';
import { MassExtendRenewalDateResponse, MassExtendRenewalDateResponseValidator } from './models/MassExtendRenewalDateResponse';
import { MassExtendRenewalDateStatusResponse, MassExtendRenewalDateStatusResponseValidator } from './models/MassExtendRenewalDateStatusResponse';
import { OrderLookupResponse, OrderLookupResponseValidator } from './models/OrderLookupResponse';
import { RefundHistoryResponse, RefundHistoryResponseValidator } from './models/RefundHistoryResponse';
import { SendTestNotificationResponse, SendTestNotificationResponseValidator } from './models/SendTestNotificationResponse';
import { StatusResponse, StatusResponseValidator } from './models/StatusResponse';
import { TransactionHistoryRequest } from './models/TransactionHistoryRequest';
import { TransactionInfoResponse, TransactionInfoResponseValidator } from './models/TransactionInfoResponse';
import { PerformanceTestRequest, PerformanceTestRequestValidator } from './models/PerformanceTestRequest';
import { PerformanceTestResponse, PerformanceTestResponseValidator } from './models/PerformanceTestResponse';
import { PerformanceTestResultResponse, PerformanceTestResultResponseValidator } from './models/PerformanceTestResultResponse';
import { UploadMessageRequestBody, UploadMessageRequestBodyValidator } from './models/UploadMessageRequestBody';
import { RealtimeUrlRequest, RealtimeUrlRequestValidator } from './models/RealtimeUrlRequest';
import { RealtimeUrlResponse, RealtimeUrlResponseValidator } from './models/RealtimeUrlResponse';
import { Validator } from './models/Validator';
import { Status } from './models/Status';
export { HelperValidationUtils } from './helper_validation_utils'
export { PromotionalOfferV2SignatureCreator, AdvancedCommerceInAppSignatureCreator, AdvancedCommerceInAppRequest, IntroductoryOfferEligibilitySignatureCreator } from './jws_signature_creator'
export { SignedDataVerifier, VerificationException, VerificationStatus, CacheValue } from './jws_verification'
export { AbstractAdvancedCommerceBaseItem } from './models/AbstractAdvancedCommerceBaseItem'
export { AbstractAdvancedCommerceInAppRequest } from './models/AbstractAdvancedCommerceInAppRequest'
export { AbstractAdvancedCommerceItem } from './models/AbstractAdvancedCommerceItem'
export { AbstractAdvancedCommerceResponse } from './models/AbstractAdvancedCommerceResponse'
export { AccountTenure } from './models/AccountTenure'
export { AdvancedCommerceDescriptors } from './models/AdvancedCommerceDescriptors'
export { AdvancedCommerceEffective } from './models/AdvancedCommerceEffective'
export { AdvancedCommerceInfo } from './models/AdvancedCommerceInfo'
export { AdvancedCommerceOffer } from './models/AdvancedCommerceOffer'
export { AdvancedCommerceOfferPeriod } from './models/AdvancedCommerceOfferPeriod'
export { AdvancedCommerceOfferReason } from './models/AdvancedCommerceOfferReason'
export { AdvancedCommerceOneTimeChargeCreateRequest } from './models/AdvancedCommerceOneTimeChargeCreateRequest'
export { AdvancedCommerceOneTimeChargeItem } from './models/AdvancedCommerceOneTimeChargeItem'
export { AdvancedCommercePeriod } from './models/AdvancedCommercePeriod'
export { AdvancedCommercePriceIncreaseInfo } from './models/AdvancedCommercePriceIncreaseInfo'
export { AdvancedCommercePriceIncreaseInfoStatus } from './models/AdvancedCommercePriceIncreaseInfoStatus'
export { AdvancedCommerceReason } from './models/AdvancedCommerceReason'
export { AdvancedCommerceRefund } from './models/AdvancedCommerceRefund'
export { AdvancedCommerceRefundReason } from './models/AdvancedCommerceRefundReason'
export { AdvancedCommerceRefundType } from './models/AdvancedCommerceRefundType'
export { AdvancedCommerceRenewalInfo } from './models/AdvancedCommerceRenewalInfo'
export { AdvancedCommerceRenewalItem } from './models/AdvancedCommerceRenewalItem'
export { AdvancedCommerceRequest } from './models/AdvancedCommerceRequest'
export { AdvancedCommerceRequestInfo } from './models/AdvancedCommerceRequestInfo'
export { AdvancedCommerceRequestRefundItem } from './models/AdvancedCommerceRequestRefundItem'
export { AdvancedCommerceRequestRefundRequest } from './models/AdvancedCommerceRequestRefundRequest'
export { AdvancedCommerceRequestRefundResponse } from './models/AdvancedCommerceRequestRefundResponse'
export { AdvancedCommerceSubscriptionCancelRequest } from './models/AdvancedCommerceSubscriptionCancelRequest'
export { AdvancedCommerceSubscriptionCancelResponse } from './models/AdvancedCommerceSubscriptionCancelResponse'
export { AdvancedCommerceSubscriptionChangeMetadataDescriptors } from './models/AdvancedCommerceSubscriptionChangeMetadataDescriptors'
export { AdvancedCommerceSubscriptionChangeMetadataItem } from './models/AdvancedCommerceSubscriptionChangeMetadataItem'
export { AdvancedCommerceSubscriptionChangeMetadataRequest } from './models/AdvancedCommerceSubscriptionChangeMetadataRequest'
export { AdvancedCommerceSubscriptionChangeMetadataResponse } from './models/AdvancedCommerceSubscriptionChangeMetadataResponse'
export { AdvancedCommerceSubscriptionCreateItem } from './models/AdvancedCommerceSubscriptionCreateItem'
export { AdvancedCommerceSubscriptionCreateRequest } from './models/AdvancedCommerceSubscriptionCreateRequest'
export { AdvancedCommerceSubscriptionMigrateDescriptors } from './models/AdvancedCommerceSubscriptionMigrateDescriptors'
export { AdvancedCommerceSubscriptionMigrateItem } from './models/AdvancedCommerceSubscriptionMigrateItem'
export { AdvancedCommerceSubscriptionMigrateRenewalItem } from './models/AdvancedCommerceSubscriptionMigrateRenewalItem'
export { AdvancedCommerceSubscriptionMigrateRequest } from './models/AdvancedCommerceSubscriptionMigrateRequest'
export { AdvancedCommerceSubscriptionMigrateResponse } from './models/AdvancedCommerceSubscriptionMigrateResponse'
export { AdvancedCommerceSubscriptionModifyAddItem } from './models/AdvancedCommerceSubscriptionModifyAddItem'
export { AdvancedCommerceSubscriptionModifyChangeItem } from './models/AdvancedCommerceSubscriptionModifyChangeItem'
export { AdvancedCommerceSubscriptionModifyDescriptors } from './models/AdvancedCommerceSubscriptionModifyDescriptors'
export { AdvancedCommerceSubscriptionModifyInAppRequest } from './models/AdvancedCommerceSubscriptionModifyInAppRequest'
export { AdvancedCommerceSubscriptionModifyPeriodChange } from './models/AdvancedCommerceSubscriptionModifyPeriodChange'
export { AdvancedCommerceSubscriptionModifyRemoveItem } from './models/AdvancedCommerceSubscriptionModifyRemoveItem'
export { AdvancedCommerceSubscriptionPriceChangeItem } from './models/AdvancedCommerceSubscriptionPriceChangeItem'
export { AdvancedCommerceSubscriptionPriceChangeRequest } from './models/AdvancedCommerceSubscriptionPriceChangeRequest'
export { AdvancedCommerceSubscriptionPriceChangeResponse } from './models/AdvancedCommerceSubscriptionPriceChangeResponse'
export { AdvancedCommerceSubscriptionReactivateInAppRequest } from './models/AdvancedCommerceSubscriptionReactivateInAppRequest'
export { AdvancedCommerceSubscriptionReactivateItem } from './models/AdvancedCommerceSubscriptionReactivateItem'
export { AdvancedCommerceSubscriptionRevokeRequest } from './models/AdvancedCommerceSubscriptionRevokeRequest'
export { AdvancedCommerceSubscriptionRevokeResponse } from './models/AdvancedCommerceSubscriptionRevokeResponse'
export { AdvancedCommerceTransactionInfo } from './models/AdvancedCommerceTransactionInfo'
export { AdvancedCommerceTransactionItem } from './models/AdvancedCommerceTransactionItem'
export { AlternateProduct } from './models/AlternateProduct'
export { AppData } from './models/AppData'
export { AppTransaction } from './models/AppTransaction'
export { AppTransactionInfoResponse } from './models/AppTransactionInfoResponse'
export { AutoRenewStatus } from './models/AutoRenewStatus'
export { BillingPlanType } from './models/BillingPlanType'
export { BulletPoint } from './models/BulletPoint'
export { CheckTestNotificationResponse } from './models/CheckTestNotificationResponse'
export { ConsumptionRequest } from './models/ConsumptionRequest'
export { ConsumptionRequestReason } from './models/ConsumptionRequestReason'
export { ConsumptionRequestV1 } from './models/ConsumptionRequestV1'
export { ConsumptionStatus } from './models/ConsumptionStatus'
export { Data } from './models/Data'
export { DecodedRealtimeRequestBody } from './models/DecodedRealtimeRequestBody'
export { DecodedSignedData } from './models/DecodedSignedData'
export { DefaultConfigurationRequest } from './models/DefaultConfigurationRequest'
export { DefaultConfigurationResponse } from './models/DefaultConfigurationResponse'
export { DeliveryStatus } from './models/DeliveryStatus'
export { DeliveryStatusV1 } from './models/DeliveryStatusV1'
export { Environment } from './models/Environment'
export { ExpirationIntent } from './models/ExpirationIntent'
export { ExtendReasonCode } from './models/ExtendReasonCode'
export { ExtendRenewalDateRequest } from './models/ExtendRenewalDateRequest'
export { ExtendRenewalDateResponse } from './models/ExtendRenewalDateResponse'
export { ExternalPurchaseToken } from './models/ExternalPurchaseToken'
export { GetCustomerGroupsResponse } from './models/GetCustomerGroupsResponse'
export { GetGroupMembersResponse } from './models/GetGroupMembersResponse'
export { GetImageListResponse } from './models/GetImageListResponse'
export { GetImageListResponseItem } from './models/GetImageListResponseItem'
export { GetMessageListResponse } from './models/GetMessageListResponse'
export { GetMessageListResponseItem } from './models/GetMessageListResponseItem'
export { GroupEntry } from './models/GroupEntry'
export { GroupMemberEntry } from './models/GroupMemberEntry'
export { GroupType } from './models/GroupType'
export { HeaderPosition } from './models/HeaderPosition'
export { HistoryResponse } from './models/HistoryResponse'
export { ImageSize } from './models/ImageSize'
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
export { OfferDiscountType } from './models/OfferDiscountType'
export { OfferType } from './models/OfferType'
export { OrderLookupResponse } from './models/OrderLookupResponse'
export { OrderLookupStatus } from './models/OrderLookupStatus'
export { PerformanceTestConfig } from './models/PerformanceTestConfig'
export { PerformanceTestRequest } from './models/PerformanceTestRequest'
export { PerformanceTestResponse } from './models/PerformanceTestResponse'
export { PerformanceTestResponseTimes } from './models/PerformanceTestResponseTimes'
export { PerformanceTestResultResponse } from './models/PerformanceTestResultResponse'
export { PerformanceTestStatus } from './models/PerformanceTestStatus'
export { Platform } from './models/Platform'
export { PlayTime } from './models/PlayTime'
export { PriceIncreaseStatus } from './models/PriceIncreaseStatus'
export { PromotionalOffer } from './models/PromotionalOffer'
export { PromotionalOfferSignatureV1 } from './models/PromotionalOfferSignatureV1'
export { PurchasePlatform } from './models/PurchasePlatform'
export { RealtimeRequestBody } from './models/RealtimeRequestBody'
export { RealtimeResponseBody } from './models/RealtimeResponseBody'
export { RealtimeUrlRequest } from './models/RealtimeUrlRequest'
export { RealtimeUrlResponse } from './models/RealtimeUrlResponse'
export { RefundHistoryResponse } from './models/RefundHistoryResponse'
export { RefundPreference } from './models/RefundPreference'
export { RefundPreferenceV1 } from './models/RefundPreferenceV1'
export { RenewalBillingPlanType } from './models/RenewalBillingPlanType'
export { RenewalCommitmentInfo } from './models/RenewalCommitmentInfo'
export { ResponseBodyV2 } from './models/ResponseBodyV2'
export { ResponseBodyV2DecodedPayload } from './models/ResponseBodyV2DecodedPayload'
export { RevocationReason } from './models/RevocationReason'
export { RevocationType } from './models/RevocationType'
export { Role } from './models/Role'
export { RoleEntry } from './models/RoleEntry'
export { SendAttemptItem } from './models/SendAttemptItem'
export { SendAttemptResult } from './models/SendAttemptResult'
export { SendTestNotificationResponse } from './models/SendTestNotificationResponse'
export { Status } from './models/Status'
export { StatusResponse } from './models/StatusResponse'
export { StoreType } from './models/StoreType'
export { SubscriptionGroupIdentifierItem } from './models/SubscriptionGroupIdentifierItem'
export { Subtype } from './models/Subtype'
export { Summary } from './models/Summary'
export { TokenType } from './models/TokenType'
export { TransactionCommitmentInfo } from './models/TransactionCommitmentInfo'
export { TransactionHistoryRequest, Order, ProductType } from './models/TransactionHistoryRequest'
export { TransactionInfoResponse } from './models/TransactionInfoResponse'
export { TransactionReason } from './models/TransactionReason'
export { Type } from './models/Type'
export { UpdateAppAccountTokenRequest } from './models/UpdateAppAccountTokenRequest'
export { UploadMessageImage } from './models/UploadMessageImage'
export { UploadMessageRequestBody } from './models/UploadMessageRequestBody'
export { UserStatus } from './models/UserStatus'
export { Validator } from './models/Validator'
export { PromotionalOfferSignatureCreator } from './promotional_offer'
export { ReceiptUtility } from './receipt_utility'

import jsonwebtoken = require('jsonwebtoken');
import { AdvancedCommerceRequestRefundRequest, AdvancedCommerceRequestRefundRequestValidator } from './models/AdvancedCommerceRequestRefundRequest';
import { AdvancedCommerceRequestRefundResponse, AdvancedCommerceRequestRefundResponseValidator } from './models/AdvancedCommerceRequestRefundResponse';
import { AdvancedCommerceSubscriptionCancelRequest, AdvancedCommerceSubscriptionCancelRequestValidator } from './models/AdvancedCommerceSubscriptionCancelRequest';
import { AdvancedCommerceSubscriptionCancelResponse, AdvancedCommerceSubscriptionCancelResponseValidator } from './models/AdvancedCommerceSubscriptionCancelResponse';
import { AdvancedCommerceSubscriptionChangeMetadataRequest, AdvancedCommerceSubscriptionChangeMetadataRequestValidator } from './models/AdvancedCommerceSubscriptionChangeMetadataRequest';
import { AdvancedCommerceSubscriptionChangeMetadataResponse, AdvancedCommerceSubscriptionChangeMetadataResponseValidator } from './models/AdvancedCommerceSubscriptionChangeMetadataResponse';
import { AdvancedCommerceSubscriptionMigrateRequest, AdvancedCommerceSubscriptionMigrateRequestValidator } from './models/AdvancedCommerceSubscriptionMigrateRequest';
import { AdvancedCommerceSubscriptionMigrateResponse, AdvancedCommerceSubscriptionMigrateResponseValidator } from './models/AdvancedCommerceSubscriptionMigrateResponse';
import { AdvancedCommerceSubscriptionPriceChangeRequest, AdvancedCommerceSubscriptionPriceChangeRequestValidator } from './models/AdvancedCommerceSubscriptionPriceChangeRequest';
import { AdvancedCommerceSubscriptionPriceChangeResponse, AdvancedCommerceSubscriptionPriceChangeResponseValidator } from './models/AdvancedCommerceSubscriptionPriceChangeResponse';
import { AdvancedCommerceSubscriptionRevokeRequest, AdvancedCommerceSubscriptionRevokeRequestValidator } from './models/AdvancedCommerceSubscriptionRevokeRequest';
import { AdvancedCommerceSubscriptionRevokeResponse, AdvancedCommerceSubscriptionRevokeResponseValidator } from './models/AdvancedCommerceSubscriptionRevokeResponse';
import { AppTransactionInfoResponse, AppTransactionInfoResponseValidator } from './models/AppTransactionInfoResponse';
import { NotificationHistoryRequest, NotificationHistoryRequestValidator } from './models/NotificationHistoryRequest';
import { NotificationHistoryResponse, NotificationHistoryResponseValidator } from './models/NotificationHistoryResponse';
import { URLSearchParams } from 'url';

function encodePathSegment(pathSegment: string): string {
    const encoded = encodeURIComponent(pathSegment)
    if (encoded === '' || encoded === '.' || encoded === '..') {
        throw new Error()
    }
    return encoded
}

function path(strings: TemplateStringsArray, ...pathParameters: string[]): string {
    let result = strings[0]
    for (let i = 0; i < pathParameters.length; i++) {
        result += encodePathSegment(pathParameters[i]) + strings[i + 1]
    }
    return result
}

export class AppStoreServerAPIClient {
    private static PRODUCTION_URL = "https://api.storekit.apple.com";
    private static SANDBOX_URL = "https://api.storekit-sandbox.apple.com";
    private static LOCAL_TESTING_URL = "https://local-testing-base-url";
    private static USER_AGENT = "app-store-server-library/node/3.1.0";
    private static REQUEST_TIMEOUT_MS = 30000;

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

        const responseHeaders: { [key: string]: string[] } = {}
        for (const [key, values] of Object.entries(response.headers.raw())) {
            const lowercasedKey = key.toLowerCase()
            responseHeaders[lowercasedKey] = (responseHeaders[lowercasedKey] ?? []).concat(values)
        }

        try {
            const responseBody = await response.json()
            const errorCode = responseBody['errorCode']
            const errorMessage = responseBody['errorMessage']

            if (errorCode) {
                throw new APIException(response.status, errorCode, errorMessage, responseHeaders)
            }

            throw new APIException(response.status, null, null, responseHeaders)
        } catch (e) {
            if (e instanceof APIException) {
                throw e
            }

            throw new APIException(response.status, null, null, responseHeaders)
        }
    }

    protected async makeFetchRequest(path: string, parsedQueryParameters: URLSearchParams, method: string, requestBody: string | Buffer | undefined, headers: { [key: string]: string; }) {
        return await fetch(this.urlBase + path + '?' + parsedQueryParameters, {
            method: method,
            body: requestBody,
            headers: headers,
            timeout: AppStoreServerAPIClient.REQUEST_TIMEOUT_MS
        });
    }

    /**
     * Uses a subscription’s product identifier to extend the renewal date for all of its eligible active subscribers.
     *
     * @param massExtendRenewalDateRequest The request body for extending a subscription renewal date for all of its active subscribers.
     * @return A response that indicates the server successfully received the subscription-renewal-date extension request.
     * @throws APIException If a response was returned indicating the request could not be processed
     * @throws Error If the request body is invalid
     * {@link https://developer.apple.com/documentation/appstoreserverapi/extend-subscription-renewal-dates-for-all-active-subscribers Extend Subscription Renewal Dates for All Active Subscribers}
     */
    public async extendRenewalDateForAllActiveSubscribers(massExtendRenewalDateRequest: MassExtendRenewalDateRequest): Promise<MassExtendRenewalDateResponse> {
        this.validateRequestBody(massExtendRenewalDateRequest, new MassExtendRenewalDateRequestValidator())
        return await this.makeRequest("/inApps/v1/subscriptions/extend/mass", "POST", {}, massExtendRenewalDateRequest, new MassExtendRenewalDateResponseValidator(), 'application/json');
    }

    /**
     * Extends the renewal date of a customer’s active subscription using the original transaction identifier.
     *
     * @param originalTransactionId    The original transaction identifier of the subscription receiving a renewal date extension.
     * @param extendRenewalDateRequest The request body containing subscription-renewal-extension data.
     * @return A response that indicates whether an individual renewal-date extension succeeded, and related details.
     * @throws APIException If a response was returned indicating the request could not be processed
     * @throws Error If the request body is invalid
     * {@link https://developer.apple.com/documentation/appstoreserverapi/extend-a-subscription-renewal-date Extend a Subscription Renewal Date}
     */
    public async extendSubscriptionRenewalDate(originalTransactionId: string, extendRenewalDateRequest: ExtendRenewalDateRequest): Promise<ExtendRenewalDateResponse> {
        this.validateRequestBody(extendRenewalDateRequest, new ExtendRenewalDateRequestValidator())
        return await this.makeRequest<ExtendRenewalDateResponse>(path`/inApps/v1/subscriptions/extend/${originalTransactionId}`, "PUT", {}, extendRenewalDateRequest, new ExtendRenewalDateResponseValidator(), 'application/json');
    }

    /**
     * Get the statuses for all of a customer’s auto-renewable subscriptions in your app.
     *
     * @param anyTransactionId Any transactionId, originalTransactionId, or appTransactionId that belongs to the customer for your app.
     * @param status An optional filter that indicates the status of subscriptions to include in the response. Your query may specify more than one status query parameter.
     * @return A response that contains status information for all of a customer’s auto-renewable subscriptions in your app.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/get-all-subscription-statuses Get All Subscription Statuses}
     */
    public async getAllSubscriptionStatuses(anyTransactionId: string, status: Status[] | undefined = undefined): Promise<StatusResponse> {
        const queryParameters: { [key: string]: [string]} = {}
        if (status != null) {
            queryParameters["status"] = status.map(s => s.toString()) as [string];
        }

        return await this.makeRequest(path`/inApps/v1/subscriptions/${anyTransactionId}`, "GET", queryParameters, null, new StatusResponseValidator(), undefined);
    }

    /**
     * Get a paginated list of all of a customer’s refunded in-app purchases for your app.
     *
     * @param anyTransactionId Any transactionId, originalTransactionId, or appTransactionId that belongs to the customer for your app.
     * @param revision              A token you provide to get the next set of up to 20 transactions. All responses include a revision token. Use the revision token from the previous RefundHistoryResponse.
     * @return A response that contains an array of signed JSON Web Signature (JWS) refunded transactions, and paging information.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/get-refund-history Get Refund History}
     */
    public async getRefundHistory(anyTransactionId: string, revision: string | null): Promise<RefundHistoryResponse> {
        const queryParameters: { [key: string]: [string]} = {}
        if (revision != null) {
            queryParameters["revision"] = [revision];
        }

        return await this.makeRequest(path`/inApps/v2/refund/lookup/${anyTransactionId}`, "GET", queryParameters, null, new RefundHistoryResponseValidator(), undefined);
    }

    /**
     * Checks whether a renewal date extension request completed, and provides the final count of successful or failed extensions.
     *
     * @param requestIdentifier The UUID that represents your request to the Extend Subscription Renewal Dates for All Active Subscribers endpoint.
     * @param productId         The product identifier of the auto-renewable subscription that you request a renewal-date extension for.
     * @return A response that indicates the current status of a request to extend the subscription renewal date to all eligible subscribers.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/get-status-of-subscription-renewal-date-extensions Get Status of Subscription Renewal Date Extensions}
     */
    public async getStatusOfSubscriptionRenewalDateExtensions(requestIdentifier: string, productId: string): Promise<MassExtendRenewalDateStatusResponse> {
        return await this.makeRequest(path`/inApps/v1/subscriptions/extend/mass/${productId}/${requestIdentifier}`, "GET", {}, null, new MassExtendRenewalDateStatusResponseValidator(), undefined);
    }

    /**
     * Check the status of the test App Store server notification sent to your server.
     *
     * @param testNotificationToken The test notification token received from the Request a Test Notification endpoint
     * @return A response that contains the contents of the App Store server’s test notification and the result from your server.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/get-test-notification-status Get Test Notification Status}
     */
    public async getTestNotificationStatus(testNotificationToken: string): Promise<CheckTestNotificationResponse> {
        return await this.makeRequest(path`/inApps/v1/notifications/test/${testNotificationToken}`, "GET", {}, null, new CheckTestNotificationResponseValidator(), undefined);
    }

    /**
     * Get a list of notifications that the App Store server attempted to send to your server.
     *
     * @param paginationToken An optional token you use to get the next set of up to 20 notification history records. All responses that have more records available include a paginationToken. Omit this parameter the first time you call this endpoint.
     * @param notificationHistoryRequest The request body that includes the start and end dates, and optional query constraints.
     * @return A response that contains the App Store Server Notifications history for your app.
     * @throws APIException If a response was returned indicating the request could not be processed
     * @throws Error If the request body is invalid
     * {@link https://developer.apple.com/documentation/appstoreserverapi/get-notification-history Get Notification History}
     */
    public async getNotificationHistory(paginationToken: string | null, notificationHistoryRequest: NotificationHistoryRequest): Promise<NotificationHistoryResponse> {
        this.validateRequestBody(notificationHistoryRequest, new NotificationHistoryRequestValidator())
        const queryParameters: { [key: string]: [string]} = {}
        if (paginationToken != null) {
            queryParameters["paginationToken"] = [paginationToken];
        }
        return await this.makeRequest("/inApps/v1/notifications/history", "POST", queryParameters, notificationHistoryRequest, new NotificationHistoryResponseValidator(), 'application/json');
    }

    /**
     * Get a customer’s in-app purchase transaction history for your app.
     *
     * @param anyTransactionId Any transactionId, originalTransactionId, or appTransactionId that belongs to the customer for your app.
     * @param revision              A token you provide to get the next set of up to 20 transactions. All responses include a revision token. Note: For requests that use the revision token, include the same query parameters from the initial request. Use the revision token from the previous HistoryResponse.
     * @param version The version of the Get Transaction History endpoint to use. V2 is recommended.
     * @return A response that contains the customer’s transaction history for an app.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/get-transaction-history Get Transaction History}
     */
    public async getTransactionHistory(anyTransactionId: string, revision: string | null, transactionHistoryRequest: TransactionHistoryRequest, version: GetTransactionHistoryVersion = GetTransactionHistoryVersion.V1): Promise<HistoryResponse> {
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
        return await this.makeRequest(path`/inApps/${version}/history/${anyTransactionId}`, "GET", queryParameters, null, new HistoryResponseValidator(), undefined);
    }

    /**
     * Get information about a single transaction for your app.
     *
     * @param transactionId The identifier of a transaction that belongs to the customer, and which may be an original transaction identifier.
     * @return A response that contains signed transaction information for a single transaction.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/get-transaction-info Get Transaction Info}
     */
    public async getTransactionInfo(transactionId: string): Promise<TransactionInfoResponse> {
        return await this.makeRequest(path`/inApps/v1/transactions/${transactionId}`, "GET", {}, null, new TransactionInfoResponseValidator(), undefined);
    }

    /**
     * Get a customer’s in-app purchases from a receipt using the order ID.
     *
     * @param orderId The order ID for in-app purchases that belong to the customer.
     * @return A response that includes the order lookup status and an array of signed transactions for the in-app purchases in the order.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/look-up-order-id Look Up Order ID}
     */
    public async lookUpOrderId(orderId: string): Promise<OrderLookupResponse> {
        return await this.makeRequest(path`/inApps/v1/lookup/${orderId}`, "GET", {}, null, new OrderLookupResponseValidator(), undefined);
    }

    /**
     * Ask App Store Server Notifications to send a test notification to your server.
     *
     * @return A response that contains the test notification token.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/request-a-test-notification Request a Test Notification}
     */
    public async requestTestNotification(): Promise<SendTestNotificationResponse> {
        return await this.makeRequest("/inApps/v1/notifications/test", "POST", {}, null, new SendTestNotificationResponseValidator(), undefined);
    }

    /**
     * Send consumption information about a consumable In-App Purchase or auto-renewable subscription to the App Store after your server receives a consumption request notification.
     *
     * @param transactionId The transaction identifier for which you're providing consumption information. You receive this identifier in the CONSUMPTION_REQUEST notification the App Store sends to your server.
     * @param consumptionRequest    The request body containing consumption information.
     * @throws APIException If a response was returned indicating the request could not be processed
     * @throws Error If the request body is invalid
     * @deprecated Use {@link sendConsumptionInformation} instead
     * {@link https://developer.apple.com/documentation/appstoreserverapi/send-consumption-information-v1 Send Consumption Information V1}
     */
    public async sendConsumptionData(transactionId: string, consumptionRequest: ConsumptionRequestV1): Promise<void> {
        const requestBody: ConsumptionRequestV1 = { ...consumptionRequest, appAccountToken: consumptionRequest?.appAccountToken ?? "" }
        this.validateRequestBody(requestBody, new ConsumptionRequestV1Validator())
        await this.makeRequest(path`/inApps/v1/transactions/consumption/${transactionId}`, "PUT", {}, requestBody, null, 'application/json');
    }

    /**
     * Send consumption information about an In-App Purchase to the App Store after your server receives a consumption request notification.
     *
     * @param transactionId The transaction identifier for which you're providing consumption information. You receive this identifier in the CONSUMPTION_REQUEST notification the App Store sends to your server's App Store Server Notifications V2 endpoint.
     * @param consumptionRequest The request body containing consumption information.
     * @throws APIException If a response was returned indicating the request could not be processed
     * @throws Error If the request body is invalid
     * {@link https://developer.apple.com/documentation/appstoreserverapi/send-consumption-information Send Consumption Information}
     */
    public async sendConsumptionInformation(transactionId: string, consumptionRequest: ConsumptionRequest): Promise<void> {
        this.validateRequestBody(consumptionRequest, new ConsumptionRequestValidator())
        await this.makeRequest(path`/inApps/v2/transactions/consumption/${transactionId}`, "PUT", {}, consumptionRequest, null, 'application/json');
    }

    /**
     * Sets the app account token value for a purchase the customer makes outside of your app, or updates its value in an existing transaction.
     *
     * @param originalTransactionId The original transaction identifier of the transaction to receive the app account token update.
     * @param updateAppAccountTokenRequest The request body that contains a valid app account token value.
     * @throws APIException If a response was returned indicating the request could not be processed.
     * @throws Error If the request body is invalid
     * {@link https://developer.apple.com/documentation/appstoreserverapi/set-app-account-token Set App Account Token}
     */
    public async setAppAccountToken(originalTransactionId: string, updateAppAccountTokenRequest: UpdateAppAccountTokenRequest): Promise<void> {
        this.validateRequestBody(updateAppAccountTokenRequest, new UpdateAppAccountTokenRequestValidator())
        await this.makeRequest(path`/inApps/v1/transactions/${originalTransactionId}/appAccountToken`, "PUT", {}, updateAppAccountTokenRequest, null, 'application/json');
    }

    /**
     * Uploads an image to use for retention messaging.
     *
     * @param imageIdentifier A UUID you provide to uniquely identify the image you upload. Must be lowercase.
     * @param image The image file to upload.
     * @param imageSize The size of the image you upload.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/upload-image Upload Image}
     */
    public async uploadImage(imageIdentifier: string, image: Buffer, imageSize?: ImageSize | string): Promise<void> {
        const queryParameters: { [key: string]: string[]} = {}
        if (imageSize != null) {
            queryParameters["imageSize"] = [imageSize]
        }
        await this.makeRequest(path`/inApps/v1/messaging/image/${imageIdentifier}`, "PUT", queryParameters, image, null, 'image/png');
    }

    /**
     * Deletes a previously uploaded image.
     *
     * @param imageIdentifier The identifier of the image to delete.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/delete-image Delete Image}
     */
    public async deleteImage(imageIdentifier: string): Promise<void> {
        await this.makeRequest(path`/inApps/v1/messaging/image/${imageIdentifier}`, "DELETE", {}, null, null, undefined);
    }

    /**
     * Gets the image identifier and state for all uploaded images.
     *
     * @return A response that contains status information for all images.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/get-image-list Get Image List}
     */
    public async getImageList(): Promise<GetImageListResponse> {
        return await this.makeRequest("/inApps/v1/messaging/image/list", "GET", {}, null, new GetImageListResponseValidator(), undefined);
    }

    /**
     * Uploads a message to use for retention messaging.
     *
     * @param messageIdentifier A UUID you provide to uniquely identify the message you upload. Must be lowercase.
     * @param uploadMessageRequestBody The message text to upload.
     * @throws APIException If a response was returned indicating the request could not be processed
     * @throws Error If the request body is invalid
     * {@link https://developer.apple.com/documentation/retentionmessaging/upload-message Upload Message}
     */
    public async uploadMessage(messageIdentifier: string, uploadMessageRequestBody: UploadMessageRequestBody): Promise<void> {
        this.validateRequestBody(uploadMessageRequestBody, new UploadMessageRequestBodyValidator())
        await this.makeRequest(path`/inApps/v1/messaging/message/${messageIdentifier}`, "PUT", {}, uploadMessageRequestBody, null, 'application/json');
    }

    /**
     * Deletes a previously uploaded message.
     *
     * @param messageIdentifier The identifier of the message to delete.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/delete-message Delete Message}
     */
    public async deleteMessage(messageIdentifier: string): Promise<void> {
        await this.makeRequest(path`/inApps/v1/messaging/message/${messageIdentifier}`, "DELETE", {}, null, null, undefined);
    }

    /**
     * Gets the message identifier and state of all uploaded messages.
     *
     * @return A response that contains status information for all messages.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/get-message-list Get Message List}
     */
    public async getMessageList(): Promise<GetMessageListResponse> {
        return await this.makeRequest("/inApps/v1/messaging/message/list", "GET", {}, null, new GetMessageListResponseValidator(), undefined);
    }

    /**
     * Configures a default message for a specific product in a specific locale.
     *
     * @param productId The product identifier for the default configuration.
     * @param locale The locale for the default configuration.
     * @param defaultConfigurationRequest The request body that includes the message identifier to configure as the default message.
     * @throws APIException If a response was returned indicating the request could not be processed
     * @throws Error If the request body is invalid
     * {@link https://developer.apple.com/documentation/retentionmessaging/configure-default-message Configure Default Message}
     */
    public async configureDefaultMessage(productId: string, locale: string, defaultConfigurationRequest: DefaultConfigurationRequest): Promise<void> {
        this.validateRequestBody(defaultConfigurationRequest, new DefaultConfigurationRequestValidator())
        await this.makeRequest(path`/inApps/v1/messaging/default/${productId}/${locale}`, "PUT", {}, defaultConfigurationRequest, null, 'application/json');
    }

    /**
     * Deletes a default message for a product in a locale.
     *
     * @param productId The product ID of the default message configuration.
     * @param locale The locale of the default message configuration.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/delete-default-message Delete Default Message}
     */
    public async deleteDefaultMessage(productId: string, locale: string): Promise<void> {
        await this.makeRequest(path`/inApps/v1/messaging/default/${productId}/${locale}`, "DELETE", {}, null, null, undefined);
    }

    /**
     * Gets the default message for a specific product in a specific locale, if it’s configured.
     *
     * @param productId The product identifier of the message.
     * @param locale The locale of the message.
     * @return The response body that contains the default configuration information.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/get-default-message Get Default Message}
     */
    public async getDefaultMessage(productId: string, locale: string): Promise<DefaultConfigurationResponse> {
        return await this.makeRequest(path`/inApps/v1/messaging/default/${productId}/${locale}`, "GET", {}, null, new DefaultConfigurationResponseValidator(), undefined);
    }

    /**
     * Configures the URL for your Get Retention Message endpoint in the sandbox and production environments.
     *
     * @param realtimeUrlRequest The request body that includes your endpoint’s URL.
     * @throws APIException If a response was returned indicating the request could not be processed
     * @throws Error If the request body is invalid
     * {@link https://developer.apple.com/documentation/retentionmessaging/configure-realtime-url Configure Realtime URL}
     */
    public async configureRealtimeURL(realtimeUrlRequest: RealtimeUrlRequest): Promise<void> {
        this.validateRequestBody(realtimeUrlRequest, new RealtimeUrlRequestValidator())
        await this.makeRequest("/inApps/v1/messaging/realtime/url", "PUT", {}, realtimeUrlRequest, null, 'application/json');
    }

    /**
     * Deletes the URL for your Get Retention Message endpoint, in the sandbox or production environments.
     *
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/delete-realtime-url Delete Realtime URL}
     */
    public async deleteRealtimeURL(): Promise<void> {
        await this.makeRequest("/inApps/v1/messaging/realtime/url", "DELETE", {}, null, null, undefined);
    }

    /**
     * Gets the URL for real-time messages that points to your Get Retention Message endpoint, which you previously configured.
     *
     * @return The response body that contains the URL for your Get Retention Message endpoint.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/get-realtime-url Get Realtime URL}
     */
    public async getRealtimeURL(): Promise<RealtimeUrlResponse> {
        return await this.makeRequest("/inApps/v1/messaging/realtime/url", "GET", {}, null, new RealtimeUrlResponseValidator(), undefined);
    }

    /**
     * Initiates a performance test of your Get Retention Message endpoint in the sandbox environment.
     *
     * @param performanceTestRequest The request body which specifies a transaction identifier of an In-App Purchase to use for this test.
     * @return The performance test response object.
     * @throws APIException If a response was returned indicating the request could not be processed
     * @throws Error If the request body is invalid
     * {@link https://developer.apple.com/documentation/retentionmessaging/initiate-performance-test Initiate Performance Test}
     */
    public async initiatePerformanceTest(performanceTestRequest: PerformanceTestRequest): Promise<PerformanceTestResponse> {
        this.validateRequestBody(performanceTestRequest, new PerformanceTestRequestValidator())
        return await this.makeRequest("/inApps/v1/messaging/performanceTest", "POST", {}, performanceTestRequest, new PerformanceTestResponseValidator(), 'application/json');
    }

    /**
     * Gets the results of the performance test for the specified identifier.
     *
     * @param requestId The ID of the performance test to return, which you receive in the PerformanceTestResponse when you call Initiate Performance Test.
     * @return An object the API returns that describes the performance test results.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/retentionmessaging/get-performance-test-results Get Performance Test Results}
     */
    public async getPerformanceTestResults(requestId: string): Promise<PerformanceTestResultResponse> {
        return await this.makeRequest(path`/inApps/v1/messaging/performanceTest/result/${requestId.toLowerCase()}`, "GET", {}, null, new PerformanceTestResultResponseValidator(), undefined);
    }

    /**
      * Get a customer's app transaction information for your app.
      *
      * @param anyTransactionId Any transactionId, originalTransactionId, or appTransactionId that belongs to the customer for your app.
      * @return A response that contains signed app transaction information for a customer.
      * @throws APIException If a response was returned indicating the request could not be processed
      * {@link https://developer.apple.com/documentation/appstoreserverapi/get-app-transaction-info Get App Transaction Info}
      */
     public async getAppTransactionInfo(anyTransactionId: string): Promise<AppTransactionInfoResponse> {
         return await this.makeRequest(path`/inApps/v1/transactions/appTransactions/${anyTransactionId}`, "GET", {}, null, new AppTransactionInfoResponseValidator(), undefined);
     }

    /**
     * Notifies the App Store server that your system has finished processing the customer's transaction.
     *
     * @param transactionId The transaction identifier of the transaction to mark as finished.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/finish-transaction Finish Transaction}
     */
    public async finishTransaction(transactionId: string): Promise<void> {
        await this.makeRequest(path`/inApps/v1/transactions/${transactionId}/finish`, "POST", {}, null, null, undefined);
    }

    /**
     * Increase or decrease the price of an auto-renewable subscription, a bundle, or individual items within a subscription at the next renewal.
     *
     * @param transactionId A transaction identifier of the auto-renewable subscription that is subject to the price change.
     * @param subscriptionPriceChangeRequest The request body that contains the details of the price change.
     * @return A response that contains signed JWS renewal and JWS transaction information after a subscription price change request.
     * @throws APIException If a response was returned indicating the request could not be processed
     * @throws Error If the request body is invalid
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/change-subscription-price Change Subscription Price}
     */
    public async changeSubscriptionPrice(transactionId: string, subscriptionPriceChangeRequest: AdvancedCommerceSubscriptionPriceChangeRequest): Promise<AdvancedCommerceSubscriptionPriceChangeResponse> {
        this.validateRequestBody(subscriptionPriceChangeRequest, new AdvancedCommerceSubscriptionPriceChangeRequestValidator())
        return await this.makeRequest(path`/advancedCommerce/v1/subscription/changePrice/${transactionId}`, "POST", {}, subscriptionPriceChangeRequest, new AdvancedCommerceSubscriptionPriceChangeResponseValidator(), 'application/json');
    }

    /**
     * Turn off automatic renewal to cancel a customer's auto-renewable subscription.
     *
     * @param transactionId The transaction identifier of the auto-renewable subscription to cancel.
     * @param subscriptionCancelRequest The request body that includes information about the subscription to cancel.
     * @return The response body for a successful subscription cancellation.
     * @throws APIException If a response was returned indicating the request could not be processed
     * @throws Error If the request body is invalid
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/cancel-a-subscription Cancel a Subscription}
     */
    public async cancelSubscription(transactionId: string, subscriptionCancelRequest: AdvancedCommerceSubscriptionCancelRequest): Promise<AdvancedCommerceSubscriptionCancelResponse> {
        this.validateRequestBody(subscriptionCancelRequest, new AdvancedCommerceSubscriptionCancelRequestValidator())
        return await this.makeRequest(path`/advancedCommerce/v1/subscription/cancel/${transactionId}`, "POST", {}, subscriptionCancelRequest, new AdvancedCommerceSubscriptionCancelResponseValidator(), 'application/json');
    }

    /**
     * Immediately cancel a customer's subscription and all the items that are included in the subscription, and request a full or prorated refund.
     *
     * @param transactionId The transaction identifier of the auto-renewable subscription to revoke.
     * @param subscriptionRevokeRequest The request body you provide to terminate a subscription and all its items immediately.
     * @return The response body for a successful revoke-subscription request.
     * @throws APIException If a response was returned indicating the request could not be processed
     * @throws Error If the request body is invalid
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/revoke-subscription Revoke Subscription}
     */
    public async revokeSubscription(transactionId: string, subscriptionRevokeRequest: AdvancedCommerceSubscriptionRevokeRequest): Promise<AdvancedCommerceSubscriptionRevokeResponse> {
        this.validateRequestBody(subscriptionRevokeRequest, new AdvancedCommerceSubscriptionRevokeRequestValidator())
        return await this.makeRequest(path`/advancedCommerce/v1/subscription/revoke/${transactionId}`, "POST", {}, subscriptionRevokeRequest, new AdvancedCommerceSubscriptionRevokeResponseValidator(), 'application/json');
    }

    /**
     * Request a refund for a one-time charge or subscription transaction.
     *
     * @param transactionId The transaction identifier for which you request a refund.
     * @param requestRefundRequest The request body for requesting a refund for a transaction.
     * @return The response body for a transaction refund request.
     * @throws APIException If a response was returned indicating the request could not be processed
     * @throws Error If the request body is invalid
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/request-transaction-refund Request Transaction Refund}
     */
    public async requestTransactionRefund(transactionId: string, requestRefundRequest: AdvancedCommerceRequestRefundRequest): Promise<AdvancedCommerceRequestRefundResponse> {
        this.validateRequestBody(requestRefundRequest, new AdvancedCommerceRequestRefundRequestValidator())
        return await this.makeRequest(path`/advancedCommerce/v1/transaction/requestRefund/${transactionId}`, "POST", {}, requestRefundRequest, new AdvancedCommerceRequestRefundResponseValidator(), 'application/json');
    }

    /**
     * Update the SKU, display name, and description associated with a subscription, without affecting the subscription's billing or its service.
     *
     * @param transactionId The transaction identifier of the auto-renewable subscription to get changes to its metadata.
     * @param subscriptionChangeMetadataRequest The request body that contains the metadata changes.
     * @return The response body for a successful subscription metadata change.
     * @throws APIException If a response was returned indicating the request could not be processed
     * @throws Error If the request body is invalid
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/change-subscription-metadata Change Subscription Metadata}
     */
    public async changeSubscriptionMetadata(transactionId: string, subscriptionChangeMetadataRequest: AdvancedCommerceSubscriptionChangeMetadataRequest): Promise<AdvancedCommerceSubscriptionChangeMetadataResponse> {
        this.validateRequestBody(subscriptionChangeMetadataRequest, new AdvancedCommerceSubscriptionChangeMetadataRequestValidator())
        return await this.makeRequest(path`/advancedCommerce/v1/subscription/changeMetadata/${transactionId}`, "POST", {}, subscriptionChangeMetadataRequest, new AdvancedCommerceSubscriptionChangeMetadataResponseValidator(), 'application/json');
    }

    /**
     * Migrate a subscription that a customer purchased through Apple In-App Purchase to a subscription you manage using the Advanced Commerce API.
     *
     * @param transactionId The transaction identifier of the auto-renewable subscription to migrate.
     * @param subscriptionMigrateRequest The request body that contains the details for the migration.
     * @return A response that contains signed renewal and transaction information after a subscription successfully migrates to the Advanced Commerce API.
     * @throws APIException If a response was returned indicating the request could not be processed
     * @throws Error If the request body is invalid
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/migrate-subscription-to-advanced-commerce-api Migrate a Subscription to Advanced Commerce API}
     */
    public async migrateSubscriptionToAdvancedCommerceAPI(transactionId: string, subscriptionMigrateRequest: AdvancedCommerceSubscriptionMigrateRequest): Promise<AdvancedCommerceSubscriptionMigrateResponse> {
        this.validateRequestBody(subscriptionMigrateRequest, new AdvancedCommerceSubscriptionMigrateRequestValidator())
        return await this.makeRequest(path`/advancedCommerce/v1/subscription/migrate/${transactionId}`, "POST", {}, subscriptionMigrateRequest, new AdvancedCommerceSubscriptionMigrateResponseValidator(), 'application/json');
    }

    /**
     * Get the groups that a customer belongs to, and their role in each group.
     *
     * @param anyTransactionId Any originalTransactionId, transactionId, or appTransactionId that belongs to the customer for your app.
     * @return A response that contains the groups a customer belongs to, and their role in each group.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/get-customer-groups Get Customer Groups}
     */
    public async getCustomerGroups(anyTransactionId: string): Promise<GetCustomerGroupsResponse> {
        return await this.makeRequest(path`/groups/v1/currentGroups/${anyTransactionId}`, "GET", {}, null, new GetCustomerGroupsResponseValidator(), undefined);
    }

    /**
     * Get a paginated list of the customers that belong to a group.
     *
     * @param groupId The identifier of a group in your app, which the Get Customer Groups endpoint returns.
     * @param paginationToken An optional token you use to get the next set of members. Responses that have more members available include a paginationToken. Omit this parameter the first time you call this endpoint.
     * @param limit An optional maximum number of members to return in a single response.
     * @return A response that contains a page of the customers that belong to a group.
     * @throws APIException If a response was returned indicating the request could not be processed
     * {@link https://developer.apple.com/documentation/appstoreserverapi/get-group-members Get Group Members}
     */
    public async getGroupMembers(groupId: string, paginationToken?: string | null, limit?: number | null): Promise<GetGroupMembersResponse> {
        const queryParameters: { [key: string]: string[]} = {}
        if (paginationToken != null) {
            queryParameters["paginationToken"] = [paginationToken];
        }
        if (limit != null) {
            queryParameters["limit"] = [limit.toString()];
        }
        return await this.makeRequest(path`/groups/v1/group/${groupId}`, "GET", queryParameters, null, new GetGroupMembersResponseValidator(), undefined);
    }

    private validateRequestBody<T>(body: T, validator: Validator<T>): void {
        if (body == null || !validator.validate(body)) {
            throw new Error("Unexpected request body format")
        }
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
    /**
     * The response headers, keyed by lowercased header name.
     */
    public headers: { [key: string]: string[] }
    /**
     * A UNIX time, in milliseconds, that informs you when you can next send a request.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/identifying-rate-limits Identifying rate limits}
     */
    public retryAfter: number | null

    constructor(httpStatusCode: number, apiError: number | null = null, errorMessage: string | null = null, headers: { [key: string]: string[] } = {}) {
        super()
        this.name = 'APIException'
        this.httpStatusCode = httpStatusCode
        this.apiError = apiError
        this.errorMessage = errorMessage
        this.headers = headers
        this.retryAfter = parseRetryAfter(headers['retry-after'])
    }
}

function parseRetryAfter(retryAfterValues: string[] | undefined): number | null {
    const rawRetryAfter = retryAfterValues?.[0]

    if (rawRetryAfter === undefined) {
        return null
    }

    const trimmedRetryAfter = rawRetryAfter.trim()

    if (!/^[0-9]+$/.test(trimmedRetryAfter)) {
        return null
    }

    const retryAfter = Number(trimmedRetryAfter)

    return Number.isSafeInteger(retryAfter) ? retryAfter : null
}

/**
 * Understand the error codes that App Store Server API responses return.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/error-codes Error codes}
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
     * An error that indicates the request limit is invalid.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidlimiterror InvalidLimitError}
     */
    INVALID_LIMIT = 4000004,

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
     * An error that indicates the start date is earlier than the earliest allowed date.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/startdatetoofarinpasterror StartDateTooFarInPastError}
     */
    START_DATE_TOO_FAR_IN_PAST = 4000012,

    /**
     * An error that indicates the end date precedes the start date, or the two dates are equal.
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
     * An error that indicates the request is invalid because it has too many applied constraints.
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
     * An error that indicates the sort parameter is invalid.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidsorterror InvalidSortError}
     */
    INVALID_SORT = 4000021,

    /**
     * An error that indicates the product type parameter is invalid.
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
     * An error that indicates the subscription group identifier is invalid.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidsubscriptiongroupidentifiererror InvalidSubscriptionGroupIdentifierError}
     */
    INVALID_SUBSCRIPTION_GROUP_IDENTIFIER = 4000024,

    /**
     * An error that indicates the query parameter exclude-revoked is invalid.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidexcluderevokederror InvalidExcludeRevokedError}
     *
     * @deprecated Use {@link APIError.INVALID_REVOKED} instead.
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
     * An error that indicates the transaction identifier doesn’t represent a consumable In-App Purchase.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidtransactionnotconsumableerror InvalidTransactionNotConsumableError}
     *
     * @deprecated Use {@link APIError.INVALID_TRANSACTION_TYPE_NOT_SUPPORTED} instead.
     */
    INVALID_TRANSACTION_NOT_CONSUMABLE = 4000043,

    /**
     * An error that indicates an invalid refund preference value.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidrefundpreferenceerror InvalidRefundPreferenceError}
     */
    INVALID_REFUND_PREFERENCE = 4000044,

    /**
     * An error that indicates the transaction identifier represents an unsupported In-App Purchase type.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidtransactiontypenotsupportederror InvalidTransactionTypeNotSupportedError}
     */
    INVALID_TRANSACTION_TYPE_NOT_SUPPORTED = 4000047,

    /**
     * An error that indicates the endpoint doesn’t support an app transaction ID.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/apptransactionidnotsupportederror AppTransactionIdNotSupportedError}
     */
    APP_TRANSACTION_ID_NOT_SUPPORTED = 4000048,

    /**
     * The currency value is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidcurrencyerror InvalidCurrencyError}
     */
    INVALID_CURRENCY = 4000053,

    /**
     * At least one type of change must be provided in a modify subscription request.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/oneitemneededinmodifyerror OneItemNeededInModifyError}
     */
    ONE_ITEM_NEEDED_IN_MODIFY = 4000063,

    /**
     * The required field, requestInfo, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullrequestinfoerror NullRequestInfoError}
     */
    NULL_REQUEST_INFO = 4000079,

    /**
     * The required field, requestReferenceId, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullrequestreferenceiderror NullRequestReferenceIDError}
     */
    NULL_REQUEST_REFERENCE_ID = 4000080,

    /**
     * The requestReferenceId value is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidrequestreferenceiderror InvalidRequestReferenceIDError}
     */
    INVALID_REQUEST_REFERENCE_ID = 4000081,

    /**
     * The consistencyToken value is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidconsistencytokenerror InvalidConsistencyTokenError}
     */
    INVALID_CONSISTENCY_TOKEN = 4000082,

    /**
     * The required field, version, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullversionerror NullVersionError}
     */
    NULL_VERSION = 4000083,

    /**
     * The value of version is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/unexpectedversionerror UnexpectedVersionError}
     */
    UNEXPECTED_VERSION = 4000084,

    /**
     * The required field, transactionId, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nulltransactioniderror NullTransactionIdError}
     */
    NULL_TRANSACTION_ID = 4000085,

    /**
     * The price field must contain a positive number.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/negativepriceerror NegativePriceError}
     */
    NEGATIVE_PRICE = 4000086,

    /**
     * Exceeds the maximum length of the SKU field.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/skulengthexceedederror SKULengthExceededError}
     */
    SKU_LENGTH_EXCEEDED = 4000087,

    /**
     * Exceeds the maximum length of the description field.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/descriptionlengthexceedederror DescriptionLengthExceededError}
     */
    DESCRIPTION_LENGTH_EXCEEDED = 4000088,

    /**
     * Exceeds the maximum length of the displayName field.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/displaynamelengthexceedederror DisplayNameLengthExceededError}
     */
    DISPLAY_NAME_LENGTH_EXCEEDED = 4000089,

    /**
     * The proratedPrice field must contain a positive number.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/negativeproratedpriceerror NegativeProratedPriceError}
     */
    NEGATIVE_PRORATED_PRICE = 4000091,

    /**
     * The required field, offer period, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullofferperioderror NullOfferPeriodError}
     */
    NULL_OFFER_PERIOD = 4000092,

    /**
     * The required field, periodCount, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullperiodcounterror NullPeriodCountError}
     */
    NULL_PERIOD_COUNT = 4000093,

    /**
     * Period count must be a positive number.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/periodcountnotpositiveerror PeriodCountNotPositiveError}
     */
    PERIOD_COUNT_NOT_POSITIVE = 4000094,

    /**
     * The required field, reason, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullreasonerror NullReasonError}
     */
    NULL_REASON = 4000095,

    /**
     * Previous original transaction id is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidprevioustransactioniderror InvalidPreviousTransactionIDError}
     */
    INVALID_PREVIOUS_TRANSACTION_ID = 4000096,

    /**
     * The requestReferenceId was repeated.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/repeatedrequestreferenceiderror RepeatedRequestReferenceIdError}
     */
    REPEATED_REQUEST_REFERENCE_ID = 4000097,

    /**
     * The required field, currency, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullcurrencyerror NullCurrencyError}
     */
    NULL_CURRENCY = 4000098,

    /**
     * The required field, taxCode, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nulltaxcodeerror NullTaxCodeError}
     */
    NULL_TAX_CODE = 4000099,

    /**
     * The required field, storefront, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullstorefronterror NullStorefrontError}
     */
    NULL_STOREFRONT = 4000100,

    /**
     * The required field, items, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullitemserror NullItemsError}
     */
    NULL_ITEMS = 4000101,

    /**
     * The required field, item, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullitemerror NullItemError}
     */
    NULL_ITEM = 4000102,

    /**
     * The required field, descriptors, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nulldescriptorserror NullDescriptorsError}
     */
    NULL_DESCRIPTORS = 4000103,

    /**
     * The required field, period, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullperioderror NullPeriodError}
     */
    NULL_PERIOD = 4000104,

    /**
     * The required field, SKU, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullskuerror NullSKUError}
     */
    NULL_SKU = 4000105,

    /**
     * The required field, displayName, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nulldisplaynameerror NullDisplayNameError}
     */
    NULL_DISPLAY_NAME = 4000106,

    /**
     * The required field, description, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nulldescriptionerror NullDescriptionError}
     */
    NULL_DESCRIPTION = 4000107,

    /**
     * The required field, price, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullpriceerror NullPriceError}
     */
    NULL_PRICE = 4000109,

    /**
     * The required field, retainBillingCycle, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullretainbillingcycleerror NullRetainBillingCycleError}
     */
    NULL_RETAIN_BILLING_CYCLE = 4000110,

    /**
     * The required field, effective, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nulleffectiveerror NullEffectiveError}
     */
    NULL_EFFECTIVE = 4000111,

    /**
     * The required field, SKU in changeItems, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullnewskuerror NullNewSKUError}
     */
    NULL_NEW_SKU = 4000112,

    /**
     * The previous subscription targeted is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidprevioussubscriptionerror InvalidPreviousSubscriptionError}
     */
    INVALID_PREVIOUS_SUBSCRIPTION = 4000113,

    /**
     * Provided SKU is already owned.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/productalreadyexistserror ProductAlreadyExistsError}
     */
    PRODUCT_ALREADY_EXISTS = 4000114,

    /**
     * Product changes are invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidproductchangeserror InvalidProductChangesError}
     */
    INVALID_PRODUCT_CHANGES = 4000115,

    /**
     * The targeted salable isn't configured as a generic salable.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidsalableerror InvalidSalableError}
     */
    INVALID_SALABLE = 4000116,

    /**
     * The salable duration is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidsalabledurationerror InvalidSalableDurationError}
     */
    INVALID_SALABLE_DURATION = 4000117,

    /**
     * The displayName is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invaliddisplaynameerror InvalidDisplayNameError}
     */
    INVALID_DISPLAY_NAME = 4000118,

    /**
     * The description is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invaliddescriptionerror InvalidDescriptionError}
     */
    INVALID_DESCRIPTION = 4000119,

    /**
     * The requested product to change doesn't exist.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidproducterror InvalidProductError}
     */
    INVALID_PRODUCT = 4000121,

    /**
     * The SKU was invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidskuerror InvalidSKUError}
     */
    INVALID_SKU = 4000122,

    /**
     * The refundType is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidrefundtypeerror InvalidRefundTypeError}
     */
    INVALID_REFUND_TYPE = 4000123,

    /**
     * The refundReason is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidrefundreasonerror InvalidRefundReasonError}
     */
    INVALID_REFUND_REASON = 4000124,

    /**
     * The change reason is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidchangereasonerror InvalidChangeReasonError}
     */
    INVALID_CHANGE_REASON = 4000125,

    /**
     * The offer reason is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidofferreasonerror InvalidOfferReasonError}
     */
    INVALID_OFFER_REASON = 4000126,

    /**
     * The taxCode is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidtaxproductcodeerror InvalidTaxProductCodeError}
     */
    INVALID_TAX_PRODUCT_CODE = 4000127,

    /**
     * The offer period is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidofferperioderror InvalidOfferPeriodError}
     */
    INVALID_OFFER_PERIOD = 4000128,

    /**
     * The offer periodCount is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidofferperiodcounterror InvalidOfferPeriodCountError}
     */
    INVALID_OFFER_PERIOD_COUNT = 4000129,

    /**
     * The renewal period is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidrenewalperioderror InvalidRenewalPeriodError}
     */
    INVALID_RENEWAL_PERIOD = 4000130,

    /**
     * The renewal price is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidrenewalpriceerror InvalidRenewalPriceError}
     */
    INVALID_RENEWAL_PRICE = 4000131,

    /**
     * The amount is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidamounterror InvalidAmountError}
     */
    INVALID_AMOUNT = 4000132,

    /**
     * The storefronts mismatch.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/mismatchedstorefronterror MismatchedStorefrontError}
     */
    MISMATCHED_STOREFRONT = 4000133,

    /**
     * Pricing isn't configured for the storefront.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/missingpricingconfigforstorefronterror MissingPricingConfigForStorefrontError}
     */
    MISSING_PRICING_CONFIG_FOR_STOREFRONT = 4000134,

    /**
     * The operation isn't allowed.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/operationnotallowederror OperationNotAllowedError}
     */
    OPERATION_NOT_ALLOWED = 4000135,

    /**
     * More items were provided than allowed.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/moreitemsthanallowederror MoreItemsThanAllowedError}
     */
    MORE_ITEMS_THAN_ALLOWED = 4000136,

    /**
     * More offers were provided than allowed.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/moreoffersthanallowederror MoreOffersThanAllowedError}
     */
    MORE_OFFERS_THAN_ALLOWED = 4000137,

    /**
     * The addItems and changeItems entries cannot be empty.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/emptyaddchangeitemserror EmptyAddChangeItemsError}
     */
    EMPTY_ADD_CHANGE_ITEMS = 4000139,

    /**
     * All items must be updated on a period change.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/missingupdateditemswithperiodchangeerror MissingUpdatedItemsWithPeriodChangeError}
     */
    MISSING_UPDATED_ITEMS_WITH_PERIOD_CHANGE = 4000140,

    /**
     * Period reset conflicts with retaining billing cycle.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/periodresetwithretainbillingcycleerror PeriodResetWithRetainBillingCycleError}
     */
    PERIOD_RESET_WITH_RETAIN_BILLING_CYCLE = 4000141,

    /**
     * A period change at next cycle conflicts with addition at the current period.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/periodchangeeffectiveconflicterror PeriodChangeEffectiveConflictError}
     */
    PERIOD_CHANGE_EFFECTIVE_CONFLICT = 4000142,

    /**
     * Multiple operations on a single SKU isn't allowed.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/multipleoperationsonsingleskuerror MultipleOperationsOnSingleSKUError}
     */
    MULTIPLE_OPERATIONS_ON_SINGLE_SKU = 4000143,

    /**
     * The removeItems object was present without addItems or changeItems.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/removeitemswithoutaddorchangeitemserror RemoveItemsWithoutAddOrChangeItemsError}
     */
    REMOVE_ITEMS_WITHOUT_ADD_OR_CHANGE_ITEMS = 4000144,

    /**
     * A product in removeItems wasn't found for the given subscription.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/removeitemnotfounderror RemoveItemNotFoundError}
     */
    REMOVE_ITEM_NOT_FOUND = 4000145,

    /**
     * The targeted item in changeItems wasn't found.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/changeitemnotfounderror ChangeItemNotFoundError}
     */
    CHANGE_ITEM_NOT_FOUND = 4000146,

    /**
     * The request contains a billing period that doesn't align with the subscription's billing cycle.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/misalignedbillingcycleerror MisalignedBillingCycleError}
     */
    MISALIGNED_BILLING_CYCLE = 4000147,

    /**
     * Bill cycle reset with effective later.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/billingcycleresetwitheffectivelatererror BillingCycleResetWithEffectiveLaterError}
     */
    BILLING_CYCLE_RESET_WITH_EFFECTIVE_LATER = 4000148,

    /**
     * Period change immediately with effective later.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/periodchangeimmediatewitheffectiveatnextbillingcycleerror PeriodChangeImmediateWithEffectiveAtNextBillingCycleError}
     */
    PERIOD_CHANGE_IMMEDIATE_WITH_EFFECTIVE_AT_NEXT_BILLING_CYCLE = 4000149,

    /**
     * Prorated price and offer price are mutually exclusive.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/multiplepriceserror MultiplePricesError}
     */
    MULTIPLE_PRICES = 4000150,

    /**
     * The prorated price was invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidproratedpriceerror InvalidProratedPriceError}
     */
    INVALID_PRORATED_PRICE = 4000151,

    /**
     * The subscription offer price is higher than the regular subscription price.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidofferpriceerror InvalidOfferPriceError}
     */
    INVALID_OFFER_PRICE = 4000152,

    /**
     * The refundAmount value is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullrefundamounterror NullRefundAmountError}
     */
    NULL_REFUND_AMOUNT = 4000153,

    /**
     * The refundAmount must be a positive number.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/negativerefundamounterror NegativeRefundAmountError}
     */
    NEGATIVE_REFUND_AMOUNT = 4000154,

    /**
     * Can't provide the refund amount because the refundType isn't CUSTOM.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/refundamountwithoutcustomerror RefundAmountWithoutCustomError}
     */
    REFUND_AMOUNT_WITHOUT_CUSTOM = 4000155,

    /**
     * The required field, refundReason, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullrefundreasonerror NullRefundReasonError}
     */
    NULL_REFUND_REASON = 4000156,

    /**
     * The required field, refundType, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullrefundtypeerror NullRefundTypeError}
     */
    NULL_REFUND_TYPE = 4000157,

    /**
     * The type SIMULATE_REFUND_DECLINE is only valid in Sandbox.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/simulaterefunddeclineonlyinsandboxerror SimulateRefundDeclineOnlyInSandboxError}
     */
    SIMULATE_REFUND_DECLINE_ONLY_IN_SANDBOX = 4000158,

    /**
     * The required field, refundRiskingPreference, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullrefundriskingerror NullRefundRiskingError}
     */
    NULL_REFUND_RISKING = 4000159,

    /**
     * When included, provide at least one item in items.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/atleastoneitemerror AtLeastOneItemError}
     */
    AT_LEAST_ONE_ITEM = 4000160,

    /**
     * An error that indicates the image that’s uploading is invalid.
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
     * Provide either the displayName or a description.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/atleastoneofdisplaynameordescriptionerror AtLeastOneOfDisplayNameOrDescriptionError}
     */
    AT_LEAST_ONE_OF_DISPLAY_NAME_OR_DESCRIPTION = 4000165,

    /**
     * The required field, targetProductID, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nulltargetproductiderror NullTargetProductIDError}
     */
    NULL_TARGET_PRODUCT_ID = 4000166,

    /**
     * The targetProductID value is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidtargetproductiderror InvalidTargetProductIDError}
     */
    INVALID_TARGET_PRODUCT_ID = 4000167,

    /**
     * The active subscription must contain at least one item and cannot be completely empty.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/removalallnotallowederror RemovalAllNotAllowedError}
     */
    REMOVAL_ALL_NOT_ALLOWED = 4000168,

    /**
     * The required field, currentSKU, is missing.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nullcurrentskuerror NullCurrentSKUError}
     */
    NULL_CURRENT_SKU = 4000169,

    /**
     * Exceeds the maximum length of the currentSKU field.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/currentskulengthexceedederror CurrentSKULengthExceededError}
     */
    CURRENT_SKU_LENGTH_EXCEEDED = 4000170,

    /**
     * The required field, advancedCommerceData, was null.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/nulladvancedcommercedataerror NullAdvancedCommerceDataError}
     */
    NULL_ADVANCED_COMMERCE_DATA = 4000171,

    /**
     * The operation is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidoperationerror InvalidOperationError}
     */
    INVALID_OPERATION = 4000172,

    /**
     * The payload is malformed.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/malformedpayloaderror MalformedPayloadError}
     */
    MALFORMED_PAYLOAD = 4000173,

    /**
     * The signature is invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidsignatureerror InvalidSignatureError}
     */
    INVALID_SIGNATURE = 4000174,

    /**
     * An error that indicates the alternative text for an image is too long.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/alttexttoolongerror AltTextTooLongError}
     */
    ALT_TEXT_TOO_LONG = 4000175,

    /**
     * The subscription was already migrated.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionalreadymigratederror SubscriptionAlreadyMigratedError}
     */
    SUBSCRIPTION_ALREADY_MIGRATED = 4000176,

    /**
     * An active or pending offer prevents changes to the item mid-cycle.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/offerpreventsitemmidcyclechangeerror OfferPreventsItemMidCycleChangeError}
     */
    OFFER_PREVENTS_ITEM_MID_CYCLE_CHANGE = 4000177,

    /**
     * Price change is not allowed through plan modification.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/pricechangenotsupportedthroughmodifyitemserror PriceChangeNotSupportedThroughModifyItemsError}
     */
    PRICE_CHANGE_NOT_SUPPORTED_THROUGH_MODIFY_ITEMS = 4000178,

    /**
     * The number of items in subscription exceeds the limit.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/itemlimitexceedederror ItemLimitExceededError}
     */
    ITEM_LIMIT_EXCEEDED = 4000179,

    /**
     * Pending subscription changes must specify a renewalItem, and if there are no pending changes, a renewalItem cannot be specified.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/pendingchangesmismatcherror PendingChangesMismatchError}
     */
    PENDING_CHANGES_MISMATCH = 4000180,

    /**
     * The transaction has pending refunds.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/pendingrefunderror PendingRefundError}
     */
    PENDING_REFUND = 4000181,

    /**
     * Only requests against the latest transaction can have a PRORATED refundType value.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/proratedonlylatesttransactionerror ProratedOnlyLatestTransactionError}
     */
    PRORATED_ONLY_LATEST_TRANSACTION = 4000182,

    /**
     * An error that indicates the app account token value is not a valid UUID.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidappaccounttokenuuiderror InvalidAppAccountTokenUUIDError}
     */
    INVALID_APP_ACCOUNT_TOKEN_UUID = 4000183,

    /**
     * If one item has a refundReason value of SIMULATE_REFUND_DECLINE, all items must have a refundReason value of SIMULATE_REFUND_DECLINE.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/partialsimulaterefunddeclineerror PartialSimulateRefundDeclineError}
     */
    PARTIAL_SIMULATE_REFUND_DECLINE = 4000184,

    /**
     * An error that indicates the transaction is for a product the customer obtains through Family Sharing, which the endpoint doesn’t support.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/familytransactionnotsupportederror FamilyTransactionNotSupportedError}
     */
    FAMILY_TRANSACTION_NOT_SUPPORTED = 4000185,

    /**
     * Only active subscriptions are revocable.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/revokeoninactivesubscriptionerror RevokeOnInactiveSubscriptionError}
     */
    REVOKE_ON_INACTIVE_SUBSCRIPTION = 4000186,

    /**
     * An error that indicates the endpoint expects an original transaction identifier.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/transactionidisnotoriginaltransactioniderror TransactionIdIsNotOriginalTransactionIdError}
     */
    TRANSACTION_ID_IS_NOT_ORIGINAL_TRANSACTION_ID = 4000187,

    /**
     * Invalid request. dependentSKUs can't be shared between multiple SKUs.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/dependentskuscannotbesharederror DependentSKUsCannotBeSharedError}
     */
    DEPENDENT_SKUS_CANNOT_BE_SHARED = 4000192,

    /**
     * Invalid request. dependentSKUs can't be chained.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/dependentskuscannotbechainederror DependentSKUsCannotBeChainedError}
     */
    DEPENDENT_SKUS_CANNOT_BE_CHAINED = 4000193,

    /**
     * Invalid request. The same SKU can't be repeated in this request.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/itemcannotbespecifiedmultipletimeserror ItemCannotBeSpecifiedMultipleTimesError}
     */
    ITEM_CANNOT_BE_SPECIFIED_MULTIPLE_TIMES = 4000194,

    /**
     * Invalid request. A price change can't be issued when the price increase has already been communicated.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/pricechangecannotbeissuedwhenalreadycommunicatederror PriceChangeCannotBeIssuedWhenAlreadyCommunicatedError}
     */
    PRICE_CHANGE_CANNOT_BE_ISSUED_WHEN_ALREADY_COMMUNICATED = 4000205,

    /**
     * An error that indicates the consumption percentage is outside the valid range.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/consumptionpercentageoutofrangeerror ConsumptionPercentageOutOfRangeError}
     */
    CONSUMPTION_PERCENTAGE_OUT_OF_RANGE = 4000207,

    /**
     * An error that indicates the consumption percentage must be zero for the provided delivery status.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/undeliveredconsumptionpercentagenonzeroerror UndeliveredConsumptionPercentageNonZeroError}
     */
    UNDELIVERED_CONSUMPTION_PERCENTAGE_NON_ZERO = 4000208,

    /**
     * An error that indicates the consumption percentage field is unsupported for auto-renewable subscription transactions.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/consumptionpercentageautorenewablesubscriptionerror ConsumptionPercentageAutoRenewableSubscriptionError}
     */
    CONSUMPTION_PERCENTAGE_AUTO_RENEWABLE_SUBSCRIPTION = 4000209,

    /**
     * An error that indicates Advanced Commerce API transactions are not supported by the endpoint.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercetransactionnotsupportederror AdvancedCommerceTransactionNotSupportedError}
     */
    ADVANCED_COMMERCE_TRANSACTION_NOT_SUPPORTED = 4000210,

    /**
     * An error the API returns that indicates the performance test request is invalid.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/invalidperformancetestrequesterror InvalidPerformanceTestRequestError}
     */
    INVALID_PERFORMANCE_TEST_REQUEST = 4000211,

    /**
     * An error that indicates the request ID is invalid.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/invalidrequestiderror InvalidRequestIdError}
     */
    INVALID_REQUEST_ID = 4000212,

    /**
     * An error that indicates an error with an existing test.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/existingperformancetestrunerror ExistingPerformanceTestRunError}
     */
    EXISTING_PERFORMANCE_TEST_RUN = 4000213,

    /**
     * Invalid request. Price provided for a changed item with an offer while subject to a price increase was invalid.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidpriceforchangeiteminpriceincreaseerror InvalidPriceForChangeItemInPriceIncreaseError}
     */
    INVALID_PRICE_FOR_CHANGE_ITEM_IN_PRICE_INCREASE = 4000214,

    /**
     * An error that indicates the URL is invalid.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/badrequestrealtimeurlerror BadRequestRealtimeUrlError}
     */
    BAD_REQUEST_REALTIME_URL = 4000215,

    /**
     * An error that indicates the image size provided is invalid.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/badrequestimagesizeerror BadRequestImageSizeError}
     */
    BAD_REQUEST_IMAGE_SIZE = 4000216,

    /**
     * An error that indicates there are too many bullet points.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/badrequesttoomanybulletpointserror BadRequestTooManyBulletPointsError}
     */
    BAD_REQUEST_TOO_MANY_BULLET_POINTS = 4000218,

    /**
     * An error that indicates the text for a bullet point is too long.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/badrequestbulletpointtexttoolongerror BadRequestBulletPointTextTooLongError}
     */
    BAD_REQUEST_BULLET_POINT_TEXT_TOO_LONG = 4000219,

    /**
     * Invalid request. SKU values provided in request must be a SKU that will renew.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidskuprovidedmustbecurrentskusettorenewerror InvalidSKUProvidedMustBeCurrentSKUSetToRenewError}
     */
    INVALID_SKU_PROVIDED_MUST_BE_CURRENT_SKU_SET_TO_RENEW = 4000220,

    /**
     * Advanced Commerce API Price Increase mechanism is not currently supported in India.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/acapriceincreaseisnotcurrentlysupportedinindiaerror ACAPriceIncreaseIsNotCurrentlySupportedInIndiaError}
     */
    ACA_PRICE_INCREASE_IS_NOT_CURRENTLY_SUPPORTED_IN_INDIA = 4000221,

    /**
     * Invalid request. A prorated price shouldn't be present to change items with the change taking effect later.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/invalidproratedpriceforchangeitemwitheffectivelatererror InvalidProratedPriceForChangeItemWithEffectiveLaterError}
     */
    INVALID_PRORATED_PRICE_FOR_CHANGE_ITEM_WITH_EFFECTIVE_LATER = 4000222,

    /**
     * Invalid request. The subscription offer configuration is invalid; free trial offers must use a period count of 1.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/freetrialoffermustuseperiodcountofoneerror FreeTrialOfferMustUsePeriodCountOfOneError}
     */
    FREE_TRIAL_OFFER_MUST_USE_PERIOD_COUNT_OF_ONE = 4000223,

    /**
     * An error that indicates that no image object is included, but the request indicates that the header should be placed above the image.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/badrequestaboveimagerequiresanimageerror BadRequestAboveImageRequiresAnImageError}
     */
    BAD_REQUEST_ABOVE_IMAGE_REQUIRES_AN_IMAGE = 4000224,

    /**
     * An error that indicates the group identifier is invalid.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidgroupiderror InvalidGroupIdError}
     */
    INVALID_GROUP_ID = 4000225,

    /**
     * An error that indicates the transaction is one that an organization or group assigns to the customer, which the endpoint doesn’t support.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/invalidassignedtransactionnotsupportederror InvalidAssignedTransactionNotSupportedError}
     */
    INVALID_ASSIGNED_TRANSACTION_NOT_SUPPORTED = 4000227,

    /**
     * Unauthorized.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/unauthorizederror UnauthorizedError}
     */
    UNAUTHORIZED = 4010000,

    /**
     * An error that indicates the subscription doesn’t qualify for a renewal-date extension due to its subscription state.
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
     * An error that indicates a subscription isn’t directly eligible for a renewal date extension because the customer obtained it through Family Sharing.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/familysharedsubscriptionextensionineligibleerror FamilySharedSubscriptionExtensionIneligibleError}
     */
    FAMILY_SHARED_SUBSCRIPTION_EXTENSION_INELIGIBLE = 4030007,

    /**
     * The subscription doesn't exist.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptiondoesnotexisterror SubscriptionDoesNotExistError}
     */
    SUBSCRIPTION_DOES_NOT_EXIST = 4030008,

    /**
     * The subscription already exists.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionalreadyexistserror SubscriptionAlreadyExistsError}
     */
    SUBSCRIPTION_ALREADY_EXISTS = 4030009,

    /**
     * The subscription isn't eligible for the requested changes.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionnoteligibleerror SubscriptionNotEligibleError}
     */
    SUBSCRIPTION_NOT_ELIGIBLE = 4030010,

    /**
     * The subscription is already active, and cannot be reactivated or renewed at this time.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionalreadyactiveerror SubscriptionAlreadyActiveError}
     */
    SUBSCRIPTION_ALREADY_ACTIVE = 4030011,

    /**
     * The customer doesn't own the product.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/productnotownederror ProductNotOwnedError}
     */
    PRODUCT_NOT_OWNED = 4030013,

    /**
     * An error that indicates when you reach the maximum number of uploaded images.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/maximumnumberofimagesreachederror MaximumNumberOfImagesReachedError}
     */
    MAXIMUM_NUMBER_OF_IMAGES_REACHED = 4030014,

    /**
     * The subscription is not active.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/inactiveacasuberror InactiveACASubError}
     */
    INACTIVE_ACA_SUB = 4030015,

    /**
     * An error that indicates when you reach the maximum number of uploaded messages.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/maximumnumberofmessagesreachederror MaximumNumberOfMessagesReachedError}
     */
    MAXIMUM_NUMBER_OF_MESSAGES_REACHED = 4030016,

    /**
     * An error that indicates the message isn’t in the approved state, so you can’t configure it as a default message.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/messagenotapprovederror MessageNotApprovedError}
     */
    MESSAGE_NOT_APPROVED = 4030017,

    /**
     * An error that indicates the image isn’t in the approved state, so you can’t configure it as part of a default message.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/imagenotapprovederror ImageNotApprovedError}
     */
    IMAGE_NOT_APPROVED = 4030018,

    /**
     * An error that indicates the image is currently in use as part of a message, so you can’t delete it.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/imageinuseerror ImageInUseError}
     */
    IMAGE_IN_USE = 4030019,

    /**
     * Insufficient funds for refund.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/insufficientfundserror InsufficientFundsError}
     */
    INSUFFICIENT_FUNDS = 4030020,

    /**
     * The transaction was already refunded.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/alreadyrefundederror AlreadyRefundedError}
     */
    ALREADY_REFUNDED = 4030021,

    /**
     * The storefront changed.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/storefrontchangeerror StorefrontChangeError}
     */
    STOREFRONT_CHANGE = 4030022,

    /**
     * The product isn't eligible for the requested operation.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/productnoteligibleerror ProductNotEligibleError}
     */
    PRODUCT_NOT_ELIGIBLE = 4030023,

    /**
     * The transaction is not refundable.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/transactionnotrefundableerror TransactionNotRefundableError}
     */
    TRANSACTION_NOT_REFUNDABLE = 4030024,

    /**
     * The transaction can't be refunded; customer can contact Apple Support for assistance.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/transactioncannotberefundedcontactsupporterror TransactionCannotBeRefundedContactSupportError}
     */
    TRANSACTION_CANNOT_BE_REFUNDED_CONTACT_SUPPORT = 4030025,

    /**
     * An error that indicates that passing a performance test is required before you can set a URL for the production environment.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/forbiddennopassingtesterror ForbiddenNoPassingTestError}
     */
    FORBIDDEN_NO_PASSING_TEST = 4030026,

    /**
     * The subscription isn't eligible for migration because a price increase has already been communicated to the customer.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/migrationnotallowedwhenpriceincreasecommunicatederror MigrationNotAllowedWhenPriceIncreaseCommunicatedError}
     */
    MIGRATION_NOT_ALLOWED_WHEN_PRICE_INCREASE_COMMUNICATED = 4030027,

    /**
     * An error that indicates a subscription isn’t eligible for a renewal date extension because the customer has access through an organization or group.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/assignedsubscriptionextensionineligibleerror AssignedSubscriptionExtensionIneligibleError}
     */
    ASSIGNED_SUBSCRIPTION_EXTENSION_INELIGIBLE = 4030028,

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
     * An error that indicates an original transaction identifier wasn’t found.
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
     * An error that indicates the App Store server couldn’t find a notifications URL for your app in the environment.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/servernotificationurlnotfounderror ServerNotificationURLNotFoundError}
     */
    SERVER_NOTIFICATION_URL_NOT_FOUND = 4040007,

    /**
     * An error that indicates the test notification token is expired or the test notification status isn’t available.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/testnotificationnotfounderror TestNotificationNotFoundError}
     */
    TEST_NOTIFICATION_NOT_FOUND = 4040008,

    /**
     * An error that indicates the server didn’t find a subscription-renewal-date extension request for the request identifier and product identifier you provided.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/statusrequestnotfounderror StatusRequestNotFoundError}
     */
    STATUS_REQUEST_NOT_FOUND = 4040009,

    /**
     * An error that indicates a transaction identifier wasn’t found.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/transactionidnotfounderror TransactionIdNotFoundError}
     */
    TRANSACTION_ID_NOT_FOUND = 4040010,

    /**
     * An error that indicates the system can’t find the image identifier.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/imagenotfounderror ImageNotFoundError}
     */
    IMAGE_NOT_FOUND = 4040014,

    /**
     * An error that indicates the system can’t find the message identifier.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/messagenotfounderror MessageNotFoundError}
     */
    MESSAGE_NOT_FOUND = 4040015,

    /**
     * Product not found.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/productnotfounderror ProductNotFoundError}
     */
    PRODUCT_NOT_FOUND = 4040016,

    /**
     * An error the API returns if the service can’t find the specified test run.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestrunnotfounderror PerformanceTestRunNotFoundError}
     */
    PERFORMANCE_TEST_RUN_NOT_FOUND = 4040018,

    /**
     * An error response that indicates an app transaction doesn’t exist for the specified customer.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/apptransactiondoesnotexisterror AppTransactionDoesNotExistError}
     */
    APP_TRANSACTION_DOES_NOT_EXIST = 4040019,

    /**
     * An error that indicates a default message isn’t configured.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/defaultmessagenotfounderror DefaultMessageNotFoundError}
     */
    DEFAULT_MESSAGE_NOT_FOUND = 4040020,

    /**
     * An error that indicates that the URL for your endpoint isn’t configured.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/realtimeurlnotfounderror RealtimeUrlNotFoundError}
     */
    REALTIME_URL_NOT_FOUND = 4040021,

    /**
     * An error that indicates the group wasn’t found.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/groupnotfounderror GroupNotFoundError}
     */
    GROUP_NOT_FOUND = 4040022,

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
     * An error that indicates the request exceeded the rate limit.
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
     * @deprecated Use {@link GetTransactionHistoryVersion.V2} instead.
     */
    V1 = "v1",
    V2 = "v2",
}
