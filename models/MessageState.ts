// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * The approval state of the message.
 *
 * {@link https://developer.apple.com/documentation/retentionmessaging/messagestate messageState}
 */
export enum MessageState {
    /**
     * The message is awaiting approval.
     */
    PENDING = "PENDING",
    /**
     * The message is approved.
     */
    APPROVED = "APPROVED",
    /**
     * The message is rejected.
     */
    REJECTED = "REJECTED",
}

export class MessageStateValidator extends StringValidator {}
