// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator";

/**
 * The renewal status for an auto-renewable subscription.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/autorenewstatus autoRenewStatus}
 */
export enum AutoRenewStatus {
    OFF = 0,
    ON = 1,
}

export class AutoRenewStatusValidator implements Validator<AutoRenewStatus> {
   validate(obj: any): boolean {
        return Object.values(AutoRenewStatus).includes(obj)
    }
}
