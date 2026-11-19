// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import jsonwebtoken = require('jsonwebtoken');

import { KeyObject, X509Certificate } from 'crypto';
import type { JwsVerifier } from '@preeternal/jws-verifier';
import { Environment } from './models/Environment';
import { JWSTransactionDecodedPayload, JWSTransactionDecodedPayloadValidator } from './models/JWSTransactionDecodedPayload';
import { ResponseBodyV2DecodedPayload, ResponseBodyV2DecodedPayloadValidator } from './models/ResponseBodyV2DecodedPayload';
import { JWSRenewalInfoDecodedPayload, JWSRenewalInfoDecodedPayloadValidator } from './models/JWSRenewalInfoDecodedPayload';
import { DecodedRealtimeRequestBody, DecodedRealtimeRequestBodyValidator } from './models/DecodedRealtimeRequestBody';
import { Validator } from './models/Validator';
import { DecodedSignedData } from './models/DecodedSignedData';
import { AppTransaction, AppTransactionValidator } from './models/AppTransaction';
import { APPLE_INTERMEDIATE_OID, APPLE_LEAF_OID, checkLegacyOcsp, hasAppleCertificateMarkers, MAX_SKEW, OCSP_TIMEOUT_MS, ocspEndpoints } from './jws_verifier_compat';
import { getVerifierModule, isVerifierError } from './jws_verifier_loader';

const MAXIMUM_CACHE_SIZE = 32 // There are unlikely to be more than a couple keys at once
const CACHE_TIME_LIMIT = 15 * 60 * 1_000 // 15 minutes

export class CacheValue {
  public publicKey: KeyObject
  public cacheExpiry: number

  constructor(publicKey: KeyObject, cacheExpiry: number) {
    this.publicKey = publicKey
    this.cacheExpiry = cacheExpiry
  }
}

/**
 * A class providing utility methods for verifying and decoding App Store signed data.
 * 
 * Example Usage:
 * ```ts
 * const verifier = new SignedDataVerifier([appleRoot, appleRoot2], true, Environment.SANDBOX, "com.example")
 * 
 * try {
 *     const decodedNotification = await verifier.verifyAndDecodeNotification("ey...")
 *     console.log(decodedNotification)
 * } catch (e) {
 *     console.error(e)
 * }
 * ```
 */
export class SignedDataVerifier {
    private JWSRenewalInfoDecodedPayloadValidator = new JWSRenewalInfoDecodedPayloadValidator()
    private JWSTransactionDecodedPayloadValidator = new JWSTransactionDecodedPayloadValidator()
    private responseBodyV2DecodedPayloadValidator = new ResponseBodyV2DecodedPayloadValidator()
    private appTransactionValidator = new AppTransactionValidator()
    private decodedRealtimeRequestBodyValidator = new DecodedRealtimeRequestBodyValidator()

    protected rootCertificates: X509Certificate[]
    protected enableOnlineChecks: boolean
    protected bundleId: string
    protected appAppleId?: number
    protected environment: Environment
    protected verifiedPublicKeyCache: { [index: string]: CacheValue }
    private offlineVerifier?: JwsVerifier
    private readonly onlineVerifiers = new Map<string, JwsVerifier>()

    /**
     * 
     * @param appleRootCertificates A list of DER-encoded root certificates 
     * @param enableOnlineChecks Whether to enable revocation checking and check expiration using the current date
     * @param environment The App Store environment to target for checks
     * @param bundleId The app's bundle identifier
     * @param appAppleId The app's identifier, omitted in the sandbox environment
     */
    constructor(appleRootCertificates: Buffer[], enableOnlineChecks: boolean, environment: Environment, bundleId: string, appAppleId?: number) {
      this.rootCertificates = appleRootCertificates.map(cert => new X509Certificate(cert))
      this.enableOnlineChecks = enableOnlineChecks
      this.bundleId = bundleId;
      this.environment = environment
      this.appAppleId = appAppleId
      this.verifiedPublicKeyCache = {}
      if (environment === Environment.PRODUCTION && appAppleId === undefined) {
        throw new Error("appAppleId is required when the environment is Production")
      }
    }

