// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { InAppPurchaseReceipt } from "./InAppPurchaseReceipt"

/**
 * A decoded legacy App Store receipt (the PKCS#7 app receipt).
 *
 * {@link https://developer.apple.com/documentation/appstorereceipts/responsebody/receipt receipt}
 */
export interface AppReceipt {

    /**
     * The raw receipt type, e.g. Production, ProductionVPP, ProductionSandbox, ProductionVPPSandbox or Xcode.
     */
    receiptType?: string

    /**
     * The bundle identifier of the app the receipt belongs to.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/bundleid bundleId}
     */
    bundleId?: string

    /**
     * The raw ASN.1 bytes of the bundle identifier attribute, needed together with the opaque value and the
     * SHA-1 hash to compute the device-hash binding described in Apple's receipt validation guide.
     */
    bundleIdBytes?: Buffer

    /**
     * The app's version number.
     *
     * {@link https://developer.apple.com/documentation/storekit/apptransaction/appversion appVersion}
     */
    applicationVersion?: string

    /**
     * An opaque value used, with other data, to compute the device hash.
     */
    opaqueValue?: Buffer

    /**
     * The SHA-1 device-hash attribute of the receipt.
     */
    sha1Hash?: Buffer

    /**
     * The time the App Store generated the receipt, in UNIX time, in milliseconds.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/receiptcreationdate receiptCreationDate}
     */
    receiptCreationDate?: number

    /**
     * The time of the original app purchase, in UNIX time, in milliseconds.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/originalpurchasedate originalPurchaseDate}
     */
    originalPurchaseDate?: number

    /**
     * The version of the app that the user originally purchased.
     *
     * {@link https://developer.apple.com/documentation/appstoreserverapi/originalapplicationversion originalAppVersion}
     */
    originalApplicationVersion?: string

    /**
     * The expiration date of the receipt, in UNIX time, in milliseconds.
     * Present for apps purchased through the Volume Purchase Program.
     */
    expirationDate?: number

    /**
     * The decoded in-app purchase attributes contained in the receipt.
     *
     * {@link https://developer.apple.com/documentation/appstorereceipts/responsebody/receipt/in_app in_app}
     */
    inAppPurchases: InAppPurchaseReceipt[]

    /**
     * Attribute types this library does not model, keyed by type, with the verified-but-undecoded value bytes,
     * so fields Apple adds later remain accessible without a library update.
     */
    unknownAttributes: Map<number, Buffer[]>
}
