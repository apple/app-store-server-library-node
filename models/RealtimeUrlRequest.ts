// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * The request body for configuring the URL of your Get Retention Message endpoint.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/realtimeurlrequest RealtimeUrlRequest}
 */
export interface RealtimeUrlRequest {

    /**
     * A string that contains the URL of your Get Retention Message endpoint for configuration.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/realtimeurl realtimeURL}
     */
    realtimeURL: string
}

export class RealtimeUrlRequestValidator implements Validator<RealtimeUrlRequest> {
    private static readonly MAXIMUM_REALTIME_URL_LENGTH = 256
    validate(obj: any): obj is RealtimeUrlRequest {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!((typeof obj['realtimeURL'] === "string" || obj['realtimeURL'] instanceof String) && [...obj['realtimeURL']].length <= RealtimeUrlRequestValidator.MAXIMUM_REALTIME_URL_LENGTH)) {
            return false
        }
        return true
    }
}
