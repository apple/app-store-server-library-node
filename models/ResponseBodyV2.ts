// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * The response body the App Store sends in a version 2 server notification.
 *
 * {@link https://developer.apple.com/documentation/appstoreservernotifications/responsebodyv2 responseBodyV2}
 */
export interface ResponseBodyV2 {

    /**
     * The payload in JSON Web Signature (JWS) format, signed by the App Store.
     *
     * {@link https://developer.apple.com/documentation/appstoreservernotifications/signedpayload signedPayload}
     */
    signedPayload?: string
}

export class ResponseBodyV2Validator implements Validator<ResponseBodyV2> {
    validate(obj: any): obj is ResponseBodyV2 {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if ((typeof obj['signedPayload'] !== 'undefined') && !(typeof obj['signedPayload'] === "string" || obj['signedPayload'] instanceof String)) {
            return false
        }
        return true
    }
}
