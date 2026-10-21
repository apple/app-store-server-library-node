// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceTransactionInfo, AdvancedCommerceTransactionInfoValidator } from "./AdvancedCommerceTransactionInfo"
import { BillingPlanType, BillingPlanTypeValidator } from "./BillingPlanType"
import { DecodedSignedData } from "./DecodedSignedData"
import { Environment, EnvironmentValidator } from "./Environment"
import { InAppOwnershipType, InAppOwnershipTypeValidator } from "./InAppOwnershipType"
import { OfferDiscountType, OfferDiscountTypeValidator } from "./OfferDiscountType"
import { OfferType, OfferTypeValidator } from "./OfferType"
import { RevocationReason, RevocationReasonValidator } from "./RevocationReason"
import { RevocationType, RevocationTypeValidator } from "./RevocationType"
import { TransactionCommitmentInfo, TransactionCommitmentInfoValidator } from "./TransactionCommitmentInfo"
import { TransactionReason, TransactionReasonValidator } from "./TransactionReason"
import { Type, TypeValidator } from "./Type"
import { Validator } from "./Validator"

/**
 * A decoded payload that contains transaction information.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/jwstransactiondecodedpayload JWSTransactionDecodedPayload}
 */
export interface JWSTransactionDecodedPayload extends DecodedSignedData {

    /**
     * A UUID you create at the time of purchase that associates the transaction with a customer on your own service.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/appaccounttoken appAccountToken}
     */
    appAccountToken?: string

    /**
     * The unique identifier of the app download transaction.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/apptransactionid appTransactionId}
     */
    appTransactionId?: string

    /**
     * The bundle identifier of the app.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/bundleid bundleId}
     */
    bundleId?: string

    /**
     * The three-letter ISO 4217 currency code associated with the price parameter.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/currency currency}
     */
    currency?: string

    /**
     * The server environment, either sandbox or production.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/environment environment}
     */
    environment?: Environment | string

    /**
     * The UNIX time, in milliseconds, that the subscription expires or renews.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/expiresdate expiresDate}
     */
    expiresDate?: number

    /**
     * A string that describes whether the transaction was purchased by the customer, or is available to them through Family Sharing, an organization, or a group.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/inappownershiptype inAppOwnershipType}
     */
    inAppOwnershipType?: InAppOwnershipType | string

    /**
     * A Boolean value that indicates whether the customer upgraded to another subscription.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/isupgraded isUpgraded}
     */
    isUpgraded?: boolean

    /**
     * The payment mode you configure for the offer.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/offerdiscounttype offerDiscountType}
     */
    offerDiscountType?: OfferDiscountType | string

    /**
     * The identifier that contains the offer code or the promotional offer identifier.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/offeridentifier offerIdentifier}
     */
    offerIdentifier?: string

    /**
     * The duration of the offer applied to the transaction.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/offerperiod offerPeriod}
     */
    offerPeriod?: string

    /**
     * A value that represents the promotional offer type.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/offertype offerType}
     */
    offerType?: OfferType | number

    /**
     * The UNIX time, in milliseconds, that represents the purchase date of the original transaction identifier.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/originalpurchasedate originalPurchaseDate}
     */
    originalPurchaseDate?: number

    /**
     * The transaction identifier of the original purchase.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/originaltransactionid originalTransactionId}
     */
    originalTransactionId?: string

    /**
     * An integer value that represents the price multiplied by 1000 of the in-app purchase or subscription offer you configured in App Store Connect and that the system records at the time of the purchase.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/price price}
     */
    price?: number

    /**
     * The unique identifier of the product.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/productid productId}
     */
    productId?: string

    /**
     * The UNIX time, in milliseconds, that the App Store charged the customer’s account for a purchase, restored product, subscription, or subscription renewal after a lapse.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/purchasedate purchaseDate}
     */
    purchaseDate?: number

    /**
     * The number of products or seats the customer purchased.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/quantity quantity}
     */
    quantity?: number

    /**
     * The UNIX time, in milliseconds, that the App Store refunded the transaction or revoked it from Family Sharing.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/revocationdate revocationDate}
     */
    revocationDate?: number

    /**
     * The percentage, in milliunits, of the transaction that the App Store has refunded or revoked.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/revocationpercentage revocationPercentage}
     */
    revocationPercentage?: number

    /**
     * The reason that the App Store refunded the transaction or revoked it from Family Sharing.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/revocationreason revocationReason}
     */
    revocationReason?: RevocationReason | number

    /**
     * The type of the refund or revocation that applies to the transaction.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/revocationtype revocationType}
     */
    revocationType?: RevocationType | string

    /**
     * The UNIX time, in milliseconds, that the App Store signed the JSON Web Signature (JWS) data.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/signeddate signedDate}
     */
    signedDate?: number

    /**
     * The three-letter code that represents the country or region associated with the App Store storefront for the purchase.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/storefront storefront}
     */
    storefront?: string

