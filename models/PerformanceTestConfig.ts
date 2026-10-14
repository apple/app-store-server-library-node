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
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestconfig PerformanceTestConfig}
     */
    maxConcurrentRequests: number

    /**
     * The maximum time your server has to respond when the system calls your Get Retention Message endpoint in the sandbox environment.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestconfig PerformanceTestConfig}
     */
    responseTimeThreshold: number

    /**
     * The success rate threshold percentage.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestconfig PerformanceTestConfig}
     */
    successRateThreshold: number

    /**
     * The total duration of the test in milliseconds.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestconfig PerformanceTestConfig}
     */
    totalDuration: number

    /**
     * The total number of requests to make during the test.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestconfig PerformanceTestConfig}
     */
    totalRequests: number
}

export class PerformanceTestConfigValidator implements Validator<PerformanceTestConfig> {
    validate(obj: any): obj is PerformanceTestConfig {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(typeof obj['maxConcurrentRequests'] === "number" || obj['maxConcurrentRequests'] instanceof Number)) {
            return false
        }
        if (!(typeof obj['responseTimeThreshold'] === "number" || obj['responseTimeThreshold'] instanceof Number)) {
            return false
        }
        if (!(typeof obj['successRateThreshold'] === "number" || obj['successRateThreshold'] instanceof Number)) {
            return false
        }
        if (!(typeof obj['totalDuration'] === "number" || obj['totalDuration'] instanceof Number)) {
            return false
        }
        if (!(typeof obj['totalRequests'] === "number" || obj['totalRequests'] instanceof Number)) {
            return false
        }
        return true
    }
}
