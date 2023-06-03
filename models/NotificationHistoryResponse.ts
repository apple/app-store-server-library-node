// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NotificationHistoryResponseItem } from "./NotificationHistoryResponseItem";
import { Validator } from "./Validator";

/**
 * A response that contains the App Store Server Notifications history for your app.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/notificationhistoryresponse NotificationHistoryResponse}
 */
export interface NotificationHistoryResponse {

    /**
     * A pagination token that you return to the endpoint on a subsequent call to receive the next set of results.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/paginationtoken paginationToken}
     **/
    paginationToken?: string
        
    /**
     * A Boolean value indicating whether the App Store has more transaction data.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/hasmore hasMore}
     **/
    hasMore?: boolean

    /**
     * An array of App Store server notification history records.
     *
     **/
    notificationHistory?: NotificationHistoryResponseItem[];
}


export class NotificationHistoryResponseValidator implements Validator<NotificationHistoryResponse> {
    static readonly notificationHistoryResponseItemValidator = new NotificationHistoryResponseValidator()
    validate(obj: any): boolean {
        if ((typeof obj['paginationToken'] !== 'undefined') && !(typeof obj['paginationToken'] === "string" || obj['paginationToken'] instanceof String)) {
            return false
        }
        if ((typeof obj['hasMore'] !== 'undefined') && !(typeof obj['hasMore'] === "boolean" || obj['hasMore'] instanceof Boolean)) {
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
        return true
    }
}
