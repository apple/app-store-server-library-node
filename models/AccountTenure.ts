// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator";

/**
 * The age of the customer’s account.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/accounttenure accountTenure}
 */
export enum AccountTenure {
    UNDECLARED = 0,
    ZERO_TO_THREE_DAYS = 1,
    THREE_DAYS_TO_TEN_DAYS = 2,
    TEN_DAYS_TO_THIRTY_DAYS = 3,
    THIRTY_DAYS_TO_NINETY_DAYS = 4,
    NINETY_DAYS_TO_ONE_HUNDRED_EIGHTY_DAYS = 5,
    ONE_HUNDRED_EIGHTY_DAYS_TO_THREE_HUNDRED_SIXTY_FIVE_DAYS = 6,
    GREATER_THAN_THREE_HUNDRED_SIXTY_FIVE_DAYS = 7,
}

export class AccountTenureValidator extends NumberValidator {}
