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
     */
    realtimeURL: string
}

export class RealtimeUrlResponseValidator implements Validator<RealtimeUrlResponse> {
    private static readonly MAXIMUM_REALTIME_URL_LENGTH = 256
    validate(obj: any): obj is RealtimeUrlResponse {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!((typeof obj['realtimeURL'] === "string" || obj['realtimeURL'] instanceof String) && [...obj['realtimeURL']].length <= RealtimeUrlResponseValidator.MAXIMUM_REALTIME_URL_LENGTH)) {
            return false
        }
        return true
    }
}
