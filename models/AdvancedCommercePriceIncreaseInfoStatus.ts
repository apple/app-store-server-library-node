// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * {@link https://developer.apple.com/documentation/appstoreservernotifications/advancedcommercepriceincreaseinfostatus advancedCommercePriceIncreaseInfoStatus}
 */
export enum AdvancedCommercePriceIncreaseInfoStatus {
    SCHEDULED = "SCHEDULED",
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
}

export class AdvancedCommercePriceIncreaseInfoStatusValidator extends StringValidator {}