    /**
     * An Apple-defined value that uniquely identifies the App Store storefront associated with the purchase.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/storefrontid storefrontId}
     */
    storefrontId?: string

    /**
     * The identifier of the subscription group to which the subscription belongs.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/subscriptiongroupidentifier subscriptionGroupIdentifier}
     */
    subscriptionGroupIdentifier?: string

    /**
     * The unique identifier of the transaction.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/transactionid transactionId}
     */
    transactionId?: string

    /**
     * The reason for the purchase transaction, which indicates whether it’s a customer’s purchase or a renewal for an auto-renewable subscription that the system initiates.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/transactionreason transactionReason}
     */
    transactionReason?: TransactionReason | string

    /**
     * The type of the in-app purchase.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/type type}
     */
    type?: Type | string

    /**
     * The unique identifier of subscription purchase events across devices, including subscription renewals.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/weborderlineitemid webOrderLineItemId}
     */
    webOrderLineItemId?: string

    /**
     * Transaction information that is present only for Advanced Commerce SKUs.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/advancedcommercetransactioninfo advancedCommerceTransactionInfo}
     */
    advancedCommerceInfo?: AdvancedCommerceTransactionInfo

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/billingplantype billingPlanType}
     */
    billingPlanType?: BillingPlanType | string

    /**
     * {@link https://developer.apple.com/documentation/appstoreserverapi/transactioncommitmentinfo TransactionCommitmentInfo}
     */
    commitmentInfo?: TransactionCommitmentInfo

    /**
     * The subscription’s original transaction identifier, before you migrated the subscription.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/previousoriginaltransactionid previousOriginalTransactionId}
     */
    previousOriginalTransactionId?: string
}

