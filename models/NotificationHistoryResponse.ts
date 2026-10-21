// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NotificationHistoryResponseItem, NotificationHistoryResponseItemValidator } from "./NotificationHistoryResponseItem"
import { Validator } from "./Validator"

/**
 * A response that contains the App Store Server Notifications history for your app.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/notificationhistoryresponse NotificationHistoryResponse}
 */
export interface NotificationHistoryResponse {

    /**
     * An array of App Store Server Notifications history records.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/notificationhistoryresponseitem notificationHistoryResponseItem}
     */
    notificationHistory?: NotificationHistoryResponseItem[]

    /**
     * A Boolean value that indicates whether the App Store has more notification history records to send.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/hasmore hasMore}
     */
    hasMore?: boolean

    /**
     * A pagination token that you provide to Get Notification History on a subsequent request to get the next page of responses.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/paginationtoken paginationToken}
     */
    paginationToken?: string
}

export class NotificationHistoryResponseValidator implements Validator<NotificationHistoryResponse> {
    static readonly notificationHistoryResponseItemValidator = new NotificationHistoryResponseItemValidator()
    validate(obj: any): obj is NotificationHistoryResponse {
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
            return false
        }
        if (typeof obj['notificationHistory'] !== 'undefined') {
            if (!Array.isArray(obj['notificationHistory'])) {
                return false
            }
            for (const notificationHistoryResponseItem of obj['notificationHistory']) {
                if (!(NotificationHistoryResponseValidator.notificationHistoryResponseItemValidator.validate(notificationHistoryResponseItem))) {
                    return false
                }
            }
        }
        if ((typeof obj['hasMore'] !== 'undefined') && !(typeof obj['hasMore'] === "boolean" || obj['hasMore'] instanceof Boolean)) {
            return false
        }
        if ((typeof obj['paginationToken'] !== 'undefined') && !(typeof obj['paginationToken'] === "string" || obj['paginationToken'] instanceof String)) {
            return false
        }
        return true
    }
}
