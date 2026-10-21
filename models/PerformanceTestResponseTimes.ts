// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * An object that describes test response times.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestresponsetimes PerformanceTestResponseTimes}
 */
export interface PerformanceTestResponseTimes {

    /**
     * Average response time in milliseconds.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestresponsetimes PerformanceTestResponseTimes}
     */
    average: number

    /**
     * The 50th percentile response time in milliseconds.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestresponsetimes PerformanceTestResponseTimes}
     */
    p50: number

    /**
     * The 90th percentile response time in milliseconds.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestresponsetimes PerformanceTestResponseTimes}
     */
    p90: number

    /**
     * The 95th percentile response time in milliseconds.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestresponsetimes PerformanceTestResponseTimes}
     */
    p95: number

    /**
     * The 99th percentile response time in milliseconds.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestresponsetimes PerformanceTestResponseTimes}
     */
    p99: number
}

export class PerformanceTestResponseTimesValidator implements Validator<PerformanceTestResponseTimes> {
    validate(obj: any): obj is PerformanceTestResponseTimes {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(typeof obj['average'] === "number" || obj['average'] instanceof Number)) {
            return false
        }
        if (!(typeof obj['p50'] === "number" || obj['p50'] instanceof Number)) {
            return false
        }
        if (!(typeof obj['p90'] === "number" || obj['p90'] instanceof Number)) {
            return false
        }
        if (!(typeof obj['p95'] === "number" || obj['p95'] instanceof Number)) {
            return false
        }
        if (!(typeof obj['p99'] === "number" || obj['p99'] instanceof Number)) {
            return false
        }
        return true
    }
}
