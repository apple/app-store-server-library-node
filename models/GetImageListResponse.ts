// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { GetImageListResponseItem, GetImageListResponseItemValidator } from "./GetImageListResponseItem"
import { Validator } from "./Validator"

/**
 * A response that contains status information for all images.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/getimagelistresponse GetImageListResponse}
 */
export interface GetImageListResponse {

    /**
     * An array of all image identifiers and their image state.
     *
     * {@link https://developer.apple.com/documentation/retentionmessaging/getimagelistresponseitem GetImageListResponseItem}
     **/
    imageIdentifiers?: GetImageListResponseItem[]
}

export class GetImageListResponseValidator implements Validator<GetImageListResponse> {
    static readonly getImageListResponseItemValidator = new GetImageListResponseItemValidator()
    validate(obj: any): obj is GetImageListResponse {
        if (typeof obj['imageIdentifiers'] !== 'undefined') {
            if (!Array.isArray(obj['imageIdentifiers'])) {
                return false
            }
            for (const imageIdentifier of obj['imageIdentifiers']) {
                if (!(GetImageListResponseValidator.getImageListResponseItemValidator.validate(imageIdentifier))) {
                    return false
                }
            }
        }
        return true
    }
}
