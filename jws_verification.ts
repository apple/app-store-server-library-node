// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import jsonwebtoken = require('jsonwebtoken');

import base64url from 'base64url';
import { KeyObject, X509Certificate, createHash, verify } from 'crypto';
import { KJUR, X509, ASN1HEX } from 'jsrsasign';
import fetch, { Headers } from 'node-fetch';
import { Environment } from './models/Environment';
import { JWSTransactionDecodedPayload, JWSTransactionDecodedPayloadValidator } from './models/JWSTransactionDecodedPayload';
import { ResponseBodyV2DecodedPayload, ResponseBodyV2DecodedPayloadValidator } from './models/ResponseBodyV2DecodedPayload';
import { JWSRenewalInfoDecodedPayload, JWSRenewalInfoDecodedPayloadValidator } from './models/JWSRenewalInfoDecodedPayload';
import { DecodedRealtimeRequestBody, DecodedRealtimeRequestBodyValidator } from './models/DecodedRealtimeRequestBody';
import { Validator } from './models/Validator';
import { DecodedSignedData } from './models/DecodedSignedData';
import { AppTransaction, AppTransactionValidator } from './models/AppTransaction';

const MAX_SKEW = 60000

const MAXIMUM_CACHE_SIZE = 32 // There are unlikely to be more than a couple keys at once
const CACHE_TIME_LIMIT = 15 * 60 * 1_000 // 15 minutes

