// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator"

/**
 * A value that indicates the extent to which the customer consumed the In-App Purchase.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/consumptionstatus consumptionStatus}
 */
export enum ConsumptionStatus {
    /**
     * The consumption status is undeclared.
     */
    UNDECLARED = 0,
    /**
     * The In-App Purchase is not consumed.
     */
    NOT_CONSUMED = 1,
    /**
     * The In-App Purchase is partially consumed.
     */
    PARTIALLY_CONSUMED = 2,
    /**
     * The In-App Purchase is fully consumed.
     */
    FULLY_CONSUMED = 3,
}

export class ConsumptionStatusValidator extends NumberValidator {}
