// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator";

/**
 * The status of an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/status status}
 */
export enum Status {
    ACTIVE = 1,
    EXPIRED = 2,
    BILLING_RETRY = 3,
    BILLING_GRACE_PERIOD = 4,
    REVOKED = 5,
}

export class StatusValidator implements Validator<Status> {
   validate(obj: any): obj is Status {
        return Object.values(Status).includes(obj)
    }
}
