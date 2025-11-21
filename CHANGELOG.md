# Changelog

## Version 2.0.0
- Support Retention Messaging API [https://github.com/apple/app-store-server-library-node/pull/341]
  - This changes internal details of AppStoreServerAPIClient, which is a breaking change for subclassing clients
- Incorporate changes for App Store Server API v1.17 [https://github.com/apple/app-store-server-library-node/pull/344] from @riyazpanjwani
- Add a new VerificationStatus case for retryable OCSP network failures [https://github.com/apple/app-store-server-library-node/pull/345]
- Incorporate changes for App Store Server API v1.18 [https://github.com/apple/app-store-server-library-node/pull/348] from @izanger
  - This changes OfferType's case SUBSCRIPTION_OFFER_CODE to OFFER_CODE, which is a breaking change

## Version 1.6.0
- Incorporate changes for App Store Server API v1.16 [https://github.com/apple/app-store-server-library-node/pull/275]

## Version 1.5.0
- Incorporate changes for App Store Server API v1.15 and App Store Server Notifications v2.15 [https://github.com/apple/app-store-server-library-node/pull/236]
- Add verified chain caching to improve performance [https://github.com/apple/app-store-server-library-node/pull/235]
- Expose VerificationStatus and VerificationException [https://github.com/apple/app-store-server-library-node/pull/222]
- Typo corrections [https://github.com/apple/app-store-server-library-node/pull/199] from @hakusai22

## Version 1.4.0
- Incorporate changes for App Store Server API v1.13 and App Store Server Notifications v2.13 [https://github.com/apple/app-store-server-library-node/pull/163]
- Add missing export for OfferDiscountType [https://github.com/apple/app-store-server-library-node/pull/159] from @coltkenn2658

## Version 1.3.0
- Incorporate changes for App Store Server API v1.12 and App Store Server Notifications v2.12 [https://github.com/apple/app-store-server-library-node/pull/146]

## Version 1.2.0
- Incorporate changes for App Store Server API v1.11 and App Store Server Notifications v2.11 [https://github.com/apple/app-store-server-library-node/pull/132]
- Various documentation and quality of life improvements, including contributions from @yidinghan

## Version 1.1.0
- Support App Store Server Notifications v2.10 [https://github.com/apple/app-store-server-library-node/pull/107]
- Require appAppleId in SignedDataVerifier for the Production environment [https://github.com/apple/app-store-server-library-node/pull/86]

## Version 1.0.1
- Bump jsrsasign package version [https://github.com/apple/app-store-server-library-node/pull/62]

## Version 1.0.0
- Add error message to APIException [https://github.com/apple/app-store-server-library-node/pull/48]

## Version 0.2.0
- Add support for reading unknown enum values [https://github.com/apple/app-store-server-library-node/pull/35]
- Add support for Xcode and LocalTesting environments [https://github.com/apple/app-store-server-library-node/pull/34]
- Add error codes from App Store Server API v1.9 [https://github.com/apple/app-store-server-library-node/pull/33]
- Add new fields from App Store Server API v1.10 [https://github.com/apple/app-store-server-library-node/pull/27]
- Document error codes [https://github.com/apple/app-store-server-library-node/pull/23]
- Correct naming of SignedDataVerifier to match other libraries [https://github.com/apple/app-store-server-library-node/pull/40]
