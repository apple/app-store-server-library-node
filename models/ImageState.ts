// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator";

/**
 * The approval state of an image.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/imagestate imageState}
 */
export enum ImageState {
    PENDING_REVIEW = "PENDING_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export class ImageStateValidator extends StringValidator {}
