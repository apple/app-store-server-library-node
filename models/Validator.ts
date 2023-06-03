// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

export interface Validator<T> {
    validate(obj: any): boolean
}