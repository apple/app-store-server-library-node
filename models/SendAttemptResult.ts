// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * The success or error information the App Store server records when it attempts to send an App Store server notification to your server.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/sendattemptresult sendAttemptResult}
 */
export enum SendAttemptResult {
    /**
     * The App Store server received a success response when it sent the notification to your server.
     */
    SUCCESS = "SUCCESS",
    /**
     * The App Store server didn’t get a response from your server and timed out.
     */
    TIMED_OUT = "TIMED_OUT",
    /**
     * The App Store server couldn’t establish a TLS session or validate your certificate.
     */
    TLS_ISSUE = "TLS_ISSUE",
    /**
     * The App Store server detected a continual redirect.
     */
    CIRCULAR_REDIRECT = "CIRCULAR_REDIRECT",
    /**
     * The App Store server didn’t receive a valid HTTP response from your server.
     */
    NO_RESPONSE = "NO_RESPONSE",
    /**
     * A network error caused the notification attempt to fail.
     */
    SOCKET_ISSUE = "SOCKET_ISSUE",
    /**
     * The App Store server doesn’t support the supplied charset.
     */
    UNSUPPORTED_CHARSET = "UNSUPPORTED_CHARSET",
    /**
     * The App Store server received an invalid response from your server.
     */
    INVALID_RESPONSE = "INVALID_RESPONSE",
    /**
     * The App Store server’s connection to your server was closed while the send was in progress.
     */
    PREMATURE_CLOSE = "PREMATURE_CLOSE",
    /**
     * The App Store server didn’t receive an HTTP 200 response from your server.
     */
    UNSUCCESSFUL_HTTP_RESPONSE_CODE = "UNSUCCESSFUL_HTTP_RESPONSE_CODE",
    /**
     * Another error occurred that prevented your server from receiving the notification.
     */
    OTHER = "OTHER",
}

export class SendAttemptResultValidator extends StringValidator {}
