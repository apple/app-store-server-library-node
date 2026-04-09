// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

/**
 * The text and its bullet-point image to include in a retention message’s bulleted list.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/bulletpoint BulletPoint}
 */
export interface BulletPoint {

    /**
     * The text of the individual bullet point.
     * 
     * **Maximum length: 66 characters**
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/bulletpoint/text text}
     **/
    text: string

    /**
     * The identifier of the image to use as the bullet point.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/imageidentifier imageIdentifier}
     **/
    imageIdentifier: string

    /**
     * The alternative text you provide for the corresponding image of the bullet point.
     * 
     * **Maximum length: 150 characters**
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/alttext altText}
     **/
    altText: string
}
