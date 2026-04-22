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
     * {@link https://developer.apple.com/documentation/retentionmessaging/average average}
     **/
    average: number

    /**
     * The 50th percentile response time in milliseconds.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/p50 p50}
     **/
    p50: number

    /**
     * The 90th percentile response time in milliseconds.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/p90 p90}
     **/
    p90: number

    /**
     * The 95th percentile response time in milliseconds.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/p95 p95}
     **/
    p95: number

    /**
     * The 99th percentile response time in milliseconds.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/p99 p99}
     **/
    p99: number
}

export class PerformanceTestResponseTimesValidator implements Validator<PerformanceTestResponseTimes> {
    validate(obj: any): obj is PerformanceTestResponseTimes {
        if (!(typeof obj['average'] === "number")) {
            return false
        }
        if (!(typeof obj['p50'] === "number")) {
            return false
        }
        if (!(typeof obj['p90'] === "number")) {
            return false
        }
        if (!(typeof obj['p95'] === "number")) {
            return false
        }
        if (!(typeof obj['p99'] === "number")) {
            return false
        }
        return true
    }
}
