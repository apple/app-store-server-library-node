// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { PerformanceTestConfig, PerformanceTestConfigValidator } from "./PerformanceTestConfig"
import { PerformanceTestResponseTimes, PerformanceTestResponseTimesValidator } from "./PerformanceTestResponseTimes"
import { PerformanceTestStatus, PerformanceTestStatusValidator } from "./PerformanceTestStatus"
import { SendAttemptResult } from "./SendAttemptResult"
import { Validator } from "./Validator"

/**
 * An object the API returns that describes the performance test results.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestresultresponse PerformanceTestResultResponse}
 */
export interface PerformanceTestResultResponse {

    /**
     * A PerformanceTestConfig object that enumerates the test parameters.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestconfig PerformanceTestConfig}
     */
    config: PerformanceTestConfig

    /**
     * A Failures object that represents a map of server-to-server notification failure reasons and counts that represent the number of failures encountered during the performance test.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/failures Failures}
     */
    failures: { [key in SendAttemptResult | string]: number }

    /**
     * An integer that describes the number of pending requests in the performance test.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestresultresponse PerformanceTestResultResponse}
     */
    numPending: number

    /**
     * A PerformanceTestResponseTimes object that enumerates the response times measured during the test.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestresponsetimes PerformanceTestResponseTimes}
     */
    responseTimes: PerformanceTestResponseTimes

    /**
     * A PerformanceTestStatus object that describes the overall result of the test.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performanceteststatus PerformanceTestStatus}
     */
    result: PerformanceTestStatus | string

    /**
     * An integer that describes the success rate percentage of the performance test.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestresultresponse PerformanceTestResultResponse}
     */
    successRate: number

    /**
     * The target URL for the performance test.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestresultresponse PerformanceTestResultResponse}
     */
    target: string
}

export class PerformanceTestResultResponseValidator implements Validator<PerformanceTestResultResponse> {
    static readonly performanceTestConfigValidator = new PerformanceTestConfigValidator()
    static readonly performanceTestResponseTimesValidator = new PerformanceTestResponseTimesValidator()
    static readonly performanceTestStatusValidator = new PerformanceTestStatusValidator()
    validate(obj: any): obj is PerformanceTestResultResponse {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(PerformanceTestResultResponseValidator.performanceTestConfigValidator.validate(obj['config']))) {
            return false
        }
        if (!(typeof obj['failures'] === 'object' && obj['failures'] !== null && !Array.isArray(obj['failures']))) {
            return false
        }
        for (const failure of Object.values(obj['failures'])) {
            if (!(typeof failure === "number" || failure instanceof Number)) {
                return false
            }
        }
        if (!(typeof obj['numPending'] === "number" || obj['numPending'] instanceof Number)) {
            return false
        }
        if (!(PerformanceTestResultResponseValidator.performanceTestResponseTimesValidator.validate(obj['responseTimes']))) {
            return false
        }
        if (!(PerformanceTestResultResponseValidator.performanceTestStatusValidator.validate(obj['result']))) {
            return false
        }
        if (!(typeof obj['successRate'] === "number" || obj['successRate'] instanceof Number)) {
            return false
        }
        if (!(typeof obj['target'] === "string" || obj['target'] instanceof String)) {
            return false
        }
        return true
    }
}
