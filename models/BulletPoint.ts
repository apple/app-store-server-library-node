// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator"

/**
 * The text and its bullet-point image to include in a retention message’s bulleted list.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/bulletpoint BulletPoint}
 */
export interface BulletPoint {

    /**
     * The alternative text you provide for the corresponding image of the bullet point.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/alttext altText}
     */
    altText: string

    /**
     * The identifier of the image to use as the bullet point.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/imageidentifier imageIdentifier}
     */
    imageIdentifier: string

    /**
     * The text of the individual bullet point.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/bulletpointtext bulletPointText}
     */
    text: string
}

export class BulletPointValidator implements Validator<BulletPoint> {
    private static readonly MAXIMUM_ALT_TEXT_LENGTH = 150
    private static readonly MAXIMUM_TEXT_LENGTH = 66
    validate(obj: any): obj is BulletPoint {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!((typeof obj['altText'] === "string" || obj['altText'] instanceof String) && [...obj['altText']].length <= BulletPointValidator.MAXIMUM_ALT_TEXT_LENGTH)) {
            return false
        }
        if (!(typeof obj['imageIdentifier'] === "string" || obj['imageIdentifier'] instanceof String)) {
            return false
        }
        if (!((typeof obj['text'] === "string" || obj['text'] instanceof String) && [...obj['text']].length <= BulletPointValidator.MAXIMUM_TEXT_LENGTH)) {
            return false
        }
        return true
    }
}
