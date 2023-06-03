// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import { NotificationTypeV2 } from "./NotificationTypeV2";
import { Subtype, SubtypeValidator } from "./Subtype";

/**
 * The request body for notification history.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/notificationhistoryrequest NotificationHistoryRequest}
 */
export interface NotificationHistoryRequest {

    /**
     * The start date of the timespan for the requested App Store Server Notification history records. The startDate needs to precede the endDate. Choose a startDate that’s within the past 180 days from the current date.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/startdate startDate}
     **/
    startDate?: number
        
    /**
     * The end date of the timespan for the requested App Store Server Notification history records. Choose an endDate that’s later than the startDate. If you choose an endDate in the future, the endpoint automatically uses the current date as the endDate.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/enddate endDate}
     **/
    endDate?: number
        
    /**
     * A notification type. Provide this field to limit the notification history records to those with this one notification type. For a list of notifications types, see notificationType.
     * Include either the transactionId or the notificationType in your query, but not both.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/notificationtype notificationType}
     **/
    notificationType?: NotificationTypeV2;
        
    /**
     * A notification subtype. Provide this field to limit the notification history records to those with this one notification subtype. For a list of subtypes, see subtype. If you specify a notificationSubtype, you need to also specify its related notificationType.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/notificationsubtype notificationSubtype}
     **/
    notificationSubtype?: Subtype
        
    /**
     * The transaction identifier, which may be an original transaction identifier, of any transaction belonging to the customer. Provide this field to limit the notification history request to this one customer.
     * Include either the transactionId or the notificationType in your query, but not both.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/transactionid transactionId}
     **/
    transactionId?: string

    /**
     * A Boolean value you set to true to request only the notifications that haven’t reached your server successfully. The response also includes notifications that the App Store server is currently retrying to send to your server.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/onlyfailures onlyFailures}
     **/
    onlyFailures?: boolean
}