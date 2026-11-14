// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

type Jsrsasign = typeof import('jsrsasign')

let jsrsasign: Jsrsasign | undefined

export function getJsrsasign(): Jsrsasign {
    if (jsrsasign === undefined) {
        jsrsasign = require('jsrsasign') as Jsrsasign
    }
    return jsrsasign
}
