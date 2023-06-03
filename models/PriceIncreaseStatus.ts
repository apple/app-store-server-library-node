// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator";

/**
 * The status that indicates whether an auto-renewable subscription is subject to a price increase.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/priceincreasestatus priceIncreaseStatus}
 */
export enum PriceIncreaseStatus {
    CUSTOMER_HAS_NOT_RESPONDED = 0,
    CUSTOMER_CONSENTED_OR_WAS_NOTIFIED_WITHOUT_NEEDING_CONSENT = 1,
}

export class PriceIncreaseStatusValidator implements Validator<PriceIncreaseStatus> {
   validate(obj: any): boolean {
        return Object.values(PriceIncreaseStatus).includes(obj)
    }
}
