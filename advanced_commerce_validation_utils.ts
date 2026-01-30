// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

/**
 * Utility class for validating Advanced Commerce API field constraints.
 */
export class AdvancedCommerceValidationUtils {

    public static readonly MAXIMUM_DESCRIPTION_LENGTH = 45
    public static readonly MAXIMUM_DISPLAY_NAME_LENGTH = 30
    private static readonly MAXIMUM_SKU_LENGTH = 128
    private static readonly MIN_PERIOD = 1
    private static readonly MAX_PERIOD = 12

    /**
     * Validates description is a string and does not exceed maximum length.
     *
     * @param description The description to validate
     * @return Whether the description is valid
     */
    public static validateDescription(description: any): boolean {
        return (typeof description === 'string' || description instanceof String) && description.length <= AdvancedCommerceValidationUtils.MAXIMUM_DESCRIPTION_LENGTH
    }

    /**
     * Validates display name is a string and does not exceed maximum length.
     *
     * @param displayName The display name to validate
     * @return Whether the display name is valid
     */
    public static validateDisplayName(displayName: any): boolean {
        return (typeof displayName === 'string' || displayName instanceof String) && displayName.length <= AdvancedCommerceValidationUtils.MAXIMUM_DISPLAY_NAME_LENGTH
    }

    /**
     * Validates SKU is a string and does not exceed maximum length.
     *
     * @param sku The SKU to validate
     * @return Whether the SKU is valid
     */
    public static validateSku(sku: any): boolean {
        return (typeof sku === 'string' || sku instanceof String) && sku.length <= AdvancedCommerceValidationUtils.MAXIMUM_SKU_LENGTH
    }

    /**
     * Validates periodCount is a number between MIN_PERIOD and MAX_PERIOD inclusive.
     *
     * @param periodCount The period count to validate
     * @return Whether the period count is valid
     */
    public static validatePeriodCount(periodCount: any): boolean {
        return typeof periodCount === 'number' &&
            periodCount >= AdvancedCommerceValidationUtils.MIN_PERIOD &&
            periodCount <= AdvancedCommerceValidationUtils.MAX_PERIOD
    }

    /**
     * Validates a list of items is a non-empty array with no null elements.
     *
     * @param list The list of items to validate
     * @return Whether the items list is valid
     */
    public static validateItems(list: any): boolean {
        return Array.isArray(list) && list.length > 0 && list.every((item: any) => item != null)
    }
}
