// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

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
     */
    messageIdentifier: string
}

export class DefaultConfigurationRequestValidator implements Validator<DefaultConfigurationRequest> {
    validate(obj: any): obj is DefaultConfigurationRequest {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(typeof obj['messageIdentifier'] === "string" || obj['messageIdentifier'] instanceof String)) {
            return false
        }
        return true
    }
}