    /**
     * Verifies and decodes a signedTransaction obtained from the App Store Server API, an App Store Server Notification, or from a device
     * See {@link https://developer.apple.com/documentation/appstoreserverapi/jwstransaction JWSTransaction}
     *
     * @param signedTransactionInfo The signedTransaction field
     * @return The decoded transaction info after verification
     * @throws VerificationException Thrown if the data could not be verified
     */
    async verifyAndDecodeTransaction(signedTransactionInfo: string): Promise<JWSTransactionDecodedPayload> {
      const decodedJWT: JWSTransactionDecodedPayload = await this.verifyJWT(signedTransactionInfo, this.JWSTransactionDecodedPayloadValidator, this.extractSignedDate);
      if (decodedJWT.bundleId !== this.bundleId) {
        throw new VerificationException(VerificationStatus.INVALID_APP_IDENTIFIER)
      }
      if (decodedJWT.environment !== this.environment) {
        throw new VerificationException(VerificationStatus.INVALID_ENVIRONMENT)
      }
      return decodedJWT;
    }

    /**
     * Verifies and decodes a signedRenewalInfo obtained from the App Store Server API, an App Store Server Notification, or from a device
     * See {@link https://developer.apple.com/documentation/appstoreserverapi/jwsrenewalinfo JWSRenewalInfo}
     *
     * @param signedRenewalInfo The signedRenewalInfo field
     * @return The decoded renewal info after verification
     * @throws VerificationException Thrown if the data could not be verified
     */
    async verifyAndDecodeRenewalInfo(signedRenewalInfo: string): Promise<JWSRenewalInfoDecodedPayload> {
      const decodedRenewalInfo: JWSRenewalInfoDecodedPayload = await this.verifyJWT(signedRenewalInfo, this.JWSRenewalInfoDecodedPayloadValidator, this.extractSignedDate);
      const environment = decodedRenewalInfo.environment
      if (this.environment !== environment) {
        throw new VerificationException(VerificationStatus.INVALID_ENVIRONMENT)
      }
      return decodedRenewalInfo
    }

    /**
     * Verifies and decodes an App Store Server Notification signedPayload
     * See {@link https://developer.apple.com/documentation/appstoreservernotifications/signedpayload signedPayload}
     *
     * @param signedPayload The payload received by your server
     * @return The decoded payload after verification
     * @throws VerificationException Thrown if the data could not be verified
     */
    async verifyAndDecodeNotification(signedPayload: string): Promise<ResponseBodyV2DecodedPayload> {
      const decodedJWT: ResponseBodyV2DecodedPayload = await this.verifyJWT(signedPayload, this.responseBodyV2DecodedPayloadValidator, this.extractSignedDate);
      let appAppleId: number | undefined
      let bundleId: string | undefined
      let environment: string | undefined
      if (decodedJWT.data) {
        appAppleId = decodedJWT.data.appAppleId
        bundleId = decodedJWT.data.bundleId
        environment = decodedJWT.data.environment
      } else if (decodedJWT.summary) {
        appAppleId = decodedJWT.summary.appAppleId
        bundleId = decodedJWT.summary.bundleId
        environment = decodedJWT.summary.environment
      } else if (decodedJWT.externalPurchaseToken) {
        appAppleId = decodedJWT.externalPurchaseToken.appAppleId
        bundleId = decodedJWT.externalPurchaseToken.bundleId
        if (decodedJWT.externalPurchaseToken.externalPurchaseId.startsWith("SANDBOX")) {
          environment = Environment.SANDBOX
        } else {
          environment = Environment.PRODUCTION
        }
      } else if (decodedJWT.appData) {
        appAppleId = decodedJWT.appData.appAppleId
        bundleId = decodedJWT.appData.bundleId
        environment = decodedJWT.appData.environment
      }
      this.verifyNotification(bundleId, appAppleId, environment)
      return decodedJWT
    }

