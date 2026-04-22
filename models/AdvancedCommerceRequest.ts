// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AdvancedCommerceRequestInfo } from './AdvancedCommerceRequestInfo'

export interface AdvancedCommerceRequest {
    /**
     * The metadata to include in server requests.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/requestinfo RequestInfo}
     **/
    requestInfo: AdvancedCommerceRequestInfo
}