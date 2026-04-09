// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator";

/**
 * The position where the header text appears in a message.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/headerposition headerPosition}
 */
export enum HeaderPosition {
    ABOVE_BODY = "ABOVE_BODY",
    ABOVE_IMAGE = "ABOVE_IMAGE",
}

export class HeaderPositionValidator extends StringValidator {}
