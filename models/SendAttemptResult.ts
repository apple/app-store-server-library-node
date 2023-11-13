// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator";

/**
 * The success or error information the App Store server records when it attempts to send an App Store server notification to your server.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/sendattemptresult sendAttemptResult}
 */
export enum SendAttemptResult {
    SUCCESS = "SUCCESS",
    TIMED_OUT = "TIMED_OUT",
    TLS_ISSUE = "TLS_ISSUE",
    CIRCULAR_REDIRECT = "CIRCULAR_REDIRECT",
    NO_RESPONSE = "NO_RESPONSE",
    SOCKET_ISSUE = "SOCKET_ISSUE",
    UNSUPPORTED_CHARSET = "UNSUPPORTED_CHARSET",
    INVALID_RESPONSE = "INVALID_RESPONSE",
    PREMATURE_CLOSE = "PREMATURE_CLOSE",
    UNSUCCESSFUL_HTTP_RESPONSE_CODE = "UNSUCCESSFUL_HTTP_RESPONSE_CODE",
    OTHER = "OTHER",
}

export class SendAttemptResultValidator extends StringValidator {}
