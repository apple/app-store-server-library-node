// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * The response body the App Store sends in a version 2 server notification.
 *
 * {@link https://developer.apple.com/documentation/appstoreservernotifications/responsebodyv2 ResponseBodyV2}
 */
export interface ResponseBodyV2 {
     
    /**
     * A cryptographically signed payload, in JSON Web Signature (JWS) format, containing the response body for a version 2 notification.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/signedpayload signedPayload}
     **/
    signedPayload?: string
}


export class ResponseBodyV2Validator implements Validator<ResponseBodyV2> {
    validate(obj: any): boolean {
        if ((typeof obj['signedPayload'] !== 'undefined') && !(typeof obj['signedPayload'] === "string" || obj['signedPayload'] instanceof String)) {
            return false
        }
        return true
    }
}
