// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

/**
 * The request body that contains an app account token value.
 *
 * {@link https://developer.apple.com/documentation/appstoreserverapi/updateappaccounttokenrequest UpdateAppAccountTokenRequest}
 */
export interface UpdateAppAccountTokenRequest {

    /**
     * The UUID that an app optionally generates to map a customer's in-app purchase with its resulting App Store transaction.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/appaccounttoken appAccountToken}
     **/
    appAccountToken: string
}