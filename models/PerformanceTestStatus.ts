// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator";

/**
 * The status of the performance test.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/performanceteststatus PerformanceTestStatus}
 */
export enum PerformanceTestStatus {
    PENDING = "PENDING",
    PASS = "PASS",
    FAIL = "FAIL",
}

export class PerformanceTestStatusValidator extends StringValidator {}
