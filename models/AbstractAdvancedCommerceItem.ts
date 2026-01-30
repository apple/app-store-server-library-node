// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AbstractAdvancedCommerceBaseItem } from './AbstractAdvancedCommerceBaseItem'

export interface AbstractAdvancedCommerceItem extends AbstractAdvancedCommerceBaseItem {
    /**
     * A string you provide that describes a SKU.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/description description}
     **/
    description: string

    /**
     * A string with a product name that you can localize and is suitable for display to customers.
     *
     * {@link https://developer.apple.com/documentation/advancedcommerceapi/displayname displayName}
     **/
    displayName: string
}