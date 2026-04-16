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
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestconfig config}
     **/
    config: PerformanceTestConfig

    /**
     * The target URL for the performance test.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/target target}
     **/
    target: string

    /**
     * A PerformanceTestStatus object that describes the overall result of the test.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performanceteststatus result}
     **/
    result: PerformanceTestStatus | string

    /**
     * An integer that describes he success rate percentage of the performance test.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/successrate successRate}
     **/
    successRate: number

    /**
     * An integer that describes the number of pending requests in the performance test.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/numpending numPending}
     **/
    numPending: number

    /**
     * A PerformanceTestResponseTimes object that enumerates the response times measured during the test.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestresponsetimes responseTimes}
     **/
    responseTimes: PerformanceTestResponseTimes

    /**
     * A map of server-to-server notification failure reasons and counts that represent the number of failures during a performance test.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/failures failures}
     **/
    failures: { [key in SendAttemptResult | string]: number }
}

export class PerformanceTestResultResponseValidator implements Validator<PerformanceTestResultResponse> {
    static readonly performanceTestConfigValidator = new PerformanceTestConfigValidator()
    static readonly performanceTestStatusValidator = new PerformanceTestStatusValidator()
    static readonly performanceTestResponseTimesValidator = new PerformanceTestResponseTimesValidator()
    validate(obj: any): obj is PerformanceTestResultResponse {
        if (!(PerformanceTestResultResponseValidator.performanceTestConfigValidator.validate(obj['config']))) {
            return false
        }
        if (!(typeof obj['target'] === "string" || obj['target'] instanceof String)) {
            return false
        }
        if (!(PerformanceTestResultResponseValidator.performanceTestStatusValidator.validate(obj['result']))) {
            return false
        }
        if (!(typeof obj['successRate'] === "number")) {
            return false
        }
        if (!(typeof obj['numPending'] === "number")) {
            return false
        }
        if (!(PerformanceTestResultResponseValidator.performanceTestResponseTimesValidator.validate(obj['responseTimes']))) {
            return false
        }
        return true
    }
}
