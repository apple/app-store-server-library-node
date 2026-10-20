// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * The platform on which a customer originally purchases an app.
 *
 * {@link https://developer.apple.com/documentation/storekit/appstore/platform AppStore.Platform}
 * {@link https://developer.apple.com/documentation/appstoreserverapi/originalplatform originalPlatform}
 */
export enum PurchasePlatform {
    MAC_OS = "macOS",
    IOS = "iOS",
    TV_OS = "tvOS",
    VISION_OS = "visionOS",
}

export class PurchasePlatformValidator extends StringValidator {}
