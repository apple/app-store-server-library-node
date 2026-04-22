// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

/**
 * The request object you provide for a performance test that contains an original transaction identifier.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestrequest PerformanceTestRequest}
 */
export interface PerformanceTestRequest {

    /**
     * The original transaction identifier of an In-App Purchase you initiate in the sandbox environment, to use as the purchase for this test.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/originaltransactionid originalTransactionId}
     **/
    originalTransactionId: string
}
