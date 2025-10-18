// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

/**
 * The request body that contains the default configuration information.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/defaultconfigurationrequest DefaultConfigurationRequest}
 */
export interface DefaultConfigurationRequest {

    /**
     * The message identifier of the message to configure as a default message.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/messageidentifier messageIdentifier}
     **/
    messageIdentifier?: string
}
