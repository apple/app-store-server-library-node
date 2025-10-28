// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { ImageState, ImageStateValidator } from "./ImageState"
import { Validator } from "./Validator"

/**
 * An image identifier and state information for an image.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/getimagelistresponseitem GetImageListResponseItem}
 */
export interface GetImageListResponseItem {

    /**
     * The identifier of the image.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/imageidentifier imageIdentifier}
     **/
    imageIdentifier?: string

    /**
     * The current state of the image.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/imagestate imageState}
     **/
    imageState?: ImageState | string
}

export class GetImageListResponseItemValidator implements Validator<GetImageListResponseItem> {
    static readonly imageStateValidator = new ImageStateValidator()
    validate(obj: any): obj is GetImageListResponseItem {
        if ((typeof obj['imageIdentifier'] !== 'undefined') && !(typeof obj['imageIdentifier'] === "string" || obj['imageIdentifier'] instanceof String)) {
            return false
        }
        if ((typeof obj['imageState'] !== 'undefined') && !(GetImageListResponseItemValidator.imageStateValidator.validate(obj['imageState']))) {
            return false
        }
        return true
    }
}