export class JWSTransactionDecodedPayloadValidator implements Validator<JWSTransactionDecodedPayload> {
    static readonly environmentValidator = new EnvironmentValidator()
    static readonly inAppOwnershipTypeValidator = new InAppOwnershipTypeValidator()
    static readonly offerDiscountTypeValidator = new OfferDiscountTypeValidator()
    static readonly offerTypeValidator = new OfferTypeValidator()
    static readonly revocationReasonValidator = new RevocationReasonValidator()
    static readonly revocationTypeValidator = new RevocationTypeValidator()
    static readonly transactionReasonValidator = new TransactionReasonValidator()
    static readonly typeValidator = new TypeValidator()
    static readonly advancedCommerceTransactionInfoValidator = new AdvancedCommerceTransactionInfoValidator()
    static readonly billingPlanTypeValidator = new BillingPlanTypeValidator()
    static readonly transactionCommitmentInfoValidator = new TransactionCommitmentInfoValidator()
    private static readonly MINIMUM_REVOCATION_PERCENTAGE = 0
    private static readonly MAXIMUM_REVOCATION_PERCENTAGE = 100000
    validate(obj: any): obj is JWSTransactionDecodedPayload {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if ((typeof obj['appAccountToken'] !== 'undefined') && !(typeof obj['appAccountToken'] === "string" || obj['appAccountToken'] instanceof String)) {
            return false
        }
        if ((typeof obj['appTransactionId'] !== 'undefined') && !(typeof obj['appTransactionId'] === "string" || obj['appTransactionId'] instanceof String)) {
            return false
        }
        if ((typeof obj['bundleId'] !== 'undefined') && !(typeof obj['bundleId'] === "string" || obj['bundleId'] instanceof String)) {
            return false
        }
        if ((typeof obj['currency'] !== 'undefined') && !(typeof obj['currency'] === "string" || obj['currency'] instanceof String)) {
            return false
        }
        if ((typeof obj['environment'] !== 'undefined') && !(JWSTransactionDecodedPayloadValidator.environmentValidator.validate(obj['environment']))) {
            return false
        }
        if ((typeof obj['expiresDate'] !== 'undefined') && !(typeof obj['expiresDate'] === "number" || obj['expiresDate'] instanceof Number)) {
            return false
        }
        if ((typeof obj['inAppOwnershipType'] !== 'undefined') && !(JWSTransactionDecodedPayloadValidator.inAppOwnershipTypeValidator.validate(obj['inAppOwnershipType']))) {
            return false
        }
        if ((typeof obj['isUpgraded'] !== 'undefined') && !(typeof obj['isUpgraded'] === "boolean" || obj['isUpgraded'] instanceof Boolean)) {
            return false
        }
        if ((typeof obj['offerDiscountType'] !== 'undefined') && !(JWSTransactionDecodedPayloadValidator.offerDiscountTypeValidator.validate(obj['offerDiscountType']))) {
            return false
        }
        if ((typeof obj['offerIdentifier'] !== 'undefined') && !(typeof obj['offerIdentifier'] === "string" || obj['offerIdentifier'] instanceof String)) {
            return false
        }
        if ((typeof obj['offerPeriod'] !== 'undefined') && !(typeof obj['offerPeriod'] === "string" || obj['offerPeriod'] instanceof String)) {
            return false
        }
        if ((typeof obj['offerType'] !== 'undefined') && !(JWSTransactionDecodedPayloadValidator.offerTypeValidator.validate(obj['offerType']))) {
            return false
        }
        if ((typeof obj['originalPurchaseDate'] !== 'undefined') && !(typeof obj['originalPurchaseDate'] === "number" || obj['originalPurchaseDate'] instanceof Number)) {
            return false
        }
        if ((typeof obj['originalTransactionId'] !== 'undefined') && !(typeof obj['originalTransactionId'] === "string" || obj['originalTransactionId'] instanceof String)) {
            return false
        }
        if ((typeof obj['price'] !== 'undefined') && !(typeof obj['price'] === "number" || obj['price'] instanceof Number)) {
            return false
        }
        if ((typeof obj['productId'] !== 'undefined') && !(typeof obj['productId'] === "string" || obj['productId'] instanceof String)) {
            return false
        }
        if ((typeof obj['purchaseDate'] !== 'undefined') && !(typeof obj['purchaseDate'] === "number" || obj['purchaseDate'] instanceof Number)) {
            return false
        }
        if ((typeof obj['quantity'] !== 'undefined') && !(typeof obj['quantity'] === "number" || obj['quantity'] instanceof Number)) {
            return false
        }
        if ((typeof obj['revocationDate'] !== 'undefined') && !(typeof obj['revocationDate'] === "number" || obj['revocationDate'] instanceof Number)) {
            return false
        }
        if ((typeof obj['revocationPercentage'] !== 'undefined') && !((typeof obj['revocationPercentage'] === "number" || obj['revocationPercentage'] instanceof Number) && obj['revocationPercentage'].valueOf() >= JWSTransactionDecodedPayloadValidator.MINIMUM_REVOCATION_PERCENTAGE && obj['revocationPercentage'].valueOf() <= JWSTransactionDecodedPayloadValidator.MAXIMUM_REVOCATION_PERCENTAGE)) {
            return false
        }
        if ((typeof obj['revocationReason'] !== 'undefined') && !(JWSTransactionDecodedPayloadValidator.revocationReasonValidator.validate(obj['revocationReason']))) {
            return false
        }
        if ((typeof obj['revocationType'] !== 'undefined') && !(JWSTransactionDecodedPayloadValidator.revocationTypeValidator.validate(obj['revocationType']))) {
            return false
        }
        if ((typeof obj['signedDate'] !== 'undefined') && !(typeof obj['signedDate'] === "number" || obj['signedDate'] instanceof Number)) {
            return false
        }
        if ((typeof obj['storefront'] !== 'undefined') && !(typeof obj['storefront'] === "string" || obj['storefront'] instanceof String)) {
            return false
        }
        if ((typeof obj['storefrontId'] !== 'undefined') && !(typeof obj['storefrontId'] === "string" || obj['storefrontId'] instanceof String)) {
            return false
        }
        if ((typeof obj['subscriptionGroupIdentifier'] !== 'undefined') && !(typeof obj['subscriptionGroupIdentifier'] === "string" || obj['subscriptionGroupIdentifier'] instanceof String)) {
            return false
        }
        if ((typeof obj['transactionId'] !== 'undefined') && !(typeof obj['transactionId'] === "string" || obj['transactionId'] instanceof String)) {
            return false
        }
        if ((typeof obj['transactionReason'] !== 'undefined') && !(JWSTransactionDecodedPayloadValidator.transactionReasonValidator.validate(obj['transactionReason']))) {
            return false
        }
        if ((typeof obj['type'] !== 'undefined') && !(JWSTransactionDecodedPayloadValidator.typeValidator.validate(obj['type']))) {
            return false
        }
        if ((typeof obj['webOrderLineItemId'] !== 'undefined') && !(typeof obj['webOrderLineItemId'] === "string" || obj['webOrderLineItemId'] instanceof String)) {
            return false
        }
        if ((typeof obj['advancedCommerceInfo'] !== 'undefined') && !(JWSTransactionDecodedPayloadValidator.advancedCommerceTransactionInfoValidator.validate(obj['advancedCommerceInfo']))) {
            return false
        }
        if ((typeof obj['billingPlanType'] !== 'undefined') && !(JWSTransactionDecodedPayloadValidator.billingPlanTypeValidator.validate(obj['billingPlanType']))) {
            return false
        }
        if ((typeof obj['commitmentInfo'] !== 'undefined') && !(JWSTransactionDecodedPayloadValidator.transactionCommitmentInfoValidator.validate(obj['commitmentInfo']))) {
            return false
        }
        if ((typeof obj['previousOriginalTransactionId'] !== 'undefined') && !(typeof obj['previousOriginalTransactionId'] === "string" || obj['previousOriginalTransactionId'] instanceof String)) {
            return false
        }
        return true
    }
}
