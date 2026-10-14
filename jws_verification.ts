// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import jsonwebtoken = require('jsonwebtoken');

import base64url from 'base64url';
import { KeyObject, X509Certificate, createHash, verify } from 'crypto';
import * as nodeFetch from 'node-fetch';
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
    private ocspResponseExpiry = new WeakMap<X509Certificate, number>()

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
      let cacheKey = leaf.toString() + intermediate.toString() + trustedRoots.map(root => root.toString()).join('')
      if (this.enableOnlineChecks) {
        if (cacheKey in this.verifiedPublicKeyCache) {
          if (this.verifiedPublicKeyCache[cacheKey].cacheExpiry > new Date().getTime()) {
            return this.verifiedPublicKeyCache[cacheKey].publicKey
          }
        }
      }

      let publicKey = await this.verifyCertificateChainWithoutCaching(trustedRoots, leaf, intermediate, effectiveDate)

      if (this.enableOnlineChecks) {
        const now = Date.now()
        const cacheExpiry = Math.min(now + CACHE_TIME_LIMIT,
          this.ocspResponseExpiry.get(leaf) ?? Infinity, this.ocspResponseExpiry.get(intermediate) ?? Infinity,
          ...[leaf, intermediate, ...trustedRoots].map(cert => new Date(cert.validTo).getTime() + MAX_SKEW))
        this.verifiedPublicKeyCache[cacheKey] = new CacheValue(publicKey, cacheExpiry)
        if (Object.keys(this.verifiedPublicKeyCache).length > MAXIMUM_CACHE_SIZE) {
          for (const key of Object.keys(this.verifiedPublicKeyCache)) {
            if (this.verifiedPublicKeyCache[key].cacheExpiry <= now) {
              delete this.verifiedPublicKeyCache[key]
            }
          }
        }
        // Bound the cache even when all entries are still current.
        const keys = Object.keys(this.verifiedPublicKeyCache)
        if (keys.length > MAXIMUM_CACHE_SIZE) {
          keys.sort((a, b) => this.verifiedPublicKeyCache[a].cacheExpiry - this.verifiedPublicKeyCache[b].cacheExpiry)
          for (const key of keys.slice(0, keys.length - MAXIMUM_CACHE_SIZE)) {
            delete this.verifiedPublicKeyCache[key]
          }
        }
      }
      return publicKey
    }

    protected async verifyCertificateChainWithoutCaching(trustedRoots: X509Certificate[], leaf: X509Certificate, intermediate: X509Certificate, effectiveDate: Date): Promise<KeyObject> {
      // Load ASN.1 schemas only when certificate verification is needed.
      const { parseASN1, certificateExtensions } = await import('./asn1_utils')
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
      const leafExtension = certificateExtensions(leaf.raw).get("1.2.840.113635.100.6.11.1")
      const intermediateExtension = certificateExtensions(intermediate.raw).get("1.2.840.113635.100.6.2.1")
      validity = validity && leafExtension !== undefined && intermediateExtension !== undefined
      if (leafExtension !== undefined) {
        parseASN1(leafExtension)
      }
      if (intermediateExtension !== undefined) {
        parseASN1(intermediateExtension)
      }
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
      const { AsnParser, AsnSerializer, OctetString } = await import('@peculiar/asn1-schema')
      const { AlgorithmIdentifier, ExtendedKeyUsage, KeyUsage, KeyUsageFlags, id_ce_extKeyUsage, id_ce_keyUsage, id_kp_OCSPSigning } = await import('@peculiar/asn1-x509')
      const { BasicOCSPResponse, CertID, OCSPRequest, OCSPResponse, OCSPResponseStatus, Request, TBSRequest, id_pkix_ocsp_basic } = await import('@peculiar/asn1-ocsp')
      const { asn1Children, parseASN1, parseCertificate } = await import('./asn1_utils')
      const { BitString } = await import('asn1js')
      const authorityRex = /^OCSP - URI:(.*)$/m
      const matchResult = cert.infoAccess ? authorityRex.exec(cert.infoAccess) : ""
      if (matchResult === null || matchResult.length !== 2) {
        throw new VerificationException(VerificationStatus.INVALID_CERTIFICATE)
      }
      const issuerCertificate = parseCertificate(issuer.raw)
      const certId = new CertID({
        hashAlgorithm: new AlgorithmIdentifier({ algorithm: "2.16.840.1.101.3.4.2.1", parameters: null }),
        issuerNameHash: new OctetString(createHash('sha256').update(Buffer.from(AsnSerializer.serialize(issuerCertificate.tbsCertificate.subject))).digest()),
        issuerKeyHash: new OctetString(createHash('sha256').update(Buffer.from(issuerCertificate.tbsCertificate.subjectPublicKeyInfo.subjectPublicKey)).digest()),
        serialNumber: parseCertificate(cert.raw).tbsCertificate.serialNumber
      })
      const request = new OCSPRequest({ tbsRequest: new TBSRequest({ requestList: [new Request({ reqCert: certId })] }) })
      const headers = new nodeFetch.Headers()
      headers.append('Content-Type', 'application/ocsp-request')

      let response
      try {
        response = await (nodeFetch.default ?? nodeFetch)(matchResult[1], {
          headers: headers,
          method: 'POST',
          body: Buffer.from(AsnSerializer.serialize(request)),
          timeout: 30000
        })

        if (!response.ok) {
          throw new VerificationException(VerificationStatus.RETRYABLE_VERIFICATION_FAILURE)
        }
      } catch (error) {
        if (error instanceof VerificationException) {
          throw error
        }
        // Network errors
        throw new VerificationException(VerificationStatus.RETRYABLE_VERIFICATION_FAILURE, error instanceof Error ? error : undefined)
      }

      let responseBuffer
      try {
        responseBuffer = Buffer.from(await response.arrayBuffer())
      } catch (error) {
        throw new VerificationException(VerificationStatus.RETRYABLE_VERIFICATION_FAILURE, error instanceof Error ? error : undefined)
      }
      try {
        const parsedResponse = AsnParser.fromASN(parseASN1(responseBuffer), OCSPResponse)
        if (parsedResponse.responseStatus !== OCSPResponseStatus.successful || parsedResponse.responseBytes?.responseType !== id_pkix_ocsp_basic) {
          throw new VerificationException(VerificationStatus.FAILURE)
        }
        const basicASN1 = parseASN1(new Uint8Array(parsedResponse.responseBytes.response.buffer))
        // Keep the exact signed bytes. Re-encoding ResponseData can change the signature input.
        const responseData = Buffer.from(asn1Children(basicASN1)[0].valueBeforeDecodeView)
        const signatureBits = asn1Children(basicASN1)[2]
        if (!(signatureBits instanceof BitString) || signatureBits.valueBlock.unusedBits !== 0) {
          throw new VerificationException(VerificationStatus.FAILURE)
        }
        const basicResponse = AsnParser.fromASN(basicASN1, BasicOCSPResponse)
        const data = basicResponse.tbsResponseData
        if (data.version !== 0 || data.responseExtensions?.some(ext => ext.critical)) {
          throw new VerificationException(VerificationStatus.FAILURE)
        }
        // The issuer may sign directly, without including any certificates.
        const embeddedCerts = asn1Children(basicASN1)[3]
        const allCerts = [issuer, ...(embeddedCerts === undefined ? [] : asn1Children(asn1Children(embeddedCerts)[0]).map(c => new X509Certificate(Buffer.from(c.valueBeforeDecodeView))))]
        const responder = data.responderID
        let signingCert: X509Certificate | undefined
        let signingCertificate = issuerCertificate
        for (const candidate of allCerts) {
          const parsed = candidate === issuer ? issuerCertificate : parseCertificate(candidate.raw)
          if (responder.byKey !== undefined) {
            const keyHash = createHash('sha1').update(Buffer.from(parsed.tbsCertificate.subjectPublicKeyInfo.subjectPublicKey)).digest()
            if (keyHash.equals(Buffer.from(responder.byKey.buffer))) {
              signingCert = candidate
              signingCertificate = parsed
              break
            }
          } else if (responder.byName !== undefined &&
              Buffer.from(AsnSerializer.serialize(parsed.tbsCertificate.subject)).equals(Buffer.from(AsnSerializer.serialize(responder.byName)))) {
            signingCert = candidate
            signingCertificate = parsed
            break
          }
        }
        if (signingCert === undefined) {
          throw new VerificationException(VerificationStatus.FAILURE)
        }
        if (!signingCert.raw.equals(issuer.raw)) {
          // A delegated responder must be issued directly by this issuer and have OCSP signing EKU.
          const extensions = signingCertificate.tbsCertificate.extensions
          const eku = extensions?.find(ext => ext.extnID === id_ce_extKeyUsage)
          const keyUsage = extensions?.find(ext => ext.extnID === id_ce_keyUsage)
          if (!signingCert.verify(issuer.publicKey) || signingCert.issuer !== issuer.subject || eku === undefined ||
              !AsnParser.fromASN(parseASN1(new Uint8Array(eku.extnValue.buffer)), ExtendedKeyUsage).includes(id_kp_OCSPSigning) ||
              (keyUsage !== undefined && !(AsnParser.fromASN(parseASN1(new Uint8Array(keyUsage.extnValue.buffer)), KeyUsage).toNumber() & KeyUsageFlags.digitalSignature))) {
            throw new VerificationException(VerificationStatus.INVALID_CERTIFICATE)
          }
          this.checkDates(signingCert, new Date())
        }

        const algorithms: { [oid: string]: { hash: string, keyType: string } } = {
          "1.2.840.10045.4.3.2": { hash: "sha256", keyType: "ec" },
          "1.2.840.10045.4.3.3": { hash: "sha384", keyType: "ec" },
          "1.2.840.10045.4.3.4": { hash: "sha512", keyType: "ec" },
          "1.2.840.113549.1.1.11": { hash: "sha256", keyType: "rsa" },
          "1.2.840.113549.1.1.12": { hash: "sha384", keyType: "rsa" },
          "1.2.840.113549.1.1.13": { hash: "sha512", keyType: "rsa" }
        }
        const algorithm = algorithms[basicResponse.signatureAlgorithm.algorithm]
        const parameters = basicResponse.signatureAlgorithm.parameters
        if (algorithm === undefined || signingCert.publicKey.asymmetricKeyType !== algorithm.keyType ||
            (parameters !== undefined && (algorithm.keyType === "ec" || (parameters !== null && !Buffer.from(parameters).equals(Buffer.from([5, 0]))))) ||
            !verify(algorithm.hash, responseData, signingCert.publicKey, Buffer.from(basicResponse.signature))) {
          throw new VerificationException(VerificationStatus.FAILURE)
        }

        for (const singleResponse of data.responses) {
          const responseCertId = singleResponse.certID
          if (responseCertId.hashAlgorithm.algorithm !== certId.hashAlgorithm.algorithm ||
              !Buffer.from(responseCertId.issuerNameHash.buffer).equals(Buffer.from(certId.issuerNameHash.buffer)) ||
              !Buffer.from(responseCertId.issuerKeyHash.buffer).equals(Buffer.from(certId.issuerKeyHash.buffer)) ||
              !Buffer.from(responseCertId.serialNumber).equals(Buffer.from(certId.serialNumber))) {
            continue
          }
          const now = Date.now()
          const issueDate = singleResponse.thisUpdate.getTime()
          const nextDate = singleResponse.nextUpdate?.getTime()
          if (singleResponse.certStatus.good !== null || !Number.isFinite(issueDate) || nextDate === undefined || !Number.isFinite(nextDate) ||
              now + MAX_SKEW < issueDate || nextDate < now - MAX_SKEW || nextDate < issueDate ||
              data.producedAt.getTime() > now + MAX_SKEW || singleResponse.singleExtensions?.some(ext => ext.critical)) {
            throw new VerificationException(VerificationStatus.FAILURE)
          }
          this.ocspResponseExpiry.set(cert, Math.min(nextDate + MAX_SKEW, new Date(signingCert.validTo).getTime() + MAX_SKEW))
          return
        }
        throw new VerificationException(VerificationStatus.FAILURE)
      } catch (error) {
        if (error instanceof VerificationException) {
          throw error
        }
        throw new VerificationException(VerificationStatus.FAILURE, error instanceof Error ? error : undefined)
      }
    }

    private checkDates(cert: X509Certificate, effectiveDate: Date) {
      if (!Number.isFinite(effectiveDate.getTime()) || new Date(cert.validFrom).getTime() > (effectiveDate.getTime() + MAX_SKEW)||
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