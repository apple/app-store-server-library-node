// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NumberValidator } from "./Validator"

/**
 * A value that indicates the amount of time that the customer used the app.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/playtime playTime}
 */
export enum PlayTime {
    /**
     * The engagement time is undeclared.
     */
    UNDECLARED = 0,
    /**
     * The engagement time is between 0–5 minutes.
     */
    ZERO_TO_FIVE_MINUTES = 1,
    /**
     * The engagement time is between 5–60 minutes.
     */
    FIVE_TO_SIXTY_MINUTES = 2,
    /**
     * The engagement time is between 1–6 hours.
     */
    ONE_TO_SIX_HOURS = 3,
    /**
     * The engagement time is between 6–24 hours.
     */
    SIX_HOURS_TO_TWENTY_FOUR_HOURS = 4,
    /**
     * The engagement time is between 1–4 days.
     */
    ONE_DAY_TO_FOUR_DAYS = 5,
    /**
     * The engagement time is between 4–16 days.
     */
    FOUR_DAYS_TO_SIXTEEN_DAYS = 6,
    /**
     * The engagement time is over 16 days.
     */
    OVER_SIXTEEN_DAYS = 7,
}

export class PlayTimeValidator extends NumberValidator {}
