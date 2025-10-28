// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator";

/**
 * The approval state of a message.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/messagestate messageState}
 */
export enum MessageState {
    PENDING_REVIEW = "PENDING_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export class MessageStateValidator extends StringValidator {}
