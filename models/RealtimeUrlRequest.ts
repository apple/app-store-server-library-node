// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

/**
 * The request body for configuring the URL of your Get Retention Message endpoint.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/realtimeurlrequest RealtimeUrlRequest}
 */
export interface RealtimeUrlRequest {

    /**
     * A string that contains the URL of your Get Retention Message endpoint for configuration.
     * 
     * **Maximum length: 256 characters**
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/realtimeurl realtimeURL}
     **/
    realtimeURL: string
}
