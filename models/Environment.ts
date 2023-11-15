// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { StringValidator } from "./Validator";

/**
 * The server environment, either sandbox or production.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/environment environment}
 */
export enum Environment {
    SANDBOX = "Sandbox",
    PRODUCTION = "Production",
    XCODE = "Xcode",
    LOCAL_TESTING = "LocalTesting",
}

export class EnvironmentValidator extends StringValidator {}