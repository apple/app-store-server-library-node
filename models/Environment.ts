// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { Validator } from "./Validator";

/**
 * The server environment, either sandbox or production.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/environment environment}
 */
export enum Environment {
    SANDBOX = "Sandbox",
    PRODUCTION = "Production",
}

export class EnvironmentValidator implements Validator<Environment> {
   validate(obj: any): boolean {
        return Object.values(Environment).includes(obj)
    }
}
