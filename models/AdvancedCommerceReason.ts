// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/subscriptionmodifychangeitem SubscriptionModifyChangeItem}
 */
export enum AdvancedCommerceReason {
    UPGRADE = "UPGRADE",
    DOWNGRADE = "DOWNGRADE",
    APPLY_OFFER = "APPLY_OFFER",
}

export class AdvancedCommerceReasonValidator extends StringValidator {}