    protected verifyNotification(bundleId?: string, appAppleId?: number, environment?: string) {
      if (this.bundleId !== bundleId || (this.environment === Environment.PRODUCTION && this.appAppleId !== appAppleId)) {
        throw new VerificationException(VerificationStatus.INVALID_APP_IDENTIFIER)
      }
      if (this.environment !== environment) {
        throw new VerificationException(VerificationStatus.INVALID_ENVIRONMENT)
      }
    }

    /**
     * Verifies and decodes a signed AppTransaction
     * See {@link https://developer.apple.com/documentation/storekit/apptransaction AppTransaction}
     *
     * @param signedAppTransaction The signed AppTransaction
     * @returns The decoded AppTransaction after validation
     * @throws VerificationException Thrown if the data could not be verified
     */
    async verifyAndDecodeAppTransaction(signedAppTransaction: string): Promise<AppTransaction> {
      const decodedAppTransaction: AppTransaction = await this.verifyJWT(signedAppTransaction, this.appTransactionValidator, t => t.receiptCreationDate === undefined ? new Date() : new Date(t.receiptCreationDate));
      const environment = decodedAppTransaction.receiptType
      if (this.bundleId !== decodedAppTransaction.bundleId || (this.environment === Environment.PRODUCTION && this.appAppleId !== decodedAppTransaction.appAppleId)) {
        throw new VerificationException(VerificationStatus.INVALID_APP_IDENTIFIER)
      }
      if (this.environment !== environment) {
        throw new VerificationException(VerificationStatus.INVALID_ENVIRONMENT)
      }
      return decodedAppTransaction
    }

    /**
     * Verifies and decodes a Retention Messaging API signedPayload
     * See {@link https://developer.apple.com/documentation/retentionmessaging/signedpayload signedPayload}
     *
     * @param signedPayload The payload received by your server
     * @returns The decoded payload after verification
     * @throws VerificationException Thrown if the data could not be verified
     */
    async verifyAndDecodeRealtimeRequest(signedPayload: string): Promise<DecodedRealtimeRequestBody> {
      const decodedRequest: DecodedRealtimeRequestBody = await this.verifyJWT(signedPayload, this.decodedRealtimeRequestBodyValidator, this.extractSignedDate);
      if (this.environment === Environment.PRODUCTION && this.appAppleId !== decodedRequest.appAppleId) {
        throw new VerificationException(VerificationStatus.INVALID_APP_IDENTIFIER)
      }
      if (this.environment !== decodedRequest.environment) {
        throw new VerificationException(VerificationStatus.INVALID_ENVIRONMENT)
      }
      return decodedRequest
    }

