// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { Validator } from './Validator'

/**
 * The metadata to include in server requests.
 *
 * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestinfo RequestInfo}
 */
export interface AdvancedCommerceRequestInfo {
    /**
     * A UUID that represents an app account token, to associate with the transaction in the request.
     **/
    appAccountToken?: string

    /**
     * The value of the advancedCommerceConsistencyToken that you receive in the JWSRenewalInfo renewal information for a subscription. Don't generate this value.
     *
     * {@link https://developer.apple.com/documentation/AppStoreServerAPI/advancedCommerceConsistencyToken advancedCommerceConsistencyToken}
     **/
    consistencyToken?: string

    /**
     * A UUID that you provide to uniquely identify each request. If the request times out, you can use the same requestReferenceId value to retry the request. Otherwise, provide a unique value.
     **/
    requestReferenceId: string
}

export class AdvancedCommerceRequestInfoValidator implements Validator<AdvancedCommerceRequestInfo> {
    validate(obj: any): obj is AdvancedCommerceRequestInfo {
        if ((typeof obj['appAccountToken'] !== 'undefined') && !(typeof obj['appAccountToken'] === "string" || obj['appAccountToken'] instanceof String)) {
            return false
        }

        if ((typeof obj['consistencyToken'] !== 'undefined') && !(typeof obj['consistencyToken'] === "string" || obj['consistencyToken'] instanceof String)) {
            return false
        }

        if (!(typeof obj['requestReferenceId'] === "string" || obj['requestReferenceId'] instanceof String)) {
            return false
        }

        return true
    }
}