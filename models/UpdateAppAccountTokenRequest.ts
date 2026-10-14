// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * The request body that contains an app account token value.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/updateappaccounttokenrequest UpdateAppAccountTokenRequest}
 */
export interface UpdateAppAccountTokenRequest {

    /**
     * A UUID value to associate with the transaction you indicate in the endpoint parameter.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/appaccounttoken appAccountToken}
     */
    appAccountToken: string
}

export class UpdateAppAccountTokenRequestValidator implements Validator<UpdateAppAccountTokenRequest> {
    validate(obj: any): obj is UpdateAppAccountTokenRequest {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(typeof obj['appAccountToken'] === "string" || obj['appAccountToken'] instanceof String)) {
            return false
        }
        return true
    }
}