    protected async verifyJWT<T>(jwt: string, validator: Validator<T>, signedDateExtractor: (decodedJWT: T) => Date): Promise<T> {
      try {
        const decoded = jsonwebtoken.decode(jwt, { complete: true })
        const decodedJWT: unknown = decoded?.payload
        if (typeof decodedJWT !== 'object' || decodedJWT === null || Array.isArray(decodedJWT)) {
          throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE)
        }
        if (!validator.validate(decodedJWT)) {
          throw new VerificationException(VerificationStatus.FAILURE)
        }
        if (this.environment === Environment.XCODE || this.environment === Environment.LOCAL_TESTING) {
          // Data is not signed by the App Store, and verification should be skipped
          // The environment MUST be checked in the public method calling this
          return decodedJWT
        }
        const chain = decoded?.header.x5c
        if (!Array.isArray(chain) || chain.length !== 3) {
          throw new VerificationException(VerificationStatus.INVALID_CHAIN_LENGTH)
        }
        if (chain.some(cert => typeof cert !== 'string')) {
          throw new VerificationException(VerificationStatus.INVALID_CERTIFICATE)
        }

        // Subclasses may override the chain or OCSP hooks or manage the protected cache.
        if (this.constructor !== SignedDataVerifier) {
          const [leaf, intermediate] = this.decodeSigningCertificates(chain)
          const effectiveDate = this.enableOnlineChecks ? new Date() : signedDateExtractor(decodedJWT)
          const publicKey = await this.verifyCertificateChain(this.rootCertificates, leaf, intermediate, effectiveDate)
          jsonwebtoken.verify(jwt, publicKey, { algorithms: ['ES256'] })
        } else {
          await this.verifyWithBackend(jwt, chain, decodedJWT, signedDateExtractor)
        }
        return decodedJWT
      } catch (error) {
        if (error instanceof VerificationException) {
          throw error
        } else if (isVerifierError(error)) {
          switch (error.code) {
            case 'transport-error':
              throw new VerificationException(VerificationStatus.RETRYABLE_VERIFICATION_FAILURE, error)
            case 'invalid-header':
            case 'certificate-policy':
              throw new VerificationException(VerificationStatus.INVALID_CERTIFICATE, error)
            case 'certificate-chain':
              throw new VerificationException(!('cause' in error) || error.cause === undefined
                ? VerificationStatus.VERIFICATION_FAILURE : VerificationStatus.INVALID_CERTIFICATE, error)
            case 'ocsp-format':
            case 'ocsp-policy':
            case 'ocsp-status':
            case 'ocsp-signature':
            case 'ocsp-revoked':
            case 'ocsp-unknown':
            case 'ocsp-stale':
              throw new VerificationException(VerificationStatus.FAILURE, error)
          }
          throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, error)
        } else if (error instanceof Error) {
          throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, error)
        }
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE)
      }
    }

    private decodeSigningCertificates(chain: string[]): X509Certificate[] {
      try {
        return chain.slice(0, 2).map(cert => new X509Certificate(Buffer.from(cert, 'base64')))
      } catch (error) {
        throw new VerificationException(VerificationStatus.INVALID_CERTIFICATE, error instanceof Error ? error : undefined)
      }
    }

    private async verifyWithBackend<T>(jwt: string, chain: string[], payload: T, signedDateExtractor: (payload: T) => Date): Promise<void> {
      if (!this.enableOnlineChecks) {
        this.offlineVerifier ??= this.createBackend()
        await this.offlineVerifier.verify(jwt, { effectiveTime: signedDateExtractor(payload).getTime() })
        return
      }

      // The RC requires exact OCSP URLs. Derive them once per chain; the backend
      // authenticates the JWS and checks the chain against configured roots before fetching.
      const cacheKey = chain.join('|')
      const cached = this.onlineVerifiers.get(cacheKey)
      if (cached !== undefined) {
        await cached.verify(jwt)
        return
      }
      const endpoints = this.decodeSigningCertificates(chain).map(cert => ocspEndpoints(cert))
      if (endpoints.some(urls => urls.length === 0)) {
        throw new VerificationException(VerificationStatus.INVALID_CERTIFICATE)
      }
      const backend = this.createBackend(endpoints.flat())
      await backend.verify(jwt)
      this.onlineVerifiers.set(cacheKey, backend)
      if (this.onlineVerifiers.size > MAXIMUM_CACHE_SIZE) {
        const oldest = this.onlineVerifiers.keys().next().value
        if (oldest !== undefined) this.onlineVerifiers.delete(oldest)
      }
    }

    private createBackend(allowedEndpoints?: string[]): JwsVerifier {
      return getVerifierModule().createVerifier({
        trustedRoots: this.rootCertificates.map(cert => cert.raw),
        policy: {
          mode: allowedEndpoints === undefined ? 'offline' : 'online',
          requiredExtensions: { leaf: [APPLE_LEAF_OID], intermediate: [APPLE_INTERMEDIATE_OID] },
          ocsp: allowedEndpoints === undefined ? undefined : { allowedEndpoints, timeoutMs: OCSP_TIMEOUT_MS },
          validateClaims: (payload) => {
            // The SDK's previous jsonwebtoken.verify call also checked standard JWT time claims.
            if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) return false
            const { nbf, exp } = payload as Record<string, unknown>
            const now = Math.floor(Date.now() / 1000)
            return (nbf === undefined || (typeof nbf === 'number' && nbf <= now))
                && (exp === undefined || (typeof exp === 'number' && exp > now))
          }
        },
        limits: { maxCacheEntries: 1, cacheTtlMs: CACHE_TIME_LIMIT }
      })
    }

    protected async verifyCertificateChain(trustedRoots: X509Certificate[], leaf: X509Certificate, intermediate: X509Certificate, effectiveDate: Date): Promise<KeyObject> {
      let cacheKey = leaf.toString() + intermediate.toString()
      if (this.enableOnlineChecks) {
        if (cacheKey in this.verifiedPublicKeyCache) {
          if (this.verifiedPublicKeyCache[cacheKey].cacheExpiry > new Date().getTime()) {
            return this.verifiedPublicKeyCache[cacheKey].publicKey
          }
        }
      }

      let publicKey = await this.verifyCertificateChainWithoutCaching(trustedRoots, leaf, intermediate, effectiveDate)

      if (this.enableOnlineChecks) {
        this.verifiedPublicKeyCache[cacheKey] = new CacheValue(leaf.publicKey, new Date().getTime() + CACHE_TIME_LIMIT)
        if (Object.keys(this.verifiedPublicKeyCache).length > MAXIMUM_CACHE_SIZE) {
          for (const key of Object.keys(this.verifiedPublicKeyCache)) {
            if (this.verifiedPublicKeyCache[key].cacheExpiry < new Date().getTime()) {
              delete this.verifiedPublicKeyCache[key]
            }
          }
        }
      }
      return publicKey
    }

    protected async verifyCertificateChainWithoutCaching(trustedRoots: X509Certificate[], leaf: X509Certificate, intermediate: X509Certificate, effectiveDate: Date): Promise<KeyObject> {
      let validity = false
      let rootCert
      for (const root of trustedRoots) {
        if (intermediate.verify(root.publicKey) && intermediate.issuer === root.subject) {
          validity = true
          rootCert = root
        }
      }
      validity = validity && leaf.verify(intermediate.publicKey) && leaf.issuer === intermediate.subject
      validity = validity && intermediate.ca
      validity = validity && hasAppleCertificateMarkers(leaf, intermediate)
      if (!validity) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE);
      }
      rootCert = rootCert as X509Certificate
      this.checkDates(leaf, effectiveDate)
      this.checkDates(intermediate, effectiveDate)
      this.checkDates(rootCert, effectiveDate)
      if (this.enableOnlineChecks) {
        await Promise.all([this.checkOCSPStatus(leaf, intermediate), this.checkOCSPStatus(intermediate, rootCert)])
      }
      return leaf.publicKey
    }
    protected async checkOCSPStatus(cert: X509Certificate, issuer: X509Certificate): Promise<void> {
      switch (await checkLegacyOcsp(cert, issuer)) {
        case 'good': return
        case 'invalid-certificate':
          throw new VerificationException(VerificationStatus.INVALID_CERTIFICATE)
        case 'retryable':
          throw new VerificationException(VerificationStatus.RETRYABLE_VERIFICATION_FAILURE)
        case 'invalid-response':
          throw new VerificationException(VerificationStatus.FAILURE)
      }
    }

    private checkDates(cert: X509Certificate, effectiveDate: Date) {
      if (new Date(cert.validFrom).getTime() > (effectiveDate.getTime() + MAX_SKEW)||
          new Date(cert.validTo).getTime() < (effectiveDate.getTime() - MAX_SKEW)) {
        throw new VerificationException(VerificationStatus.INVALID_CERTIFICATE)
      }
    }


    private extractSignedDate(decodedJWT: DecodedSignedData): Date {
      return decodedJWT.signedDate === undefined ? new Date() : new Date(decodedJWT.signedDate)
    }
}

export enum VerificationStatus {
  OK,
  VERIFICATION_FAILURE,
  RETRYABLE_VERIFICATION_FAILURE,
  INVALID_APP_IDENTIFIER,
  INVALID_ENVIRONMENT,
  INVALID_CHAIN_LENGTH,
  INVALID_CERTIFICATE,
  FAILURE
}

export class VerificationException extends Error {
  status: VerificationStatus
  cause?: Error

  constructor(status: VerificationStatus, cause?: Error) {
    super();
    this.status = status
    this.cause = cause
  }
}
