// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NotificationTypeV2, NotificationTypeV2Validator } from "./NotificationTypeV2"
import { Subtype, SubtypeValidator } from "./Subtype"
import { Validator } from "./Validator"

/**
 * The request body for notification history.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/notificationhistoryrequest NotificationHistoryRequest}
 */
export interface NotificationHistoryRequest {

    /**
     * The start date of the timespan for the requested App Store Server Notification history records.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/startdate startDate}
     */
    startDate: number

    /**
     * The end date of the timespan for the requested App Store Server Notification history records.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/enddate endDate}
     */
    endDate: number

    /**
     * A notification type.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/notificationtype notificationType}
     */
    notificationType?: NotificationTypeV2 | string

    /**
     * A notification subtype.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/notificationsubtype notificationSubtype}
     */
    notificationSubtype?: Subtype | string

    /**
     * A Boolean value you set to true to request only the notifications that haven’t reached your server successfully.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/onlyfailures onlyFailures}
     */
    onlyFailures?: boolean

    /**
     * The transaction identifier, which may be an original transaction identifier, of any transaction belonging to the customer.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/transactionid transactionId}
     */
    transactionId?: string
}

export class NotificationHistoryRequestValidator implements Validator<NotificationHistoryRequest> {
    static readonly notificationTypeV2Validator = new NotificationTypeV2Validator()
    static readonly subtypeValidator = new SubtypeValidator()
    validate(obj: any): obj is NotificationHistoryRequest {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (!(typeof obj['startDate'] === "number" || obj['startDate'] instanceof Number)) {
            return false
        }
        if (!(typeof obj['endDate'] === "number" || obj['endDate'] instanceof Number)) {
            return false
        }
        if ((typeof obj['notificationType'] !== 'undefined') && !(NotificationHistoryRequestValidator.notificationTypeV2Validator.validate(obj['notificationType']))) {
            return false
        }
        if ((typeof obj['notificationSubtype'] !== 'undefined') && !(NotificationHistoryRequestValidator.subtypeValidator.validate(obj['notificationSubtype']))) {
            return false
        }
        if ((typeof obj['onlyFailures'] !== 'undefined') && !(typeof obj['onlyFailures'] === "boolean" || obj['onlyFailures'] instanceof Boolean)) {
            return false
        }
        if ((typeof obj['transactionId'] !== 'undefined') && !(typeof obj['transactionId'] === "string" || obj['transactionId'] instanceof String)) {
            return false
        }
        return true
    }
}
