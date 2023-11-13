// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

export interface Validator<T> {
    validate(obj: any): obj is T
}

export class NumberValidator implements Validator<number> {
    validate(obj: any): obj is number {
         return typeof obj === 'number'
     }
 }
 
 export class StringValidator implements Validator<string> {
    validate(obj: any): obj is string {
         return typeof obj === "string" || obj instanceof String
     }
 }