// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * A response that indicates the server successfully received the subscription-renewal-date extension request.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/massextendrenewaldateresponse MassExtendRenewalDateResponse}
 */
export interface MassExtendRenewalDateResponse {

    /**
     * A string that contains a unique identifier you provide to track each subscription-renewal-date extension request.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/requestidentifier requestIdentifier}
     **/
    requestIdentifier?: string
}


export class MassExtendRenewalDateResponseValidator implements Validator<MassExtendRenewalDateResponse> {
    validate(obj: any): boolean {
        if ((typeof obj['requestIdentifier'] !== 'undefined') && !(typeof obj['requestIdentifier'] === "string" || obj['requestIdentifier'] instanceof String)) {
            return false
        }
        return true
    }
}
