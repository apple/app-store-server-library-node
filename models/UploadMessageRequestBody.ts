// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { BulletPoint, BulletPointValidator } from "./BulletPoint"
import { HeaderPosition, HeaderPositionValidator } from "./HeaderPosition"
import { UploadMessageImage, UploadMessageImageValidator } from "./UploadMessageImage"
import { Validator } from "./Validator"

/**
 * The request body for uploading a message, which includes the message text and an optional image reference and bullet points.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/uploadmessagerequestbody UploadMessageRequestBody}
 */
export interface UploadMessageRequestBody {

    /**
     * The header text of the retention message that the system displays to customers.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/header header}
     */
    header: string

    /**
     * The body text of the retention message that the system displays to customers.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/body body}
     */
    body: string

    /**
     * The optional image identifier and its alternative text to appear as part of a text-based message with an image.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/uploadmessageimage UploadMessageImage}
     */
    image?: UploadMessageImage

    /**
     * An optional array of up to five bullet points.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/bulletpoint BulletPoint}
     */
    bulletPoints?: BulletPoint[]

    /**
     * The position of header text, which defaults to placing header text above the body.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/headerposition headerPosition}
     */
    headerPosition?: HeaderPosition | string
}

export class UploadMessageRequestBodyValidator implements Validator<UploadMessageRequestBody> {
    static readonly uploadMessageImageValidator = new UploadMessageImageValidator()
    static readonly bulletPointValidator = new BulletPointValidator()
    static readonly headerPositionValidator = new HeaderPositionValidator()
    private static readonly MAXIMUM_HEADER_LENGTH = 66
    private static readonly MAXIMUM_BODY_LENGTH = 144
    private static readonly MAXIMUM_BULLET_POINTS_COUNT = 5
    validate(obj: any): obj is UploadMessageRequestBody {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!((typeof obj['header'] === "string" || obj['header'] instanceof String) && [...obj['header']].length <= UploadMessageRequestBodyValidator.MAXIMUM_HEADER_LENGTH)) {
            return false
        }
        if (!((typeof obj['body'] === "string" || obj['body'] instanceof String) && [...obj['body']].length <= UploadMessageRequestBodyValidator.MAXIMUM_BODY_LENGTH)) {
            return false
        }
        if ((typeof obj['image'] !== 'undefined') && !(UploadMessageRequestBodyValidator.uploadMessageImageValidator.validate(obj['image']))) {
            return false
        }
        if (typeof obj['bulletPoints'] !== 'undefined') {
            if (!Array.isArray(obj['bulletPoints']) || obj['bulletPoints'].length > UploadMessageRequestBodyValidator.MAXIMUM_BULLET_POINTS_COUNT) {
                return false
            }
            for (const bulletPoint of obj['bulletPoints']) {
                if (!(UploadMessageRequestBodyValidator.bulletPointValidator.validate(bulletPoint))) {
                    return false
                }
            }
        }
        if ((typeof obj['headerPosition'] !== 'undefined') && !(UploadMessageRequestBodyValidator.headerPositionValidator.validate(obj['headerPosition']))) {
            return false
        }
        return true
    }
}
