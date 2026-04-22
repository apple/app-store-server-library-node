// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { BulletPoint } from "./BulletPoint"
import { HeaderPosition } from "./HeaderPosition"
import { UploadMessageImage } from "./UploadMessageImage"

/**
 * The request body for uploading a message, which includes the message text and an optional image reference.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/uploadmessagerequestbody UploadMessageRequestBody}
 */
export interface UploadMessageRequestBody {

    /**
     * The header text of the retention message that the system displays to customers.
     *
     * **Maximum length: 66 characters**
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/header header}
     **/
    header: string

    /**
     * The body text of the retention message that the system displays to customers.
     *
     * **Maximum length: 144 characters**
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/body body}
     **/
    body: string

    /**
     * The optional image identifier and its alternative text to appear as part of a text-based message with an image.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/uploadmessageimage UploadMessageImage}
     **/
    image?: UploadMessageImage

    /**
     * The position of header text, which defaults to placing header text above the body.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/headerposition headerPosition}
     **/
    headerPosition?: HeaderPosition | string

    /**
     * An optional array of bullet points.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/bulletpoint BulletPoint}
     **/
    bulletPoints?: BulletPoint[]
}
