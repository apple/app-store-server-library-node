// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommercePeriod } from "../../models/AdvancedCommercePeriod"
import { AdvancedCommerceReason } from "../../models/AdvancedCommerceReason"
import { AdvancedCommerceRefundReason } from "../../models/AdvancedCommerceRefundReason"
import { AdvancedCommerceRefundType } from "../../models/AdvancedCommerceRefundType"
import { AdvancedCommerceOfferPeriod } from "../../models/AdvancedCommerceOfferPeriod"
import { AdvancedCommerceOfferReason } from "../../models/AdvancedCommerceOfferReason"
import { AdvancedCommerceEffective } from "../../models/AdvancedCommerceEffective"
import { AdvancedCommerceValidationUtils } from "../../advanced_commerce_validation_utils"
import { AdvancedCommerceDescriptors } from "../../models/AdvancedCommerceDescriptors"
import { AdvancedCommerceOneTimeChargeItem } from "../../models/AdvancedCommerceOneTimeChargeItem"
import { AdvancedCommerceSubscriptionCreateItem } from "../../models/AdvancedCommerceSubscriptionCreateItem"
import { AdvancedCommerceRequestRefundItem } from "../../models/AdvancedCommerceRequestRefundItem"
import { AdvancedCommerceOffer } from "../../models/AdvancedCommerceOffer"
import { AdvancedCommerceOneTimeChargeCreateRequest } from "../../models/AdvancedCommerceOneTimeChargeCreateRequest"
import { AdvancedCommerceSubscriptionCreateRequest } from "../../models/AdvancedCommerceSubscriptionCreateRequest"
import { AdvancedCommerceRequestRefundRequest } from "../../models/AdvancedCommerceRequestRefundRequest"
import { AdvancedCommerceSubscriptionCancelRequest } from "../../models/AdvancedCommerceSubscriptionCancelRequest"
import { AdvancedCommerceSubscriptionRevokeRequest } from "../../models/AdvancedCommerceSubscriptionRevokeRequest"
import { AdvancedCommerceSubscriptionPriceChangeRequest } from "../../models/AdvancedCommerceSubscriptionPriceChangeRequest"
import { AdvancedCommerceRequestRefundResponse } from "../../models/AdvancedCommerceRequestRefundResponse"
import { AdvancedCommerceSubscriptionCancelResponse } from "../../models/AdvancedCommerceSubscriptionCancelResponse"
import { AdvancedCommerceSubscriptionRevokeResponse } from "../../models/AdvancedCommerceSubscriptionRevokeResponse"
import { AdvancedCommerceSubscriptionPriceChangeResponse } from "../../models/AdvancedCommerceSubscriptionPriceChangeResponse"
import { AdvancedCommerceSubscriptionChangeMetadataResponse } from "../../models/AdvancedCommerceSubscriptionChangeMetadataResponse"
import { AdvancedCommerceSubscriptionMigrateRequest } from "../../models/AdvancedCommerceSubscriptionMigrateRequest"
import { AdvancedCommerceSubscriptionModifyInAppRequest } from "../../models/AdvancedCommerceSubscriptionModifyInAppRequest"
import { AdvancedCommerceSubscriptionReactivateInAppRequest } from "../../models/AdvancedCommerceSubscriptionReactivateInAppRequest"
import { AdvancedCommerceSubscriptionChangeMetadataRequest } from "../../models/AdvancedCommerceSubscriptionChangeMetadataRequest"
import { AdvancedCommerceSubscriptionMigrateDescriptors } from "../../models/AdvancedCommerceSubscriptionMigrateDescriptors"
import { AdvancedCommerceSubscriptionModifyDescriptors } from "../../models/AdvancedCommerceSubscriptionModifyDescriptors"
import { AdvancedCommerceSubscriptionChangeMetadataDescriptors } from "../../models/AdvancedCommerceSubscriptionChangeMetadataDescriptors"
import { AdvancedCommerceSubscriptionMigrateItem } from "../../models/AdvancedCommerceSubscriptionMigrateItem"
import { AdvancedCommerceSubscriptionMigrateRenewalItem } from "../../models/AdvancedCommerceSubscriptionMigrateRenewalItem"
import { AdvancedCommerceSubscriptionModifyAddItem } from "../../models/AdvancedCommerceSubscriptionModifyAddItem"
import { AdvancedCommerceSubscriptionModifyChangeItem } from "../../models/AdvancedCommerceSubscriptionModifyChangeItem"
import { AdvancedCommerceSubscriptionModifyRemoveItem } from "../../models/AdvancedCommerceSubscriptionModifyRemoveItem"
import { AdvancedCommerceSubscriptionModifyPeriodChange } from "../../models/AdvancedCommerceSubscriptionModifyPeriodChange"
import { AdvancedCommerceSubscriptionPriceChangeItem } from "../../models/AdvancedCommerceSubscriptionPriceChangeItem"
import { AdvancedCommerceSubscriptionReactivateItem } from "../../models/AdvancedCommerceSubscriptionReactivateItem"
import { AdvancedCommerceSubscriptionChangeMetadataItem } from "../../models/AdvancedCommerceSubscriptionChangeMetadataItem"
import { AdvancedCommerceRequestInfo } from "../../models/AdvancedCommerceRequestInfo"
import { AdvancedCommerceSubscriptionMigrateResponse } from "../../models/AdvancedCommerceSubscriptionMigrateResponse"
import * as fs from 'fs'

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
        expect(AdvancedCommerceValidationUtils.validateDescription("Valid description")).toBe(true)
    })

    it('should validate description at max length', () => {
        expect(AdvancedCommerceValidationUtils.validateDescription("A".repeat(45))).toBe(true)
    })

    it('should reject description exceeding max length', () => {
        expect(AdvancedCommerceValidationUtils.validateDescription("A".repeat(46))).toBe(false)
    })

    it('should reject null description', () => {
        expect(AdvancedCommerceValidationUtils.validateDescription(null)).toBe(false)
    })

    it('should validate displayName with valid input', () => {
        expect(AdvancedCommerceValidationUtils.validateDisplayName("Valid Name")).toBe(true)
    })

    it('should validate displayName at max length', () => {
        expect(AdvancedCommerceValidationUtils.validateDisplayName("A".repeat(30))).toBe(true)
    })

    it('should reject displayName exceeding max length', () => {
        expect(AdvancedCommerceValidationUtils.validateDisplayName("A".repeat(31))).toBe(false)
    })

    it('should reject null displayName', () => {
        expect(AdvancedCommerceValidationUtils.validateDisplayName(null)).toBe(false)
    })

    it('should validate SKU with valid input', () => {
        expect(AdvancedCommerceValidationUtils.validateSku("valid.sku.123")).toBe(true)
    })

    it('should validate SKU at max length', () => {
        expect(AdvancedCommerceValidationUtils.validateSku("A".repeat(128))).toBe(true)
    })

    it('should reject SKU exceeding max length', () => {
        expect(AdvancedCommerceValidationUtils.validateSku("A".repeat(129))).toBe(false)
    })

    it('should reject null SKU', () => {
        expect(AdvancedCommerceValidationUtils.validateSku(null)).toBe(false)
    })

    it('should validate periodCount with valid values', () => {
        expect(AdvancedCommerceValidationUtils.validatePeriodCount(1)).toBe(true)
        expect(AdvancedCommerceValidationUtils.validatePeriodCount(6)).toBe(true)
        expect(AdvancedCommerceValidationUtils.validatePeriodCount(12)).toBe(true)
    })

    it('should reject periodCount below minimum', () => {
        expect(AdvancedCommerceValidationUtils.validatePeriodCount(0)).toBe(false)
    })

    it('should reject periodCount above maximum', () => {
        expect(AdvancedCommerceValidationUtils.validatePeriodCount(13)).toBe(false)
    })

    it('should reject null periodCount', () => {
        expect(AdvancedCommerceValidationUtils.validatePeriodCount(null)).toBe(false)
    })

    it('should validate items with non-empty array', () => {
        const validList = [{ SKU: "sku1", description: "desc", displayName: "name", price: 1000 }]
        expect(AdvancedCommerceValidationUtils.validateItems(validList)).toBe(true)
    })

    it('should reject null items', () => {
        expect(AdvancedCommerceValidationUtils.validateItems(null)).toBe(false)
    })

    it('should reject empty items array', () => {
        expect(AdvancedCommerceValidationUtils.validateItems([])).toBe(false)
    })

    it('should reject items array with null element', () => {
        expect(AdvancedCommerceValidationUtils.validateItems([null] as any)).toBe(false)
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
})
