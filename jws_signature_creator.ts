// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import jsonwebtoken = require('jsonwebtoken');
import { randomUUID } from 'crypto';
import { AdvancedCommerceInAppRequestValidator } from './models/AbstractAdvancedCommerceInAppRequest';

class BaseSignatureCreator {
    private audience: string
    private signingKey: string
    private keyId: string
    private issuerId: string
    private bundleId: string

    public constructor(audience: string, signingKey: string, keyId: string, issuerId: string, bundleId: string) {
        this.audience = audience
        this.issuerId = issuerId
        this.keyId = keyId
        this.bundleId = bundleId
        this.signingKey = signingKey
    }

    protected internalCreateSignature(featureSpecificClaims: { [key: string]: any }) {
        var claims = featureSpecificClaims
        
        claims['bid'] = this.bundleId
        claims['nonce'] = randomUUID()

        return jsonwebtoken.sign(claims, this.signingKey, { algorithm: 'ES256', keyid: this.keyId, issuer: this.issuerId, audience: this.audience})
    }
}

export class PromotionalOfferV2SignatureCreator extends BaseSignatureCreator {
    /**
     * Create a PromotionalOfferV2SignatureCreator
     * 
     * @param signingKey Your private key downloaded from App Store Connect
     * @param keyId Your private key ID from App Store Connect
     * @param issuerId Your issuer ID from the Keys page in App Store Connect
     * @param bundleId Your app's bundle ID
     */
    public constructor(signingKey: string, keyId: string, issuerId: string, bundleId: string) {
        super('promotional-offer', signingKey, keyId, issuerId, bundleId)
    }

    /**
     * Create a promotional offer V2 signature.
     *
     * @param productId The unique identifier of the product
     * @param offerIdentifier The promotional offer identifier that you set up in App Store Connect
     * @param transactionId The unique identifier of any transaction that belongs to the customer. You can use the customer's appTransactionId, even for customers who haven't made any In-App Purchases in your app. This field is optional, but recommended.
     * @return The signed JWS.
     * {@link https://developer.apple.com/documentation/storekit/generating-jws-to-sign-app-store-requests Generating JWS to sign App Store requests}
     */
    public createSignature(productId: string, offerIdentifier: string, transactionId: string | undefined = undefined) {
        if (productId == null) {
            throw new Error()
        }
        if (offerIdentifier == null) {
            throw new Error()
        }
        let featureSpecificClaims: { [key: string]: any } = {}
        featureSpecificClaims['productId'] = productId
        featureSpecificClaims['offerIdentifier'] = offerIdentifier
        if (transactionId != null) {
            featureSpecificClaims['transactionId'] = transactionId
        }
        return super.internalCreateSignature(featureSpecificClaims)
    }
}

export class IntroductoryOfferEligibilitySignatureCreator extends BaseSignatureCreator {
    /**
     * Create an IntroductoryOfferEligibilitySignatureCreator
     * 
     * @param signingKey Your private key downloaded from App Store Connect
     * @param keyId Your private key ID from App Store Connect
     * @param issuerId Your issuer ID from the Keys page in App Store Connect
     * @param bundleId Your app's bundle ID
     */
    public constructor(signingKey: string, keyId: string, issuerId: string, bundleId: string) {
        super('introductory-offer-eligibility', signingKey, keyId, issuerId, bundleId)
    }

    /**
     * Create an introductory offer eligibility signature.
     *
     * @param productId The unique identifier of the product
     * @param allowIntroductoryOffer A boolean value that determines whether the customer is eligible for an introductory offer
     * @param transactionId The unique identifier of any transaction that belongs to the customer. You can use the customer's appTransactionId, even for customers who haven't made any In-App Purchases in your app.
     * @return The signed JWS.
     * {@link https://developer.apple.com/documentation/storekit/generating-jws-to-sign-app-store-requests Generating JWS to sign App Store requests}
     */
    public createSignature(productId: string, allowIntroductoryOffer: boolean, transactionId: string) {
        if (productId == null) {
            throw new Error()
        }
        if (allowIntroductoryOffer == null) {
            throw new Error()
        }
        if (transactionId == null) {
            throw new Error()
        }
        let featureSpecificClaims: { [key: string]: any } = {}
        featureSpecificClaims['productId'] = productId
        featureSpecificClaims['allowIntroductoryOffer'] = allowIntroductoryOffer
        featureSpecificClaims['transactionId'] = transactionId
        return super.internalCreateSignature(featureSpecificClaims)
    }
}

export interface AdvancedCommerceInAppRequest {}

export class AdvancedCommerceInAppSignatureCreator extends BaseSignatureCreator {
    private static readonly IN_APP_REQUEST_VALIDATOR = new AdvancedCommerceInAppRequestValidator()

    /**
     * Create an AdvancedCommerceInAppSignatureCreator
     * 
     * @param signingKey Your private key downloaded from App Store Connect
     * @param keyId Your private key ID from App Store Connect
     * @param issuerId Your issuer ID from the Keys page in App Store Connect
     * @param bundleId Your app's bundle ID
     */
    public constructor(signingKey: string, keyId: string, issuerId: string, bundleId: string) {
        super('advanced-commerce-api', signingKey, keyId, issuerId, bundleId)
    }

    /**
     * Create an Advanced Commerce in-app signed request.
     *
     * @param advancedCommerceInAppRequest The request to be signed.
     * @return The signed JWS.
     * {@link https://developer.apple.com/documentation/storekit/generating-jws-to-sign-app-store-requests Generating JWS to sign App Store requests}
     * @throws Error Thrown if the request is null or not an object, or if a one-time charge, subscription create, subscription modify or subscription reactivate request fails validation
     */
    public createSignature(advancedCommerceInAppRequest: AdvancedCommerceInAppRequest) {
        if (advancedCommerceInAppRequest == null) {
            throw new Error()
        }
        if (!AdvancedCommerceInAppSignatureCreator.IN_APP_REQUEST_VALIDATOR.validate(advancedCommerceInAppRequest)) {
            throw new Error()
        }
        let jsonRequest = JSON.stringify(advancedCommerceInAppRequest)
        
        let base64Request = Buffer.from(jsonRequest, 'utf-8').toString('base64')

        let featureSpecificClaims: { [key: string]: string } = {}
        featureSpecificClaims['request'] = base64Request
        return super.internalCreateSignature(featureSpecificClaims)
    }
}