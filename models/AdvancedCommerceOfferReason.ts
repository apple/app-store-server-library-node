// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * The reason for the offer.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/offer Offer}
 */
export enum AdvancedCommerceOfferReason {
    ACQUISITION = "ACQUISITION",
    WIN_BACK = "WIN_BACK",
    RETENTION = "RETENTION"
}

export class AdvancedCommerceOfferReasonValidator extends StringValidator {}