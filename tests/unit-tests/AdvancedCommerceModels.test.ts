// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommercePeriod } from "../../models/AdvancedCommercePeriod"
import { AdvancedCommerceReason } from "../../models/AdvancedCommerceReason"
import { AdvancedCommerceRefundReason } from "../../models/AdvancedCommerceRefundReason"
import { AdvancedCommerceRefundType } from "../../models/AdvancedCommerceRefundType"
import { AdvancedCommerceOfferPeriod } from "../../models/AdvancedCommerceOfferPeriod"
import { AdvancedCommerceOfferReason } from "../../models/AdvancedCommerceOfferReason"
import { AdvancedCommerceEffective } from "../../models/AdvancedCommerceEffective"
import { HelperValidationUtils } from "../../helper_validation_utils"
import { AdvancedCommerceDescriptors, AdvancedCommerceDescriptorsValidator } from "../../models/AdvancedCommerceDescriptors"
import { AdvancedCommerceOneTimeChargeItem, AdvancedCommerceOneTimeChargeItemValidator } from "../../models/AdvancedCommerceOneTimeChargeItem"
import { AdvancedCommerceSubscriptionCreateItem, AdvancedCommerceSubscriptionCreateItemValidator } from "../../models/AdvancedCommerceSubscriptionCreateItem"
import { AdvancedCommerceRequestRefundItem, AdvancedCommerceRequestRefundItemValidator } from "../../models/AdvancedCommerceRequestRefundItem"
import { AdvancedCommerceOffer, AdvancedCommerceOfferValidator } from "../../models/AdvancedCommerceOffer"
import { AdvancedCommerceOneTimeChargeCreateRequest, AdvancedCommerceOneTimeChargeCreateRequestValidator } from "../../models/AdvancedCommerceOneTimeChargeCreateRequest"
import { AdvancedCommerceSubscriptionCreateRequest, AdvancedCommerceSubscriptionCreateRequestValidator } from "../../models/AdvancedCommerceSubscriptionCreateRequest"
import { AdvancedCommerceRequestRefundRequest, AdvancedCommerceRequestRefundRequestValidator } from "../../models/AdvancedCommerceRequestRefundRequest"
import { AdvancedCommerceSubscriptionCancelRequest, AdvancedCommerceSubscriptionCancelRequestValidator } from "../../models/AdvancedCommerceSubscriptionCancelRequest"
import { AdvancedCommerceSubscriptionRevokeRequest, AdvancedCommerceSubscriptionRevokeRequestValidator } from "../../models/AdvancedCommerceSubscriptionRevokeRequest"
import { AdvancedCommerceSubscriptionPriceChangeRequest, AdvancedCommerceSubscriptionPriceChangeRequestValidator } from "../../models/AdvancedCommerceSubscriptionPriceChangeRequest"
import { AdvancedCommerceRequestRefundResponse, AdvancedCommerceRequestRefundResponseValidator } from "../../models/AdvancedCommerceRequestRefundResponse"
import { AdvancedCommerceSubscriptionCancelResponse, AdvancedCommerceSubscriptionCancelResponseValidator } from "../../models/AdvancedCommerceSubscriptionCancelResponse"
import { AdvancedCommerceSubscriptionRevokeResponse, AdvancedCommerceSubscriptionRevokeResponseValidator } from "../../models/AdvancedCommerceSubscriptionRevokeResponse"
import { AdvancedCommerceSubscriptionPriceChangeResponse, AdvancedCommerceSubscriptionPriceChangeResponseValidator } from "../../models/AdvancedCommerceSubscriptionPriceChangeResponse"
import { AdvancedCommerceSubscriptionChangeMetadataResponse, AdvancedCommerceSubscriptionChangeMetadataResponseValidator } from "../../models/AdvancedCommerceSubscriptionChangeMetadataResponse"
import { AdvancedCommerceSubscriptionMigrateRequest, AdvancedCommerceSubscriptionMigrateRequestValidator } from "../../models/AdvancedCommerceSubscriptionMigrateRequest"
import { AdvancedCommerceSubscriptionModifyInAppRequest, AdvancedCommerceSubscriptionModifyInAppRequestValidator } from "../../models/AdvancedCommerceSubscriptionModifyInAppRequest"
import { AdvancedCommerceSubscriptionReactivateInAppRequest, AdvancedCommerceSubscriptionReactivateInAppRequestValidator } from "../../models/AdvancedCommerceSubscriptionReactivateInAppRequest"
import { AdvancedCommerceSubscriptionChangeMetadataRequest, AdvancedCommerceSubscriptionChangeMetadataRequestValidator } from "../../models/AdvancedCommerceSubscriptionChangeMetadataRequest"
import { AdvancedCommerceSubscriptionMigrateDescriptors, AdvancedCommerceSubscriptionMigrateDescriptorsValidator } from "../../models/AdvancedCommerceSubscriptionMigrateDescriptors"
import { AdvancedCommerceSubscriptionModifyDescriptors, AdvancedCommerceSubscriptionModifyDescriptorsValidator } from "../../models/AdvancedCommerceSubscriptionModifyDescriptors"
import { AdvancedCommerceSubscriptionChangeMetadataDescriptors, AdvancedCommerceSubscriptionChangeMetadataDescriptorsValidator } from "../../models/AdvancedCommerceSubscriptionChangeMetadataDescriptors"
import { AdvancedCommerceSubscriptionMigrateItem, AdvancedCommerceSubscriptionMigrateItemValidator } from "../../models/AdvancedCommerceSubscriptionMigrateItem"
import { AdvancedCommerceSubscriptionMigrateRenewalItem, AdvancedCommerceSubscriptionMigrateRenewalItemValidator } from "../../models/AdvancedCommerceSubscriptionMigrateRenewalItem"
import { AdvancedCommerceSubscriptionModifyAddItem, AdvancedCommerceSubscriptionModifyAddItemValidator } from "../../models/AdvancedCommerceSubscriptionModifyAddItem"
import { AdvancedCommerceSubscriptionModifyChangeItem, AdvancedCommerceSubscriptionModifyChangeItemValidator } from "../../models/AdvancedCommerceSubscriptionModifyChangeItem"
import { AdvancedCommerceSubscriptionModifyRemoveItem, AdvancedCommerceSubscriptionModifyRemoveItemValidator } from "../../models/AdvancedCommerceSubscriptionModifyRemoveItem"
import { AdvancedCommerceSubscriptionModifyPeriodChange, AdvancedCommerceSubscriptionModifyPeriodChangeValidator } from "../../models/AdvancedCommerceSubscriptionModifyPeriodChange"
import { AdvancedCommerceSubscriptionPriceChangeItem, AdvancedCommerceSubscriptionPriceChangeItemValidator } from "../../models/AdvancedCommerceSubscriptionPriceChangeItem"
import { AdvancedCommerceSubscriptionReactivateItem, AdvancedCommerceSubscriptionReactivateItemValidator } from "../../models/AdvancedCommerceSubscriptionReactivateItem"
import { AdvancedCommerceSubscriptionChangeMetadataItem, AdvancedCommerceSubscriptionChangeMetadataItemValidator } from "../../models/AdvancedCommerceSubscriptionChangeMetadataItem"
import { AdvancedCommerceRequestInfo, AdvancedCommerceRequestInfoValidator } from "../../models/AdvancedCommerceRequestInfo"
import { AdvancedCommerceSubscriptionMigrateResponse, AdvancedCommerceSubscriptionMigrateResponseValidator } from "../../models/AdvancedCommerceSubscriptionMigrateResponse"
import { AdvancedCommercePriceIncreaseInfoStatus } from "../../models/AdvancedCommercePriceIncreaseInfoStatus"
import { BillingPlanType } from "../../models/BillingPlanType"
import { RenewalBillingPlanType } from "../../models/RenewalBillingPlanType"
import { AdvancedCommerceInAppRequestValidator } from "../../models/AbstractAdvancedCommerceInAppRequest"
import { JWSTransactionDecodedPayloadValidator } from "../../models/JWSTransactionDecodedPayload"
import { JWSRenewalInfoDecodedPayloadValidator } from "../../models/JWSRenewalInfoDecodedPayload"
import { Validator } from "../../models/Validator"
import { VerificationException, VerificationStatus } from "../../jws_verification"
import { createSignedDataFromJson, createSignedDataFromObject, Equals, getDefaultSignedPayloadVerifier, RequiredKeys } from "../util"
import * as fs from 'fs'

