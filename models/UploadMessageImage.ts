// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * The definition of an image with its alternative text.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/uploadmessageimage UploadMessageImage}
 */
export interface UploadMessageImage {

    /**
     * The unique identifier of an image.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/imageidentifier imageIdentifier}
     */
    imageIdentifier: string

    /**
     * The alternative text you provide for the corresponding image.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/alttext altText}
     */
    altText: string
}

export class UploadMessageImageValidator implements Validator<UploadMessageImage> {
    private static readonly MAXIMUM_ALT_TEXT_LENGTH = 150
    validate(obj: any): obj is UploadMessageImage {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(typeof obj['imageIdentifier'] === "string" || obj['imageIdentifier'] instanceof String)) {
            return false
        }
        if (!((typeof obj['altText'] === "string" || obj['altText'] instanceof String) && [...obj['altText']].length <= UploadMessageImageValidator.MAXIMUM_ALT_TEXT_LENGTH)) {
            return false
        }
        return true
    }
}
