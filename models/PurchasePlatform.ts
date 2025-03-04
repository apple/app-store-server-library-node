// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator";

/**
 * Values that represent Apple platforms.
 *
 * {@link https://developer.apple.com/documentation/storekit/appstore/platform AppStore.Platform}
 */
export enum PurchasePlatform {
    IOS = "iOS",
    MAC_OS = "macOS",
    TV_OS = "tvOS",
    VISION_OS = "visionOS"
}

export class PurchasePlatformValidator extends StringValidator {}