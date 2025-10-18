// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * The request body the App Store server sends to your Get Retention Message endpoint.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/realtimerequestbody RealtimeRequestBody}
 */
export interface RealtimeRequestBody {

    /**
     * The payload in JSON Web Signature (JWS) format, signed by the App Store.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/signedpayload signedPayload}
     **/
    signedPayload?: string
}


export class RealtimeRequestBodyValidator implements Validator<RealtimeRequestBody> {
    validate(obj: any): obj is RealtimeRequestBody {
        if ((typeof obj['signedPayload'] !== 'undefined') && !(typeof obj['signedPayload'] === "string" || obj['signedPayload'] instanceof String)) {
            return false
        }
        return true
    }
}
