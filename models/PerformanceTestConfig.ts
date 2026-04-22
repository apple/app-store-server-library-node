// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * An object that enumerates the test configuration parameters.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestconfig PerformanceTestConfig}
 */
export interface PerformanceTestConfig {

    /**
     * The maximum number of concurrent requests the API allows.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/maxconcurrentrequests maxConcurrentRequests}
     **/
    maxConcurrentRequests: number

    /**
     * The total number of requests to make during the test.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/totalrequests totalRequests}
     **/
    totalRequests: number

    /**
     * The total duration of the test in milliseconds.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/totalduration totalDuration}
     **/
    totalDuration: number

    /**
     * The maximum time your server has to respond when the system calls your Get Retention Message endpoint in the sandbox environment.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/responsetimethreshold responseTimeThreshold}
     **/
    responseTimeThreshold: number

    /**
     * The success rate threshold percentage.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/successratethreshold successRateThreshold}
     **/
    successRateThreshold: number
}

export class PerformanceTestConfigValidator implements Validator<PerformanceTestConfig> {
    validate(obj: any): obj is PerformanceTestConfig {
        if (!(typeof obj['maxConcurrentRequests'] === "number")) {
            return false
        }
        if (!(typeof obj['totalRequests'] === "number")) {
            return false
        }
        if (!(typeof obj['totalDuration'] === "number")) {
            return false
        }
        if (!(typeof obj['responseTimeThreshold'] === "number")) {
            return false
        }
        if (!(typeof obj['successRateThreshold'] === "number")) {
            return false
        }
        return true
    }
}
