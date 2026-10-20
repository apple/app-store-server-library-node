// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * The size of an image.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/imagesize imageSize}
 */
export enum ImageSize {
    /**
     * 3840 pixels in width, and from 160 to 2160 pixels in height, inclusive.
     */
    FULL_SIZE = "FULL_SIZE",
    /**
     * 1024 by 1024 pixels, to use for bullet points only.
     */
    BULLET_POINT = "BULLET_POINT",
}

export class ImageSizeValidator extends StringValidator {}
