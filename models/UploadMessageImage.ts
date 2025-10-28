// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

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
     **/
    imageIdentifier: string

    /**
     * The alternative text you provide for the corresponding image.
     *
     * **Maximum length: 150 characters**
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/alttext altText}
     **/
    altText: string
}
