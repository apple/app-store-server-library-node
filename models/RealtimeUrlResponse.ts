// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * The response body that contains the URL for your Get Retention Message endpoint.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/realtimeurlresponse RealtimeUrlResponse}
 */
export interface RealtimeUrlResponse {

    /**
     * A string that contains the URL you provided for your Get Retention Message endpoint.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/realtimeurl realtimeURL}
     **/
    realtimeURL: string
}

export class RealtimeUrlResponseValidator implements Validator<RealtimeUrlResponse> {
    validate(obj: any): obj is RealtimeUrlResponse {
        if (!(typeof obj['realtimeURL'] === "string" || obj['realtimeURL'] instanceof String)) {
            return false
        }
        return true
    }
}
