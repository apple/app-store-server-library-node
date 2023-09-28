# Apple App Store Server Node.js Library
The Node.js server library for the [App Store Server API](https://developer.apple.com/documentation/appstoreserverapi) and [App Store Server Notifications](https://developer.apple.com/documentation/appstoreservernotifications). Also available in [Swift](https://github.com/apple/app-store-server-library-swift), [Python](https://github.com/apple/app-store-server-library-python), and [Java](https://github.com/apple/app-store-server-library-java).

## Table of Contents
1. [Beta](#-beta-)
2. [Installation](#installation)
3. [Documentation](#documentation)
4. [Usage](#usage)
5. [Support](#support)

## ⚠️ Beta ⚠️

This software is currently in Beta testing. Therefore, it should only be used for testing purposes, like for the Sandbox environment. API signatures may change between releases and signature verification may receive security updates. 

## Installation

#### Requirements

- Node 16+

### NPM/Yarn
```bash
# With NPM
npm install @apple/app-store-server-library --save
# With Yarn
yarn add @apple/app-store-server-library
```

## Documentation

[Documentation](https://apple.github.io/app-store-server-library-node/)

[WWDC Video](https://developer.apple.com/videos/play/wwdc2023/10143/)
## Usage

### API Usage

```typescript
import { AppStoreServerAPIClient, Environment, SendTestNotificationResponse } from "@apple/app-store-server-library"

const issuerId = "99b16628-15e4-4668-972b-eeff55eeff55"
const keyId = "ABCDEFGHIJ"
const bundleId = "com.example"
const filePath = "/path/to/key/SubscriptionKey_ABCDEFGHIJ.p8"
const encodedKey = readFile(filePath) // Specific implementation may vary
const environment = Environment.SANDBOX

const client = new AppStoreServerAPIClient(encodedKey, keyId, issuerId, bundleId, environment)

try {
    const response: SendTestNotificationResponse = await client.requestTestNotification()
    console.log(response)
} catch (e) {
    console.error(e)
}
```

### Verification Usage

```typescript
import { SignedDataVerifier } from "@apple/app-store-server-library/dist/jwt_verification"

const bundleId = "com.example"
const appleRootCAs: Buffer[] = loadRootCAs() // Specific implementation may vary
const enableOnlineChecks = true
const environment = Environment.SANDBOX
const verifier = new SignedDataVerifier(appleRootCAs, enableOnlineChecks, environment, bundleId)

const notificationPayload = "ey..."
const verifiedNotification = await verifier.verifyAndDecodeNotification()
console.log(verifiedNotification)
```

### Receipt Usage

```typescript
import { AppStoreServerAPIClient, Environment, ReceiptUtility, Order, ProductType, HistoryResponse, TransactionHistoryRequest } from "@apple/app-store-server-library"

const issuerId = "99b16628-15e4-4668-972b-eeff55eeff55"
const keyId = "ABCDEFGHIJ"
const bundleId = "com.example"
const filePath = "/path/to/key/SubscriptionKey_ABCDEFGHIJ.p8"
const encodedKey = readFile(filePath) // Specific implementation may vary
const environment = Environment.SANDBOX

const client =
        new AppStoreServerAPIClient(encodedKey, keyId, issuerId, bundleId, environment)

const appReceipt = "MI..."
const receiptUtil = new ReceiptUtility()
const transactionId = receiptUtil.extractTransactionIdFromAppReceipt(appReceipt)
if (transactionId != null) {
    const transactionHistoryRequest: TransactionHistoryRequest = {
        sort: Order.ASCENDING,
        revoked: false,
        productTypes: [ProductType.AUTO_RENEWABLE]
    }
    let response: HistoryResponse | null = null
    let transactions: string[] = []
    do {
        const revisionToken = response !== null && response.revision !== null ? response.revision : null
        response = await client.getTransactionHistory(transactionId, revisionToken, transactionHistoryRequest)
        if (response.signedTransactions) {
            transactions = transactions.concat(response.signedTransactions)
        }
    } while (response.hasMore)
    console.log(transactions)
}
```

### Promotional Offer Signature Creation

```typescript
import { PromotionalOfferSignatureCreator } from "@apple/app-store-server-library"

const keyId = "ABCDEFGHIJ"
const bundleId = "com.example"
const filePath = "/path/to/key/SubscriptionKey_ABCDEFGHIJ.p8"
const encodedKey = readFile(filePath) // Specific implementation may vary

const productId = "<product_id>"
const subscriptionOfferId = "<subscription_offer_id>"
const applicationUsername = "<application_username>"
const signatureCreator = new PromotionalOfferSignatureCreator(encodedKey, keyId, bundleId)

const signature = signatureCreator.createSignature(productId, subscriptionOfferId, signatureCreator)
console.log(signature)
```

## Support

Only the latest major version of the library will receive updates, including security updates. Therefore, it is recommended to update to new major versions.
