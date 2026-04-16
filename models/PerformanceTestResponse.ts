// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { PerformanceTestConfig, PerformanceTestConfigValidator } from "./PerformanceTestConfig"
import { Validator } from "./Validator"

/**
 * The performance test response object.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestresponse PerformanceTestResponse}
 */
export interface PerformanceTestResponse {

    /**
     * The performance test configuration object.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/performancetestconfig config}
     **/
    config: PerformanceTestConfig

    /**
     * The performance test request identifier.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/requestid requestId}
     **/
    requestId: string
}

export class PerformanceTestResponseValidator implements Validator<PerformanceTestResponse> {
    static readonly performanceTestConfigValidator = new PerformanceTestConfigValidator()
    validate(obj: any): obj is PerformanceTestResponse {
        if (!(PerformanceTestResponseValidator.performanceTestConfigValidator.validate(obj['config']))) {
            return false
        }
        if (!(typeof obj['requestId'] === "string" || obj['requestId'] instanceof String)) {
            return false
        }
        return true
    }
}