class CacheValue {
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
 *     const decodedNotification = verifier.verifyAndDecodeNotification("ey...")
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
     * @param signedTransaction The signedTransaction field
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
        if (decodedJWT.externalPurchaseToken.externalPurchaseId && decodedJWT.externalPurchaseToken.externalPurchaseId.startsWith("SANDBOX")) {
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
      let certificateChain;
      let decodedJWT
      try {
        decodedJWT = jsonwebtoken.decode(jwt)
        if (!validator.validate(decodedJWT)) {
          throw new VerificationException(VerificationStatus.FAILURE)
        }
        if (this.environment === Environment.XCODE || this.environment === Environment.LOCAL_TESTING) {
          // Data is not signed by the App Store, and verification should be skipped
          // The environment MUST be checked in the public method calling this
          return decodedJWT
        }
        try {
          const header = jwt.split('.')[0]
          const decodedHeader = base64url.decode(header)
          const headerObj = JSON.parse(decodedHeader)
          const chain: string[] = headerObj['x5c'] ?? []
          if (chain.length != 3) {
            throw new VerificationException(VerificationStatus.INVALID_CHAIN_LENGTH)
          }
          certificateChain = chain.slice(0, 2).map(cert => new X509Certificate(Buffer.from(cert, 'base64')))
        } catch (error) {
          if (error instanceof Error) {
            throw new VerificationException(VerificationStatus.INVALID_CERTIFICATE, error)
          }
          throw new VerificationException(VerificationStatus.INVALID_CERTIFICATE)
        }
        const effectiveDate = this.enableOnlineChecks ? new Date() : signedDateExtractor(decodedJWT)
        const publicKey = await this.verifyCertificateChain(this.rootCertificates, certificateChain[0], certificateChain[1], effectiveDate);
        const encodedKey = publicKey.export({
          type: "spki",
          format: "pem"
        });
        jsonwebtoken.verify(jwt, encodedKey) as T
        return decodedJWT
      } catch (error) {
        if (error instanceof VerificationException) {
          throw error
        } else if (error instanceof Error) {
          throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, error)
        }
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE)
      }
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
          for (let key in Object.keys(this.verifiedPublicKeyCache)) {
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
      const jsrsassignX509Leaf = new X509()
      jsrsassignX509Leaf.readCertHex(leaf.raw.toString('hex'))
      const jsrassignX509Intermediate = new X509()
      jsrassignX509Intermediate.readCertHex(intermediate.raw.toString('hex'))
      validity = validity && jsrsassignX509Leaf.getExtInfo("1.2.840.113635.100.6.11.1") !== undefined
      validity = validity && jsrassignX509Intermediate.getExtInfo("1.2.840.113635.100.6.2.1") !== undefined
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
      const authorityRex = /^OCSP - URI:(.*)$/m
      const matchResult = cert.infoAccess ? authorityRex.exec(cert.infoAccess) : ""
      if (matchResult === null || matchResult.length !== 2) {
        throw new VerificationException(VerificationStatus.INVALID_CERTIFICATE)
      }
      const request = new KJUR.asn1.ocsp.OCSPRequest({reqList: [{issuerCert: issuer.toString(), subjectCert: cert.toString() , alg: "sha256"}]})
      const headers = new Headers()
      headers.append('Content-Type', 'application/ocsp-request')
      
      const response = await fetch(matchResult[1], {
        headers: headers,
        method: 'POST',
        body: Buffer.from(request.getEncodedHex(), 'hex')
      })
      
      const responseBuffer = await response.buffer()
      const parsedResponse = new (KJUR.asn1.ocsp as any).OCSPParser().getOCSPResponse(responseBuffer.toString('hex'))
      // The issuer could also be the signer
      const jsrassignX509Issuer = new X509()
      jsrassignX509Issuer.readCertHex(issuer.raw.toString('hex'))
      const allCerts: X509[] = [jsrassignX509Issuer]
      for (const certHex of parsedResponse.certs) {
        const cert = new X509()
        cert.readCertHex(certHex)
        allCerts.push(cert)
      }
      let signingCert: X509Certificate | null = null
      if (parsedResponse.respid.key) {
        for (const cert of allCerts) {
          const shasum = createHash('sha1')
          shasum.update(Buffer.from(cert.getSPKIValue(), 'hex'))
          const spkiHash = shasum.digest('hex')
          if (spkiHash === parsedResponse.respid.key) {
            signingCert = new X509Certificate(Buffer.from(cert.hex, 'hex'))
          }
        }
      } else if (parsedResponse.respid.name) {
        for (const cert of allCerts) {
          if (cert.getSubject().str === parsedResponse.respid.name.str) {
            signingCert = new X509Certificate(Buffer.from(cert.hex, 'hex'))
          }
        }
      }
      if (signingCert == null) {
        throw new VerificationException(VerificationStatus.FAILURE)
      }
      // Verify Signing Cert is issued by issuer
      if (signingCert.publicKey === issuer.publicKey && signingCert.subject === issuer.subject) {
        // This is directly signed by the issuer
      } else if (signingCert.verify(issuer.publicKey)) {
        // This is issued by the issuer, let's check the dates and purpose
        const signingCertAssign = new X509()
        signingCertAssign.readCertPEM(signingCert.toString())
        if (!signingCertAssign.getExtExtKeyUsage().array.includes("ocspSigning")) {
          throw new VerificationException(VerificationStatus.INVALID_CERTIFICATE)
        }
        this.checkDates(signingCert, new Date())
      } else {
        throw new VerificationException(VerificationStatus.INVALID_CERTIFICATE)
      }
    
      // Extract raw responseData
      const responseData = ASN1HEX.getTLVbyList(responseBuffer.toString('hex'), 0, [1, 0, 1, 0, 0]) as string
      // Verify Payload signed by cert
      const shortAlg = parsedResponse.alg.substring(0, 6).toUpperCase()
      if (shortAlg !== "SHA256" && shortAlg !== "SHA384" && shortAlg !== "SHA512") {
        throw new VerificationException(VerificationStatus.FAILURE)
      }

      if (!verify(shortAlg, Buffer.from(responseData, 'hex'), signingCert.publicKey, Buffer.from(parsedResponse.sighex, 'hex'))) {
        throw new VerificationException(VerificationStatus.FAILURE)
      }
      
      for (const singleResponse of parsedResponse.array) {
        // Confirm entry is for this cert
        const certIdBuilder = new KJUR.asn1.ocsp.CertID() as any
        const currentCertCertId = certIdBuilder.getParamByCerts(issuer.toString(), cert.toString(), 'sha256')
        if (!(currentCertCertId.alg === singleResponse.certid.alg && currentCertCertId.issname === singleResponse.certid.issname &&
              currentCertCertId.isskey === singleResponse.certid.isskey && currentCertCertId.sbjsn === singleResponse.certid.sbjsn)) {
          continue
        }
        // Validate contents
        const issueDate = this.parseX509Date(singleResponse.thisupdate)
        const nextDate = this.parseX509Date(singleResponse.nextupdate)
        
        if (singleResponse.status.status !== 'good' || new Date().getTime() - MAX_SKEW < issueDate.getTime() || nextDate.getTime() < new Date().getTime() + MAX_SKEW) {
          throw new VerificationException(VerificationStatus.FAILURE)
        }
        // Success
        return
      }
      throw new VerificationException(VerificationStatus.FAILURE)
    }

    private checkDates(cert: X509Certificate, effectiveDate: Date) {
      if (new Date(cert.validFrom).getTime() > (effectiveDate.getTime() + MAX_SKEW)||
          new Date(cert.validTo).getTime() < (effectiveDate.getTime() - MAX_SKEW)) {
        throw new VerificationException(VerificationStatus.INVALID_CERTIFICATE)
      }
    }

    private parseX509Date(date: string) {
      return new Date(date.replace(
        /^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/,
        '$4:$5:$6 $2/$3/$1'
      ));
    }

    private extractSignedDate(decodedJWT: DecodedSignedData): Date {
      return decodedJWT.signedDate === undefined ? new Date() : new Date(decodedJWT.signedDate)
    }
}

export enum VerificationStatus {
  OK,
  VERIFICATION_FAILURE,
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