// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * The response body that contains the default configuration information.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/defaultconfigurationresponse DefaultConfigurationResponse}
 */
export interface DefaultConfigurationResponse {

    /**
     * The message identifier of the retention message you configured as a default.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/messageidentifier messageIdentifier}
     **/
    messageIdentifier: string
}

export class DefaultConfigurationResponseValidator implements Validator<DefaultConfigurationResponse> {
    validate(obj: any): obj is DefaultConfigurationResponse {
        if (!(typeof obj['messageIdentifier'] === "string" || obj['messageIdentifier'] instanceof String)) {
            return false
        }
        return true
    }
}
