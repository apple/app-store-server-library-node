// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator"

/**
 * A string that describes the store the customer obtained the app from.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/storetype storeType}
 */
export enum StoreType {
    /**
     * The customer obtained the app from the App Store.
     */
    CONSUMER = "CONSUMER",
}

export class StoreTypeValidator extends StringValidator {}
