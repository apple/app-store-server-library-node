// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * The approval state of an image.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/imagestate imageState}
 */
export enum ImageState {
    /**
     * The image is awaiting approval.
     */
    PENDING = "PENDING",
    /**
     * The image is approved.
     */
    APPROVED = "APPROVED",
    /**
     * The image is rejected.
     */
    REJECTED = "REJECTED",
}

export class ImageStateValidator extends StringValidator {}
