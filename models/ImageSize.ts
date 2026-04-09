// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator";

/**
 * The size of an image.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/imagesize imageSize}
 */
export enum ImageSize {
    FULL_SIZE = "FULL_SIZE",
    BULLET_POINT = "BULLET_POINT",
}

export class ImageSizeValidator extends StringValidator {}