type GuardedType<V> = V extends { validate(obj: any): obj is infer T } ? T : never

function readJson(path: string): any {
    return JSON.parse(fs.readFileSync(path, 'utf8'))
}

describe('AdvancedCommerceModels', () => {
    it('should test AdvancedCommercePeriod enum values', () => {
        expect(AdvancedCommercePeriod.P1W).toBe("P1W")
        expect(AdvancedCommercePeriod.P1M).toBe("P1M")
        expect(AdvancedCommercePeriod.P2M).toBe("P2M")
        expect(AdvancedCommercePeriod.P3M).toBe("P3M")
        expect(AdvancedCommercePeriod.P6M).toBe("P6M")
        expect(AdvancedCommercePeriod.P1Y).toBe("P1Y")
    })

    it('should test AdvancedCommerceReason enum values', () => {
        expect(AdvancedCommerceReason.UPGRADE).toBe("UPGRADE")
        expect(AdvancedCommerceReason.DOWNGRADE).toBe("DOWNGRADE")
        expect(AdvancedCommerceReason.APPLY_OFFER).toBe("APPLY_OFFER")
    })

    it('should test AdvancedCommerceRefundReason enum values', () => {
        expect(AdvancedCommerceRefundReason.UNINTENDED_PURCHASE).toBe("UNINTENDED_PURCHASE")
        expect(AdvancedCommerceRefundReason.FULFILLMENT_ISSUE).toBe("FULFILLMENT_ISSUE")
        expect(AdvancedCommerceRefundReason.UNSATISFIED_WITH_PURCHASE).toBe("UNSATISFIED_WITH_PURCHASE")
        expect(AdvancedCommerceRefundReason.LEGAL).toBe("LEGAL")
        expect(AdvancedCommerceRefundReason.OTHER).toBe("OTHER")
        expect(AdvancedCommerceRefundReason.MODIFY_ITEMS_REFUND).toBe("MODIFY_ITEMS_REFUND")
        expect(AdvancedCommerceRefundReason.SIMULATE_REFUND_DECLINE).toBe("SIMULATE_REFUND_DECLINE")
    })

    it('should test AdvancedCommerceRefundType enum values', () => {
        expect(AdvancedCommerceRefundType.FULL).toBe("FULL")
        expect(AdvancedCommerceRefundType.PRORATED).toBe("PRORATED")
        expect(AdvancedCommerceRefundType.CUSTOM).toBe("CUSTOM")
    })

    it('should test AdvancedCommerceOfferPeriod enum values', () => {
        expect(AdvancedCommerceOfferPeriod.P3D).toBe("P3D")
        expect(AdvancedCommerceOfferPeriod.P1W).toBe("P1W")
        expect(AdvancedCommerceOfferPeriod.P2W).toBe("P2W")
        expect(AdvancedCommerceOfferPeriod.P1M).toBe("P1M")
        expect(AdvancedCommerceOfferPeriod.P2M).toBe("P2M")
        expect(AdvancedCommerceOfferPeriod.P3M).toBe("P3M")
        expect(AdvancedCommerceOfferPeriod.P6M).toBe("P6M")
        expect(AdvancedCommerceOfferPeriod.P9M).toBe("P9M")
        expect(AdvancedCommerceOfferPeriod.P1Y).toBe("P1Y")
    })

    it('should test AdvancedCommerceOfferReason enum values', () => {
        expect(AdvancedCommerceOfferReason.ACQUISITION).toBe("ACQUISITION")
        expect(AdvancedCommerceOfferReason.WIN_BACK).toBe("WIN_BACK")
        expect(AdvancedCommerceOfferReason.RETENTION).toBe("RETENTION")
    })

    it('should test AdvancedCommerceEffective enum values', () => {
        expect(AdvancedCommerceEffective.IMMEDIATELY).toBe("IMMEDIATELY")
        expect(AdvancedCommerceEffective.NEXT_BILL_CYCLE).toBe("NEXT_BILL_CYCLE")
    })

    it('should validate description with valid input', () => {
        expect(HelperValidationUtils.validateDescription("Valid description")).toBe(true)
    })

    it('should validate description at max length', () => {
        expect(HelperValidationUtils.validateDescription("A".repeat(45))).toBe(true)
    })

    it('should reject description exceeding max length', () => {
        expect(HelperValidationUtils.validateDescription("A".repeat(46))).toBe(false)
    })

    it('should reject null description', () => {
        expect(HelperValidationUtils.validateDescription(null)).toBe(false)
    })

    it('should count description length in Unicode code points', () => {
        expect(HelperValidationUtils.validateDescription("\u{1F44D}".repeat(45))).toBe(true)
        expect(HelperValidationUtils.validateDescription("\u{1F44D}".repeat(46))).toBe(false)
    })

    it('should validate displayName with valid input', () => {
        expect(HelperValidationUtils.validateDisplayName("Valid Name")).toBe(true)
    })

    it('should validate displayName at max length', () => {
        expect(HelperValidationUtils.validateDisplayName("A".repeat(30))).toBe(true)
    })

    it('should reject displayName exceeding max length', () => {
        expect(HelperValidationUtils.validateDisplayName("A".repeat(31))).toBe(false)
    })

    it('should reject null displayName', () => {
        expect(HelperValidationUtils.validateDisplayName(null)).toBe(false)
    })

    it('should count displayName length in Unicode code points', () => {
        expect(HelperValidationUtils.validateDisplayName("\u{1F44D}".repeat(30))).toBe(true)
        expect(HelperValidationUtils.validateDisplayName("\u{1F44D}".repeat(31))).toBe(false)
    })

    it('should validate SKU with valid input', () => {
        expect(HelperValidationUtils.validateSku("valid.sku.123")).toBe(true)
    })

    it('should validate SKU at max length', () => {
        expect(HelperValidationUtils.validateSku("A".repeat(128))).toBe(true)
    })

    it('should reject SKU exceeding max length', () => {
        expect(HelperValidationUtils.validateSku("A".repeat(129))).toBe(false)
    })

    it('should reject null SKU', () => {
        expect(HelperValidationUtils.validateSku(null)).toBe(false)
    })

    it('should count SKU length in Unicode code points', () => {
        expect(HelperValidationUtils.validateSku("\u{1F44D}".repeat(128))).toBe(true)
        expect(HelperValidationUtils.validateSku("\u{1F44D}".repeat(129))).toBe(false)
    })

    it('should validate periodCount with valid values', () => {
        expect(HelperValidationUtils.validatePeriodCount(1)).toBe(true)
        expect(HelperValidationUtils.validatePeriodCount(6)).toBe(true)
        expect(HelperValidationUtils.validatePeriodCount(12)).toBe(true)
    })

    it('should reject periodCount below minimum', () => {
        expect(HelperValidationUtils.validatePeriodCount(0)).toBe(false)
    })

    it('should reject periodCount above maximum', () => {
        expect(HelperValidationUtils.validatePeriodCount(13)).toBe(false)
    })

    it('should reject null periodCount', () => {
        expect(HelperValidationUtils.validatePeriodCount(null)).toBe(false)
    })

    it('should reject non-integer periodCount', () => {
        expect(HelperValidationUtils.validatePeriodCount(1.5)).toBe(false)
        expect(HelperValidationUtils.validatePeriodCount("3")).toBe(false)
    })

    it('should validate items with non-empty array', () => {
        const validList = [{ SKU: "sku1", description: "desc", displayName: "name", price: 1000 }]
        expect(HelperValidationUtils.validateItems(validList)).toBe(true)
    })

    it('should reject null items', () => {
        expect(HelperValidationUtils.validateItems(null)).toBe(false)
    })

    it('should reject empty items array', () => {
        expect(HelperValidationUtils.validateItems([])).toBe(false)
    })

    it('should reject items array with null element', () => {
        expect(HelperValidationUtils.validateItems([null] as any)).toBe(false)
    })

    it('should deserialize AdvancedCommerceDescriptors from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceDescriptors.json', 'utf8')
        const descriptors: AdvancedCommerceDescriptors = JSON.parse(json)

        expect(descriptors.description).toBe("description")
        expect(descriptors.displayName).toBe("display name")
    })

    it('should deserialize AdvancedCommerceOneTimeChargeItem from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceOneTimeChargeItem.json', 'utf8')
        const item: AdvancedCommerceOneTimeChargeItem = JSON.parse(json)

        expect(item.description).toBe("description")
        expect(item.displayName).toBe("display name")
        expect(item.SKU).toBe("sku")
        expect(item.price).toBe(15000)
    })

    it('should deserialize AdvancedCommerceSubscriptionCreateItem from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionCreateItem.json', 'utf8')
        const item: AdvancedCommerceSubscriptionCreateItem = JSON.parse(json)

        expect(item.description).toBe("description")
        expect(item.displayName).toBe("display name")
        expect(item.SKU).toBe("sku")
        expect(item.price).toBe(20000)
    })

    it('should deserialize AdvancedCommerceRequestRefundItem from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceRequestRefundItem.json', 'utf8')
        const item: AdvancedCommerceRequestRefundItem = JSON.parse(json)

        expect(item.SKU).toBe("sku")
        expect(item.refundReason).toBe(AdvancedCommerceRefundReason.LEGAL)
        expect(item.refundType).toBe(AdvancedCommerceRefundType.FULL)
        expect(item.revoke).toBe(true)
        expect(item.refundAmount).toBe(5000)
    })

    it('should deserialize AdvancedCommerceOffer from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceOffer.json', 'utf8')
        const offer: AdvancedCommerceOffer = JSON.parse(json)

        expect(offer.period).toBe(AdvancedCommerceOfferPeriod.P1W)
        expect(offer.periodCount).toBe(3)
        expect(offer.price).toBe(5000)
        expect(offer.reason).toBe(AdvancedCommerceOfferReason.WIN_BACK)
    })

    it('should deserialize AdvancedCommerceOneTimeChargeCreateRequest from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceOneTimeChargeCreateRequest.json', 'utf8')
        const request: AdvancedCommerceOneTimeChargeCreateRequest = JSON.parse(json)

        expect(request.currency).toBe("USD")
        expect(request.item).toBeTruthy()
        expect(request.taxCode).toBe("taxCode")
        expect(request.requestInfo).toBeTruthy()
        expect(request.storefront).toBe("USA")
    })

    it('should deserialize AdvancedCommerceSubscriptionCreateRequest from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionCreateRequest.json', 'utf8')
        const request: AdvancedCommerceSubscriptionCreateRequest = JSON.parse(json)

        expect(request.currency).toBe("USD")
        expect(request.descriptors).toBeTruthy()
        expect(request.items).toBeTruthy()
        expect(request.items.length).toBe(2)
        expect(request.period).toBe(AdvancedCommercePeriod.P1M)
        expect(request.taxCode).toBe("taxCode")
        expect(request.storefront).toBe("USA")
        expect(request.previousTransactionId).toBe("transactionId")
    })

    it('should deserialize AdvancedCommerceRequestRefundRequest from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceRequestRefundRequest.json', 'utf8')
        const request: AdvancedCommerceRequestRefundRequest = JSON.parse(json)

        expect(request.items).toBeTruthy()
        expect(request.items.length).toBe(2)
        expect(request.refundRiskingPreference).toBe(true)
        expect(request.requestInfo).toBeTruthy()
        expect(request.currency).toBe("USD")
        expect(request.storefront).toBe("USA")
    })

    it('should deserialize AdvancedCommerceSubscriptionCancelRequest from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionCancelRequest.json', 'utf8')
        const request: AdvancedCommerceSubscriptionCancelRequest = JSON.parse(json)

        expect(request.requestInfo).toBeTruthy()
        expect(request.storefront).toBe("USA")
    })

    it('should deserialize AdvancedCommerceSubscriptionRevokeRequest from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionRevokeRequest.json', 'utf8')
        const request: AdvancedCommerceSubscriptionRevokeRequest = JSON.parse(json)

        expect(request.requestInfo).toBeTruthy()
        expect(request.refundRiskingPreference).toBe(true)
        expect(request.refundReason).toBe(AdvancedCommerceRefundReason.LEGAL)
        expect(request.refundType).toBe("FULL")
        expect(request.storefront).toBe("USA")
    })

    it('should deserialize AdvancedCommerceSubscriptionPriceChangeRequest from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionPriceChangeRequest.json', 'utf8')
        const request: AdvancedCommerceSubscriptionPriceChangeRequest = JSON.parse(json)

        expect(request.items).toBeTruthy()
        expect(request.requestInfo).toBeTruthy()
        expect(request.currency).toBe("USD")
    })

    it('should deserialize AdvancedCommerceRequestRefundResponse from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceRequestRefundResponse.json', 'utf8')
        const response: AdvancedCommerceRequestRefundResponse = JSON.parse(json)

        expect(response.signedRenewalInfo).toBeFalsy()
        expect(response.signedTransactionInfo).toBe("signed_transaction_info_value")
    })

    it('should deserialize AdvancedCommerceSubscriptionCancelResponse from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionCancelResponse.json', 'utf8')
        const response: AdvancedCommerceSubscriptionCancelResponse = JSON.parse(json)

        expect(response.signedRenewalInfo).toBe("signed_renewal_info")
        expect(response.signedTransactionInfo).toBe("signed_transaction_info")
    })

    it('should deserialize AdvancedCommerceSubscriptionRevokeResponse from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionRevokeResponse.json', 'utf8')
        const response: AdvancedCommerceSubscriptionRevokeResponse = JSON.parse(json)

        expect(response.signedRenewalInfo).toBe("signed_renewal_info")
        expect(response.signedTransactionInfo).toBe("signed_transaction_info")
    })

    it('should deserialize AdvancedCommerceSubscriptionPriceChangeResponse from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionPriceChangeResponse.json', 'utf8')
        const response: AdvancedCommerceSubscriptionPriceChangeResponse = JSON.parse(json)

        expect(response.signedRenewalInfo).toBe("signed_renewal_info")
        expect(response.signedTransactionInfo).toBe("signed_transaction_info")
    })

    it('should deserialize AdvancedCommerceSubscriptionChangeMetadataResponse from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionChangeMetadataResponse.json', 'utf8')
        const response: AdvancedCommerceSubscriptionChangeMetadataResponse = JSON.parse(json)

        expect(response.signedRenewalInfo).toBe("signed_renewal_info")
        expect(response.signedTransactionInfo).toBe("signed_transaction_info")
    })

    it('should deserialize AdvancedCommerceSubscriptionMigrateRequest from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionMigrateRequest.json', 'utf8')
        const request: AdvancedCommerceSubscriptionMigrateRequest = JSON.parse(json)

        expect(request.descriptors).toBeTruthy()
        expect(request.items).toBeTruthy()
        expect(request.taxCode).toBe("taxCode")
        expect(request.targetProductId).toBe("targetProductId")
    })

    it('should deserialize AdvancedCommerceSubscriptionModifyInAppRequest from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionModifyInAppRequest.json', 'utf8')
        const request: AdvancedCommerceSubscriptionModifyInAppRequest = JSON.parse(json)

        expect(request.currency).toBe("USD")
        expect(request.descriptors).toBeTruthy()
        expect(request.taxCode).toBe("taxCode")
        expect(request.transactionId).toBe("transactionId")
        expect(request.retainBillingCycle).toBe(true)
    })

    it('should deserialize AdvancedCommerceSubscriptionReactivateInAppRequest from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionReactivateInAppRequest.json', 'utf8')
        const request: AdvancedCommerceSubscriptionReactivateInAppRequest = JSON.parse(json)

        expect(request.items).toBeTruthy()
        expect(request.transactionId).toBe("transactionId")
    })

    it('should deserialize AdvancedCommerceSubscriptionChangeMetadataRequest from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionChangeMetadataRequest.json', 'utf8')
        const request: AdvancedCommerceSubscriptionChangeMetadataRequest = JSON.parse(json)

        expect(request.items).toBeTruthy()
        expect(request.requestInfo).toBeTruthy()
    })

    it('should deserialize AdvancedCommerceSubscriptionMigrateDescriptors from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionMigrateDescriptors.json', 'utf8')
        const descriptors: AdvancedCommerceSubscriptionMigrateDescriptors = JSON.parse(json)

        expect(descriptors.description).toBe("description")
        expect(descriptors.displayName).toBe("displayName")
    })

    it('should deserialize AdvancedCommerceSubscriptionModifyDescriptors from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionModifyDescriptors.json', 'utf8')
        const descriptors: AdvancedCommerceSubscriptionModifyDescriptors = JSON.parse(json)

        expect(descriptors.description).toBe("description")
        expect(descriptors.displayName).toBe("displayName")
        expect(descriptors.effective).toBe(AdvancedCommerceEffective.IMMEDIATELY)
    })

    it('should deserialize AdvancedCommerceSubscriptionChangeMetadataDescriptors from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionChangeMetadataDescriptors.json', 'utf8')
        const descriptors: AdvancedCommerceSubscriptionChangeMetadataDescriptors = JSON.parse(json)

        expect(descriptors.description).toBe("description")
        expect(descriptors.displayName).toBe("displayName")
        expect(descriptors.effective).toBe(AdvancedCommerceEffective.IMMEDIATELY)
    })

    it('should deserialize AdvancedCommerceSubscriptionMigrateItem from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionMigrateItem.json', 'utf8')
        const item: AdvancedCommerceSubscriptionMigrateItem = JSON.parse(json)

        expect(item.description).toBe("description")
        expect(item.displayName).toBe("displayName")
        expect(item.SKU).toBe("sku")
    })

    it('should deserialize AdvancedCommerceSubscriptionMigrateRenewalItem from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionMigrateRenewalItem.json', 'utf8')
        const item: AdvancedCommerceSubscriptionMigrateRenewalItem = JSON.parse(json)

        expect(item.description).toBe("description")
        expect(item.displayName).toBe("displayName")
        expect(item.SKU).toBe("sku")
    })

    it('should deserialize AdvancedCommerceSubscriptionModifyAddItem from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionModifyAddItem.json', 'utf8')
        const item: AdvancedCommerceSubscriptionModifyAddItem = JSON.parse(json)

        expect(item.description).toBe("description")
        expect(item.displayName).toBe("displayName")
        expect(item.SKU).toBe("sku")
        expect(item.price).toBe(12000)
    })

    it('should deserialize AdvancedCommerceSubscriptionModifyChangeItem from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionModifyChangeItem.json', 'utf8')
        const item: AdvancedCommerceSubscriptionModifyChangeItem = JSON.parse(json)

        expect(item.description).toBe("description")
        expect(item.displayName).toBe("displayName")
        expect(item.SKU).toBe("sku")
        expect(item.currentSKU).toBe("currentSku")
        expect(item.price).toBe(13000)
        expect(item.effective).toBe(AdvancedCommerceEffective.IMMEDIATELY)
        expect(item.reason).toBe(AdvancedCommerceReason.UPGRADE)
    })

    it('should deserialize AdvancedCommerceSubscriptionModifyRemoveItem from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionModifyRemoveItem.json', 'utf8')
        const item: AdvancedCommerceSubscriptionModifyRemoveItem = JSON.parse(json)

        expect(item.SKU).toBe("sku")
    })

    it('should deserialize AdvancedCommerceSubscriptionModifyPeriodChange from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionModifyPeriodChange.json', 'utf8')
        const periodChange: AdvancedCommerceSubscriptionModifyPeriodChange = JSON.parse(json)

        expect(periodChange.period).toBe(AdvancedCommercePeriod.P3M)
        expect(periodChange.effective).toBe(AdvancedCommerceEffective.IMMEDIATELY)
    })

    it('should deserialize AdvancedCommerceSubscriptionPriceChangeItem from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionPriceChangeItem.json', 'utf8')
        const item: AdvancedCommerceSubscriptionPriceChangeItem = JSON.parse(json)

        expect(item.SKU).toBe("sku")
        expect(item.price).toBe(16000)
        expect(item.dependentSKUs).toBeDefined()
        expect(item.dependentSKUs![0]).toBe("dependentSKU")
    })

    it('should deserialize AdvancedCommerceSubscriptionReactivateItem from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionReactivateItem.json', 'utf8')
        const item: AdvancedCommerceSubscriptionReactivateItem = JSON.parse(json)

        expect(item.SKU).toBe("sku")
    })

    it('should deserialize AdvancedCommerceSubscriptionChangeMetadataItem from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionChangeMetadataItem.json', 'utf8')
        const item: AdvancedCommerceSubscriptionChangeMetadataItem = JSON.parse(json)

        expect(item.description).toBe("description")
        expect(item.displayName).toBe("displayName")
        expect(item.SKU).toBe("sku")
        expect(item.currentSKU).toBe("currentSku")
        expect(item.effective).toBe(AdvancedCommerceEffective.NEXT_BILL_CYCLE)
    })

    it('should deserialize AdvancedCommerceRequestInfo from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceRequestInfo.json', 'utf8')
        const requestInfo: AdvancedCommerceRequestInfo = JSON.parse(json)

        expect(requestInfo.requestReferenceId).toBe("550e8400-e29b-41d4-a716-446655440010")
        expect(requestInfo.appAccountToken).toBe("660e8400-e29b-41d4-a716-446655440011")
        expect(requestInfo.consistencyToken).toBe("consistency_token_value")
    })

    it('should deserialize AdvancedCommerceSubscriptionMigrateResponse from JSON', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionMigrateResponse.json', 'utf8')
        const response: AdvancedCommerceSubscriptionMigrateResponse = JSON.parse(json)

        expect(response.signedRenewalInfo).toBe("signed_renewal_info_value")
        expect(response.signedTransactionInfo).toBe("signed_transaction_info_value")
    })

    it('should test AdvancedCommercePriceIncreaseInfoStatus enum values', () => {
        expect(AdvancedCommercePriceIncreaseInfoStatus.SCHEDULED).toBe("SCHEDULED")
        expect(AdvancedCommercePriceIncreaseInfoStatus.PENDING).toBe("PENDING")
        expect(AdvancedCommercePriceIncreaseInfoStatus.ACCEPTED).toBe("ACCEPTED")
    })

    it('should verify OneTimeChargeCreateRequest operation and version after deserialization', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceOneTimeChargeCreateRequest.json', 'utf8')
        const request = JSON.parse(json)

        expect(request.operation).toBe("CREATE_ONE_TIME_CHARGE")
        expect(request.version).toBe("1")
        expect(new AdvancedCommerceOneTimeChargeCreateRequestValidator().validate(request)).toBe(true)

        request.operation = "INVALID_OPERATION"
        expect(new AdvancedCommerceOneTimeChargeCreateRequestValidator().validate(request)).toBe(false)

        request.operation = "CREATE_ONE_TIME_CHARGE"
        request.version = "2"
        expect(new AdvancedCommerceOneTimeChargeCreateRequestValidator().validate(request)).toBe(false)
    })

    it('should verify SubscriptionCreateRequest operation and version after deserialization', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionCreateRequest.json', 'utf8')
        const request = JSON.parse(json)

        expect(request.operation).toBe("CREATE_SUBSCRIPTION")
        expect(request.version).toBe("1")
        expect(new AdvancedCommerceSubscriptionCreateRequestValidator().validate(request)).toBe(true)

        request.operation = "INVALID_OPERATION"
        expect(new AdvancedCommerceSubscriptionCreateRequestValidator().validate(request)).toBe(false)

        request.operation = "CREATE_SUBSCRIPTION"
        request.version = "2"
        expect(new AdvancedCommerceSubscriptionCreateRequestValidator().validate(request)).toBe(false)
    })

    it('should verify SubscriptionModifyInAppRequest operation and version after deserialization', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionModifyInAppRequest.json', 'utf8')
        const request = JSON.parse(json)

        expect(request.operation).toBe("MODIFY_SUBSCRIPTION")
        expect(request.version).toBe("1")
        expect(new AdvancedCommerceSubscriptionModifyInAppRequestValidator().validate(request)).toBe(true)

        request.operation = "INVALID_OPERATION"
        expect(new AdvancedCommerceSubscriptionModifyInAppRequestValidator().validate(request)).toBe(false)

        request.operation = "MODIFY_SUBSCRIPTION"
        request.version = "2"
        expect(new AdvancedCommerceSubscriptionModifyInAppRequestValidator().validate(request)).toBe(false)
    })

    it('should verify SubscriptionReactivateInAppRequest operation and version after deserialization', () => {
        const json = fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionReactivateInAppRequest.json', 'utf8')
        const request = JSON.parse(json)

        expect(request.operation).toBe("REACTIVATE_SUBSCRIPTION")
        expect(request.version).toBe("1")
        expect(new AdvancedCommerceSubscriptionReactivateInAppRequestValidator().validate(request)).toBe(true)

        request.operation = "INVALID_OPERATION"
        expect(new AdvancedCommerceSubscriptionReactivateInAppRequestValidator().validate(request)).toBe(false)

        request.operation = "REACTIVATE_SUBSCRIPTION"
        request.version = "2"
        expect(new AdvancedCommerceSubscriptionReactivateInAppRequestValidator().validate(request)).toBe(false)
    })

    it('should validate SubscriptionReactivateInAppRequest items: rejected when empty or with a null item, accepted when omitted or valid', () => {
        const validator = new AdvancedCommerceSubscriptionReactivateInAppRequestValidator()
        const request = JSON.parse(fs.readFileSync('tests/resources/models/advancedCommerceSubscriptionReactivateInAppRequest.json', 'utf8'))
        expect(validator.validate(request)).toBe(true)

        request.items = []
        expect(validator.validate(request)).toBe(false)

        request.items = [null]
        expect(validator.validate(request)).toBe(false)

        request.items = [{ SKU: "sku" }, null]
        expect(validator.validate(request)).toBe(false)

        delete request.items
        expect(validator.validate(request)).toBe(true)

        request.items = [{ SKU: "sku" }]
        expect(validator.validate(request)).toBe(true)
    })

    it('should test BillingPlanType enum values', () => {
        expect(BillingPlanType.BILLED_UPFRONT).toBe("BILLED_UPFRONT")
        expect(BillingPlanType.MONTHLY).toBe("MONTHLY")
    })

    it('should test RenewalBillingPlanType enum values', () => {
        expect(RenewalBillingPlanType.BILLED_UPFRONT).toBe("BILLED_UPFRONT")
        expect(RenewalBillingPlanType.MONTHLY).toBe("MONTHLY")
    })

    it('should validate every Advanced Commerce request fixture with its validator', () => {
        expect(new AdvancedCommerceRequestInfoValidator().validate(readJson('tests/resources/models/advancedCommerceRequestInfo.json'))).toBe(true)
        expect(new AdvancedCommerceDescriptorsValidator().validate(readJson('tests/resources/models/advancedCommerceDescriptors.json'))).toBe(true)
        expect(new AdvancedCommerceOfferValidator().validate(readJson('tests/resources/models/advancedCommerceOffer.json'))).toBe(true)
        expect(new AdvancedCommerceOneTimeChargeItemValidator().validate(readJson('tests/resources/models/advancedCommerceOneTimeChargeItem.json'))).toBe(true)
        expect(new AdvancedCommerceOneTimeChargeCreateRequestValidator().validate(readJson('tests/resources/models/advancedCommerceOneTimeChargeCreateRequest.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionCreateItemValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionCreateItem.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionCreateRequestValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionCreateRequest.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionModifyAddItemValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionModifyAddItem.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionModifyChangeItemValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionModifyChangeItem.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionModifyRemoveItemValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionModifyRemoveItem.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionModifyPeriodChangeValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionModifyPeriodChange.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionModifyDescriptorsValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionModifyDescriptors.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionModifyInAppRequestValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionModifyInAppRequest.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionReactivateItemValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionReactivateItem.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionReactivateInAppRequestValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionReactivateInAppRequest.json'))).toBe(true)
        expect(new AdvancedCommerceRequestRefundItemValidator().validate(readJson('tests/resources/models/advancedCommerceRequestRefundItem.json'))).toBe(true)
        expect(new AdvancedCommerceRequestRefundRequestValidator().validate(readJson('tests/resources/models/advancedCommerceRequestRefundRequest.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionCancelRequestValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionCancelRequest.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionRevokeRequestValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionRevokeRequest.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionChangeMetadataDescriptorsValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionChangeMetadataDescriptors.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionChangeMetadataItemValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionChangeMetadataItem.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionChangeMetadataRequestValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionChangeMetadataRequest.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionMigrateDescriptorsValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionMigrateDescriptors.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionMigrateItemValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionMigrateItem.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionMigrateRenewalItemValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionMigrateRenewalItem.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionMigrateRequestValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionMigrateRequest.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionPriceChangeItemValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionPriceChangeItem.json'))).toBe(true)
        expect(new AdvancedCommerceSubscriptionPriceChangeRequestValidator().validate(readJson('tests/resources/models/advancedCommerceSubscriptionPriceChangeRequest.json'))).toBe(true)
    })

    it('should reject Advanced Commerce requests that break documented constraints', () => {
        const oneTimeCharge = readJson('tests/resources/models/advancedCommerceOneTimeChargeCreateRequest.json')
        oneTimeCharge.item.description = "A".repeat(46)
        expect(new AdvancedCommerceOneTimeChargeCreateRequestValidator().validate(oneTimeCharge)).toBe(false)

        const subscriptionCreate = readJson('tests/resources/models/advancedCommerceSubscriptionCreateRequest.json')
        subscriptionCreate.descriptors.displayName = "A".repeat(31)
        expect(new AdvancedCommerceSubscriptionCreateRequestValidator().validate(subscriptionCreate)).toBe(false)

        const subscriptionCreateWithoutItems = readJson('tests/resources/models/advancedCommerceSubscriptionCreateRequest.json')
        subscriptionCreateWithoutItems.items = []
        expect(new AdvancedCommerceSubscriptionCreateRequestValidator().validate(subscriptionCreateWithoutItems)).toBe(false)

        const subscriptionCreateWithOffer = readJson('tests/resources/models/advancedCommerceSubscriptionCreateRequest.json')
        subscriptionCreateWithOffer.items[0].offer = { period: "P1M", periodCount: 13, price: 0, reason: "ACQUISITION" }
        expect(new AdvancedCommerceSubscriptionCreateRequestValidator().validate(subscriptionCreateWithOffer)).toBe(false)

        const modify = readJson('tests/resources/models/advancedCommerceSubscriptionModifyInAppRequest.json')
        modify.removeItems = [{ SKU: "A".repeat(129) }]
        expect(new AdvancedCommerceSubscriptionModifyInAppRequestValidator().validate(modify)).toBe(false)

        const refund = readJson('tests/resources/models/advancedCommerceRequestRefundRequest.json')
        delete refund.refundRiskingPreference
        expect(new AdvancedCommerceRequestRefundRequestValidator().validate(refund)).toBe(false)

        const revoke = readJson('tests/resources/models/advancedCommerceSubscriptionRevokeRequest.json')
        delete revoke.refundType
        expect(new AdvancedCommerceSubscriptionRevokeRequestValidator().validate(revoke)).toBe(false)

        const migrate = readJson('tests/resources/models/advancedCommerceSubscriptionMigrateRequest.json')
        migrate.renewalItems = []
        expect(new AdvancedCommerceSubscriptionMigrateRequestValidator().validate(migrate)).toBe(false)

        const priceChange = readJson('tests/resources/models/advancedCommerceSubscriptionPriceChangeRequest.json')
        priceChange.items[0].dependentSKUs = ["A".repeat(129)]
        expect(new AdvancedCommerceSubscriptionPriceChangeRequestValidator().validate(priceChange)).toBe(false)

        const requestInfo = readJson('tests/resources/models/advancedCommerceRequestInfo.json')
        delete requestInfo.requestReferenceId
        expect(new AdvancedCommerceRequestInfoValidator().validate(requestInfo)).toBe(false)
    })

    it('should return false instead of throwing when a required nested object is missing or null', () => {
        expect(new AdvancedCommerceSubscriptionCancelRequestValidator().validate({})).toBe(false)
        expect(new AdvancedCommerceSubscriptionCancelRequestValidator().validate({ requestInfo: null })).toBe(false)
        expect(new AdvancedCommerceSubscriptionCancelRequestValidator().validate(null)).toBe(false)
        expect(new AdvancedCommerceSubscriptionRevokeRequestValidator().validate(undefined)).toBe(false)

        const oneTimeCharge = readJson('tests/resources/models/advancedCommerceOneTimeChargeCreateRequest.json')
        delete oneTimeCharge.item
        expect(new AdvancedCommerceOneTimeChargeCreateRequestValidator().validate(oneTimeCharge)).toBe(false)

        const subscriptionCreate = readJson('tests/resources/models/advancedCommerceSubscriptionCreateRequest.json')
        subscriptionCreate.descriptors = null
        expect(new AdvancedCommerceSubscriptionCreateRequestValidator().validate(subscriptionCreate)).toBe(false)

        const migrate = readJson('tests/resources/models/advancedCommerceSubscriptionMigrateRequest.json')
        delete migrate.descriptors
        expect(new AdvancedCommerceSubscriptionMigrateRequestValidator().validate(migrate)).toBe(false)

        const priceChange = readJson('tests/resources/models/advancedCommerceSubscriptionPriceChangeRequest.json')
        delete priceChange.requestInfo
        expect(new AdvancedCommerceSubscriptionPriceChangeRequestValidator().validate(priceChange)).toBe(false)
    })

    it('should require at least one non-null item in SubscriptionChangeMetadataRequest items when included', () => {
        const validator = new AdvancedCommerceSubscriptionChangeMetadataRequestValidator()
        const request = readJson('tests/resources/models/advancedCommerceSubscriptionChangeMetadataRequest.json')
        request.items = [null]
        expect(validator.validate(request)).toBe(false)
        request.items = []
        expect(validator.validate(request)).toBe(false)
        delete request.items
        expect(validator.validate(request)).toBe(true)
    })

    it('should accept an empty SubscriptionPriceChangeItem dependentSKUs array', () => {
        const validator = new AdvancedCommerceSubscriptionPriceChangeItemValidator()
        const item = readJson('tests/resources/models/advancedCommerceSubscriptionPriceChangeItem.json')
        item.dependentSKUs = []
        expect(validator.validate(item)).toBe(true)
        item.dependentSKUs = [null]
        expect(validator.validate(item)).toBe(false)
    })

    it('should validate in-app requests with the validator for their operation', () => {
        const validator = new AdvancedCommerceInAppRequestValidator()
        expect(validator.validate(readJson('tests/resources/models/advancedCommerceOneTimeChargeCreateRequest.json'))).toBe(true)
        expect(validator.validate(readJson('tests/resources/models/advancedCommerceSubscriptionCreateRequest.json'))).toBe(true)
        expect(validator.validate(readJson('tests/resources/models/advancedCommerceSubscriptionModifyInAppRequest.json'))).toBe(true)
        expect(validator.validate(readJson('tests/resources/models/advancedCommerceSubscriptionReactivateInAppRequest.json'))).toBe(true)

        const subscriptionCreate = readJson('tests/resources/models/advancedCommerceSubscriptionCreateRequest.json')
        subscriptionCreate.items[0].SKU = "A".repeat(129)
        expect(validator.validate(subscriptionCreate)).toBe(false)

        const reactivate = readJson('tests/resources/models/advancedCommerceSubscriptionReactivateInAppRequest.json')
        delete reactivate.transactionId
        expect(validator.validate(reactivate)).toBe(false)

        expect(validator.validate({ operation: "NEW_OPERATION", version: "1" })).toBe(true)
        expect(validator.validate({ testValue: "testValue" })).toBe(true)
        expect(validator.validate("not a request")).toBe(false)
        expect(validator.validate(null)).toBe(false)
    })

    it('should check the request limits of descriptors and offers, and their fields', () => {
        const descriptors = { displayName: "Premium", description: "Premium Plan" }
        expect(new AdvancedCommerceDescriptorsValidator().validate(descriptors)).toBe(true)
        expect(new AdvancedCommerceDescriptorsValidator().validate({ displayName: "A".repeat(30), description: "A".repeat(45) })).toBe(true)
        expect(new AdvancedCommerceDescriptorsValidator().validate({ ...descriptors, displayName: "A".repeat(31) })).toBe(false)
        expect(new AdvancedCommerceDescriptorsValidator().validate({ ...descriptors, description: "A".repeat(46) })).toBe(false)
        expect(new AdvancedCommerceDescriptorsValidator().validate({ ...descriptors, description: 1 })).toBe(false)
        for (const key of ['displayName', 'description']) {
            const missing: any = { ...descriptors }
            delete missing[key]
            expect([key, new AdvancedCommerceDescriptorsValidator().validate(missing)]).toEqual([key, false])
        }

        const offer = { price: 5000, period: "P1M", periodCount: 3, reason: "ACQUISITION" }
        expect(new AdvancedCommerceOfferValidator().validate(offer)).toBe(true)
        expect(new AdvancedCommerceOfferValidator().validate({ ...offer, periodCount: 1 })).toBe(true)
        expect(new AdvancedCommerceOfferValidator().validate({ ...offer, periodCount: 12 })).toBe(true)
        expect(new AdvancedCommerceOfferValidator().validate({ ...offer, periodCount: 0 })).toBe(false)
        expect(new AdvancedCommerceOfferValidator().validate({ ...offer, periodCount: 13 })).toBe(false)
        expect(new AdvancedCommerceOfferValidator().validate({ ...offer, price: "5000" })).toBe(false)
        expect(new AdvancedCommerceOfferValidator().validate({ ...offer, periodCount: "3" })).toBe(false)
        expect(new AdvancedCommerceOfferValidator().validate({ ...offer, reason: 1 })).toBe(false)
        for (const key of ['price', 'period', 'periodCount', 'reason']) {
            const missing: any = { ...offer }
            delete missing[key]
            expect([key, new AdvancedCommerceOfferValidator().validate(missing)]).toEqual([key, false])
        }

        const transaction = readJson('tests/resources/models/signedTransactionWithAdvancedCommerceOffer.json')
        expect(new JWSTransactionDecodedPayloadValidator().validate(transaction)).toBe(true)
        transaction.advancedCommerceInfo.items[0].offer.periodCount = 13
        expect(new JWSTransactionDecodedPayloadValidator().validate(transaction)).toBe(false)
        const renewalInfo = readJson('tests/resources/models/signedRenewalInfoWithAdvancedCommerceOffer.json')
        expect(new JWSRenewalInfoDecodedPayloadValidator().validate(renewalInfo)).toBe(true)
        renewalInfo.advancedCommerceInfo.descriptors.displayName = "A".repeat(31)
        expect(new JWSRenewalInfoDecodedPayloadValidator().validate(renewalInfo)).toBe(false)
    })

    it('should type the offer and descriptors validators with the full interfaces', () => {
        const offerRequired: Equals<RequiredKeys<AdvancedCommerceOffer>, 'period' | 'periodCount' | 'price' | 'reason'> = true
        const descriptorsRequired: Equals<RequiredKeys<AdvancedCommerceDescriptors>, 'description' | 'displayName'> = true
        const offerGuard: Equals<GuardedType<AdvancedCommerceOfferValidator>, AdvancedCommerceOffer> = true
        const descriptorsGuard: Equals<GuardedType<AdvancedCommerceDescriptorsValidator>, AdvancedCommerceDescriptors> = true
        expect([offerRequired, descriptorsRequired, offerGuard, descriptorsGuard]).not.toContain(false)
    })

    it('should decode a transaction with an Advanced Commerce offer and descriptors', async () => {
        const signedTransaction = createSignedDataFromJson("tests/resources/models/signedTransactionWithAdvancedCommerceOffer.json")

        const transaction = await getDefaultSignedPayloadVerifier().verifyAndDecodeTransaction(signedTransaction)

        const info = transaction.advancedCommerceInfo!
        expect("A premium subscription").toBe(info.descriptors!.description)
        expect(2).toBe(info.items!.length)
        const offer = info.items![0].offer!
        expect(AdvancedCommerceOfferPeriod.P1W).toBe(offer.period)
        expect(3).toBe(offer.periodCount)
        expect(4990).toBe(offer.price)
        expect(AdvancedCommerceOfferReason.ACQUISITION).toBe(offer.reason)
        const secondOffer = info.items![1].offer!
        expect(AdvancedCommerceOfferPeriod.P9M).toBe(secondOffer.period)
        expect(12).toBe(secondOffer.periodCount)
        expect(990).toBe(secondOffer.price)
        expect(AdvancedCommerceOfferReason.RETENTION).toBe(secondOffer.reason)
        expect("Premium").toBe(info.descriptors!.displayName)
    })

    it('should decode renewal info with an Advanced Commerce offer and descriptors', async () => {
        const signedRenewalInfo = createSignedDataFromJson("tests/resources/models/signedRenewalInfoWithAdvancedCommerceOffer.json")

        const renewalInfo = await getDefaultSignedPayloadVerifier().verifyAndDecodeRenewalInfo(signedRenewalInfo)

        const info = renewalInfo.advancedCommerceInfo!
        expect("Premium").toBe(info.descriptors!.displayName)
        expect("Premium Plan").toBe(info.descriptors!.description)
        expect(2).toBe(info.items!.length)
        const offer = info.items![0].offer!
        expect(AdvancedCommerceOfferPeriod.P1Y).toBe(offer.period)
        expect(1).toBe(offer.periodCount)
        expect(0).toBe(offer.price)
        expect(AdvancedCommerceOfferReason.WIN_BACK).toBe(offer.reason)
        const secondOffer = info.items![1].offer!
        expect(AdvancedCommerceOfferPeriod.P1M).toBe(secondOffer.period)
        expect(6).toBe(secondOffer.periodCount)
        expect(1990).toBe(secondOffer.price)
        expect(AdvancedCommerceOfferReason.RETENTION).toBe(secondOffer.reason)
    })

    it.each([
        ['transaction', 'offer', 'periodCount', 13], ['transaction', 'offer', 'periodCount', 0],
        ['transaction', 'descriptors', 'displayName', "A".repeat(31)], ['transaction', 'descriptors', 'description', "A".repeat(46)],
        ['renewal info', 'offer', 'periodCount', 13], ['renewal info', 'offer', 'periodCount', 0],
        ['renewal info', 'descriptors', 'displayName', "A".repeat(31)], ['renewal info', 'descriptors', 'description', "A".repeat(46)],
    ] as [string, string, string, unknown][])('should reject a signed %s whose %s has %s %p, outside the request limits', async (payload, object, key, value) => {
        const json = readJson(payload === 'transaction' ? 'tests/resources/models/signedTransactionWithAdvancedCommerceOffer.json' : 'tests/resources/models/signedRenewalInfoWithAdvancedCommerceOffer.json')
        const info = json.advancedCommerceInfo
        ;(object === 'descriptors' ? info.descriptors : info.items[0].offer)[key] = value
        const verifier = getDefaultSignedPayloadVerifier()
        const signed = createSignedDataFromObject(json)

        const decoding = payload === 'transaction' ? verifier.verifyAndDecodeTransaction(signed) : verifier.verifyAndDecodeRenewalInfo(signed)

        await expect(decoding).rejects.toBeInstanceOf(VerificationException)
        await expect(decoding).rejects.toMatchObject({ status: VerificationStatus.FAILURE })
    })

    it.each([
        ['transaction', 'offer', 'periodCount', 1], ['transaction', 'offer', 'periodCount', 12],
        ['transaction', 'descriptors', 'displayName', "A".repeat(30)], ['transaction', 'descriptors', 'description', "A".repeat(45)],
        ['renewal info', 'offer', 'periodCount', 1], ['renewal info', 'offer', 'periodCount', 12],
        ['renewal info', 'descriptors', 'displayName', "A".repeat(30)], ['renewal info', 'descriptors', 'description', "A".repeat(45)],
    ] as [string, string, string, unknown][])('should decode a signed %s whose %s has %s %p, at the request limits', async (payload, object, key, value) => {
        const json = readJson(payload === 'transaction' ? 'tests/resources/models/signedTransactionWithAdvancedCommerceOffer.json' : 'tests/resources/models/signedRenewalInfoWithAdvancedCommerceOffer.json')
        ;(object === 'descriptors' ? json.advancedCommerceInfo.descriptors : json.advancedCommerceInfo.items[0].offer)[key] = value
        const verifier = getDefaultSignedPayloadVerifier()
        const signed = createSignedDataFromObject(json)

        const decoded = payload === 'transaction' ? await verifier.verifyAndDecodeTransaction(signed) : await verifier.verifyAndDecodeRenewalInfo(signed)

        const info: any = decoded.advancedCommerceInfo!
        expect((object === 'descriptors' ? info.descriptors : info.items[0].offer)[key]).toBe(value)
    })

    it('should require every offer and descriptors field to build one', () => {
        const offerKeys: Equals<RequiredKeys<AdvancedCommerceOffer>, 'period' | 'periodCount' | 'price' | 'reason'> = true
        const descriptorsKeys: Equals<RequiredKeys<AdvancedCommerceDescriptors>, 'description' | 'displayName'> = true
        expect([offerKeys, descriptorsKeys]).not.toContain(false)
        const inAppRequestValidator = new AdvancedCommerceInAppRequestValidator()
        const offer = readJson('tests/resources/models/advancedCommerceOffer.json')
        for (const key of ['period', 'periodCount', 'price', 'reason']) {
            const request = readJson('tests/resources/models/advancedCommerceSubscriptionCreateRequest.json')
            request.items[0].offer = { ...offer }
            expect(inAppRequestValidator.validate(request)).toBe(true)
            delete request.items[0].offer[key]
            expect([key, inAppRequestValidator.validate(request)]).toEqual([key, false])
        }
        for (const key of ['description', 'displayName']) {
            const request = readJson('tests/resources/models/advancedCommerceSubscriptionCreateRequest.json')
            delete request.descriptors[key]
            expect([key, inAppRequestValidator.validate(request)]).toEqual([key, false])
        }
        const request = readJson('tests/resources/models/advancedCommerceSubscriptionCreateRequest.json')
        request.items[0].offer = { ...offer, periodCount: 13 }
        expect(inAppRequestValidator.validate(request)).toBe(false)
    })

    it.each([
        ['transaction', 'descriptors', 'displayName'], ['transaction', 'descriptors', 'description'],
        ['transaction', 'offer', 'price'], ['transaction', 'offer', 'period'], ['transaction', 'offer', 'periodCount'], ['transaction', 'offer', 'reason'],
        ['renewal info', 'descriptors', 'displayName'], ['renewal info', 'descriptors', 'description'],
        ['renewal info', 'offer', 'price'], ['renewal info', 'offer', 'period'], ['renewal info', 'offer', 'periodCount'], ['renewal info', 'offer', 'reason'],
    ])('should reject a signed %s whose %s lacks %s', async (payload, object, key) => {
        const json = readJson(payload === 'transaction' ? 'tests/resources/models/signedTransactionWithAdvancedCommerceOffer.json' : 'tests/resources/models/signedRenewalInfoWithAdvancedCommerceOffer.json')
        const info = json.advancedCommerceInfo
        delete (object === 'descriptors' ? info.descriptors : info.items[0].offer)[key]
        const verifier = getDefaultSignedPayloadVerifier()
        const signed = createSignedDataFromObject(json)

        const decoding = payload === 'transaction' ? verifier.verifyAndDecodeTransaction(signed) : verifier.verifyAndDecodeRenewalInfo(signed)

        await expect(decoding).rejects.toBeInstanceOf(VerificationException)
        await expect(decoding).rejects.toMatchObject({ status: VerificationStatus.FAILURE })
    })

    it('should decode a one-time charge transaction without descriptors and an item without an offer', async () => {
        const json = readJson('tests/resources/models/signedTransactionWithAdvancedCommerceOffer.json')
        delete json.advancedCommerceInfo.descriptors
        delete json.advancedCommerceInfo.period
        delete json.advancedCommerceInfo.items[0].offer

        const transaction = await getDefaultSignedPayloadVerifier().verifyAndDecodeTransaction(createSignedDataFromObject(json))

        const info = transaction.advancedCommerceInfo!
        expect(info.descriptors).toBeUndefined()
        expect(info.period).toBeUndefined()
        expect(info.items![0].offer).toBeUndefined()
        expect("com.example.sku.premium").toBe(info.items![0].SKU)
    })

    it.each([
        ['OneTimeChargeCreateRequest', new AdvancedCommerceOneTimeChargeCreateRequestValidator(), 'advancedCommerceOneTimeChargeCreateRequest.json', ['operation', 'version', 'requestInfo', 'currency', 'taxCode', 'item']],
        ['SubscriptionCreateRequest', new AdvancedCommerceSubscriptionCreateRequestValidator(), 'advancedCommerceSubscriptionCreateRequest.json', ['operation', 'version', 'requestInfo', 'currency', 'taxCode', 'period', 'descriptors', 'items']],
        ['SubscriptionModifyInAppRequest', new AdvancedCommerceSubscriptionModifyInAppRequestValidator(), 'advancedCommerceSubscriptionModifyInAppRequest.json', ['operation', 'version', 'transactionId', 'requestInfo', 'retainBillingCycle']],
        ['SubscriptionReactivateInAppRequest', new AdvancedCommerceSubscriptionReactivateInAppRequestValidator(), 'advancedCommerceSubscriptionReactivateInAppRequest.json', ['operation', 'version', 'transactionId', 'requestInfo']],
        ['RequestRefundRequest', new AdvancedCommerceRequestRefundRequestValidator(), 'advancedCommerceRequestRefundRequest.json', ['requestInfo', 'items', 'refundRiskingPreference']],
        ['SubscriptionCancelRequest', new AdvancedCommerceSubscriptionCancelRequestValidator(), 'advancedCommerceSubscriptionCancelRequest.json', ['requestInfo']],
        ['SubscriptionRevokeRequest', new AdvancedCommerceSubscriptionRevokeRequestValidator(), 'advancedCommerceSubscriptionRevokeRequest.json', ['requestInfo', 'refundReason', 'refundType', 'refundRiskingPreference']],
        ['SubscriptionChangeMetadataRequest', new AdvancedCommerceSubscriptionChangeMetadataRequestValidator(), 'advancedCommerceSubscriptionChangeMetadataRequest.json', ['requestInfo']],
        ['SubscriptionMigrateRequest', new AdvancedCommerceSubscriptionMigrateRequestValidator(), 'advancedCommerceSubscriptionMigrateRequest.json', ['requestInfo', 'targetProductId', 'descriptors', 'taxCode', 'items']],
        ['SubscriptionPriceChangeRequest', new AdvancedCommerceSubscriptionPriceChangeRequestValidator(), 'advancedCommerceSubscriptionPriceChangeRequest.json', ['requestInfo', 'items']],
        ['RequestInfo', new AdvancedCommerceRequestInfoValidator(), 'advancedCommerceRequestInfo.json', ['requestReferenceId']],
        ['Descriptors', new AdvancedCommerceDescriptorsValidator(), 'advancedCommerceDescriptors.json', ['displayName', 'description']],
        ['Offer', new AdvancedCommerceOfferValidator(), 'advancedCommerceOffer.json', ['price', 'period', 'periodCount', 'reason']],
        ['OneTimeChargeItem', new AdvancedCommerceOneTimeChargeItemValidator(), 'advancedCommerceOneTimeChargeItem.json', ['displayName', 'description', 'price', 'SKU']],
        ['SubscriptionCreateItem', new AdvancedCommerceSubscriptionCreateItemValidator(), 'advancedCommerceSubscriptionCreateItem.json', ['displayName', 'description', 'price', 'SKU']],
        ['SubscriptionModifyAddItem', new AdvancedCommerceSubscriptionModifyAddItemValidator(), 'advancedCommerceSubscriptionModifyAddItem.json', ['displayName', 'description', 'price', 'SKU']],
        ['SubscriptionModifyChangeItem', new AdvancedCommerceSubscriptionModifyChangeItemValidator(), 'advancedCommerceSubscriptionModifyChangeItem.json', ['effective', 'SKU', 'price', 'displayName', 'description', 'reason', 'currentSKU']],
        ['SubscriptionModifyRemoveItem', new AdvancedCommerceSubscriptionModifyRemoveItemValidator(), 'advancedCommerceSubscriptionModifyRemoveItem.json', ['SKU']],
        ['SubscriptionModifyPeriodChange', new AdvancedCommerceSubscriptionModifyPeriodChangeValidator(), 'advancedCommerceSubscriptionModifyPeriodChange.json', ['period', 'effective']],
        ['SubscriptionModifyDescriptors', new AdvancedCommerceSubscriptionModifyDescriptorsValidator(), 'advancedCommerceSubscriptionModifyDescriptors.json', ['effective']],
        ['SubscriptionReactivateItem', new AdvancedCommerceSubscriptionReactivateItemValidator(), 'advancedCommerceSubscriptionReactivateItem.json', ['SKU']],
        ['RequestRefundItem', new AdvancedCommerceRequestRefundItemValidator(), 'advancedCommerceRequestRefundItem.json', ['SKU', 'refundType', 'revoke', 'refundReason']],
        ['SubscriptionChangeMetadataDescriptors', new AdvancedCommerceSubscriptionChangeMetadataDescriptorsValidator(), 'advancedCommerceSubscriptionChangeMetadataDescriptors.json', ['effective']],
        ['SubscriptionChangeMetadataItem', new AdvancedCommerceSubscriptionChangeMetadataItemValidator(), 'advancedCommerceSubscriptionChangeMetadataItem.json', ['effective', 'currentSKU']],
        ['SubscriptionMigrateDescriptors', new AdvancedCommerceSubscriptionMigrateDescriptorsValidator(), 'advancedCommerceSubscriptionMigrateDescriptors.json', ['displayName', 'description']],
        ['SubscriptionMigrateItem', new AdvancedCommerceSubscriptionMigrateItemValidator(), 'advancedCommerceSubscriptionMigrateItem.json', ['displayName', 'description', 'SKU']],
        ['SubscriptionMigrateRenewalItem', new AdvancedCommerceSubscriptionMigrateRenewalItemValidator(), 'advancedCommerceSubscriptionMigrateRenewalItem.json', ['displayName', 'description', 'SKU']],
        ['SubscriptionPriceChangeItem', new AdvancedCommerceSubscriptionPriceChangeItemValidator(), 'advancedCommerceSubscriptionPriceChangeItem.json', ['SKU', 'price']],
    ] as [string, Validator<unknown>, string, string[]][])('should reject a %s that lacks a required field', (name, validator, fixture, requiredKeys) => {
        expect(validator.validate(readJson('tests/resources/models/' + fixture))).toBe(true)
        for (const requiredKey of requiredKeys) {
            const request = readJson('tests/resources/models/' + fixture)
            expect(request).toHaveProperty(requiredKey)
            delete request[requiredKey]
            expect([requiredKey, validator.validate(request)]).toEqual([requiredKey, false])
        }
    })

    it.each([
        ['RequestRefundResponse', new AdvancedCommerceRequestRefundResponseValidator(), 'advancedCommerceRequestRefundResponse.json', ['signedTransactionInfo']],
        ['SubscriptionCancelResponse', new AdvancedCommerceSubscriptionCancelResponseValidator(), 'advancedCommerceSubscriptionCancelResponse.json', ['signedRenewalInfo', 'signedTransactionInfo']],
        ['SubscriptionChangeMetadataResponse', new AdvancedCommerceSubscriptionChangeMetadataResponseValidator(), 'advancedCommerceSubscriptionChangeMetadataResponse.json', ['signedRenewalInfo', 'signedTransactionInfo']],
        ['SubscriptionMigrateResponse', new AdvancedCommerceSubscriptionMigrateResponseValidator(), 'advancedCommerceSubscriptionMigrateResponse.json', ['signedRenewalInfo', 'signedTransactionInfo']],
        ['SubscriptionPriceChangeResponse', new AdvancedCommerceSubscriptionPriceChangeResponseValidator(), 'advancedCommerceSubscriptionPriceChangeResponse.json', ['signedRenewalInfo', 'signedTransactionInfo']],
        ['SubscriptionRevokeResponse', new AdvancedCommerceSubscriptionRevokeResponseValidator(), 'advancedCommerceSubscriptionRevokeResponse.json', ['signedRenewalInfo', 'signedTransactionInfo']],
    ] as [string, Validator<unknown>, string, string[]][])('should reject a %s that lacks a required field', (name, validator, fixture, requiredKeys) => {
        expect(validator.validate(readJson('tests/resources/models/' + fixture))).toBe(true)
        for (const requiredKey of requiredKeys) {
            const response = readJson('tests/resources/models/' + fixture)
            expect(response).toHaveProperty(requiredKey)
            delete response[requiredKey]
            expect([requiredKey, validator.validate(response)]).toEqual([requiredKey, false])
        }
    })

    it('should declare the signed fields the documentation requires in responses as required', () => {
        const requestRefund: Equals<RequiredKeys<AdvancedCommerceRequestRefundResponse>, 'signedTransactionInfo'> = true
        const cancel: Equals<RequiredKeys<AdvancedCommerceSubscriptionCancelResponse>, 'signedRenewalInfo' | 'signedTransactionInfo'> = true
        const changeMetadata: Equals<RequiredKeys<AdvancedCommerceSubscriptionChangeMetadataResponse>, 'signedRenewalInfo' | 'signedTransactionInfo'> = true
        const migrate: Equals<RequiredKeys<AdvancedCommerceSubscriptionMigrateResponse>, 'signedRenewalInfo' | 'signedTransactionInfo'> = true
        const priceChange: Equals<RequiredKeys<AdvancedCommerceSubscriptionPriceChangeResponse>, 'signedRenewalInfo' | 'signedTransactionInfo'> = true
        const revoke: Equals<RequiredKeys<AdvancedCommerceSubscriptionRevokeResponse>, 'signedRenewalInfo' | 'signedTransactionInfo'> = true

        expect([requestRefund, cancel, changeMetadata, migrate, priceChange, revoke]).not.toContain(false)
    })
})
