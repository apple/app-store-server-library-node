// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { KeyObject, X509Certificate, createHash, timingSafeEqual, verify } from 'crypto';
import { AppReceipt } from './models/AppReceipt';
import { Environment } from './models/Environment';
import { InAppPurchaseReceipt } from './models/InAppPurchaseReceipt';
import { SignedDataVerifier, VerificationException, VerificationStatus } from './jws_verification';

const RECEIPT_TYPE_TYPE_ID = 0;
const BUNDLE_ID_TYPE_ID = 2;
const APPLICATION_VERSION_TYPE_ID = 3;
const OPAQUE_VALUE_TYPE_ID = 4;
const SHA1_HASH_TYPE_ID = 5;
const RECEIPT_CREATION_DATE_TYPE_ID = 12;
const IN_APP_TYPE_ID = 17;
const ORIGINAL_PURCHASE_DATE_TYPE_ID = 18;
const ORIGINAL_APPLICATION_VERSION_TYPE_ID = 19;
const EXPIRATION_DATE_TYPE_ID = 21;

const QUANTITY_TYPE_ID = 1701;
const PRODUCT_IDENTIFIER_TYPE_ID = 1702;
const TRANSACTION_IDENTIFIER_TYPE_ID = 1703;
const PURCHASE_DATE_TYPE_ID = 1704;
const ORIGINAL_TRANSACTION_IDENTIFIER_TYPE_ID = 1705;
const IN_APP_ORIGINAL_PURCHASE_DATE_TYPE_ID = 1706;
const EXPIRES_DATE_TYPE_ID = 1708;
const WEB_ORDER_LINE_ITEM_IDENTIFIER_TYPE_ID = 1711;
const CANCELLATION_DATE_TYPE_ID = 1712;
const IS_IN_INTRO_OFFER_PERIOD_TYPE_ID = 1719;

const SIGNED_DATA_OID = '1.2.840.113549.1.7.2';
const MESSAGE_DIGEST_OID = '1.2.840.113549.1.9.4';
const SHA1_OID = '1.3.14.3.2.26';
const SHA256_OID = '2.16.840.1.101.3.4.2.1';

// Only the digests Apple signs receipts with; anything else is rejected
const DIGEST_ALGORITHMS: { [index: string]: string } = {
    [SHA1_OID]: 'sha1',
    [SHA256_OID]: 'sha256'
}

// Leaf, intermediate and root, the same chain length the JWS x5c header claim carries
const EXPECTED_CHAIN_LENGTH = 3;

// Bounds on what is decoded before the receipt has been verified, so that a hostile receipt cannot make
// parsing expensive: an integer wide enough to hold any receipt value, and the certificates a chain can hold
const MAXIMUM_INTEGER_BYTES = 8;
const MAXIMUM_EMBEDDED_CERTIFICATES = 10;

const BASE64_REGEX = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
// RFC 3339, the format receipt date attributes carry
const RFC_3339_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/

/**
 * Exposes the certificate chain verification of {@link SignedDataVerifier} to the app receipt verifier: the
 * same caller-supplied Apple roots, the same Apple marker OID checks, the same OCSP path and public key cache.
 * An app receipt is not JWS and carries no appAppleId, so the environment and bundle identifier of this
 * instance are never consulted - only its root certificates and its online check flag are.
 */
class AppReceiptChainVerifier extends SignedDataVerifier {
    constructor(appleRootCertificates: Buffer[], enableOnlineChecks: boolean) {
        super(appleRootCertificates, enableOnlineChecks, Environment.SANDBOX, "")
    }

    async verifyReceiptCertificateChain(leaf: X509Certificate, intermediate: X509Certificate, effectiveDate: Date): Promise<KeyObject> {
        return await this.verifyCertificateChain(this.rootCertificates, leaf, intermediate, effectiveDate)
    }
}

/**
 * A class providing utility methods for verifying and decoding legacy PKCS#7 App Store receipts, the app
 * receipt used with the deprecated verifyReceipt endpoint.
 *
 * This is the validating counterpart to {@link ReceiptUtility}, which extracts without validation. The
 * receipt's certificate chain is validated with the same code path used for JWS signed data, against the same
 * caller-supplied Apple root certificates, and evaluated at the receipt's creation date so old receipts
 * survive certificate rotations unless online checks are enabled.
 *
 * Example Usage:
 * ```ts
 * const verifier = new AppReceiptVerifier([appleRoot, appleRoot2], true, Environment.SANDBOX, "com.example")
 *
 * try {
 *     const receipt = await verifier.verifyAndDecodeAppReceipt("MI...")
 *     console.log(receipt)
 * } catch (e) {
 *     console.error(e)
 * }
 * ```
 */
export class AppReceiptVerifier {

    protected chainVerifier: AppReceiptChainVerifier
    protected enableOnlineChecks: boolean
    protected environment: Environment
    protected bundleId: string

    /**
     *
     * @param appleRootCertificates A list of DER-encoded root certificates
     * @param enableOnlineChecks Whether to enable revocation checking and check expiration using the current date
     * @param environment The App Store environment to target for checks
     * @param bundleId The app's bundle identifier
     */
    constructor(appleRootCertificates: Buffer[], enableOnlineChecks: boolean, environment: Environment, bundleId: string) {
        this.chainVerifier = new AppReceiptChainVerifier(appleRootCertificates, enableOnlineChecks)
        this.enableOnlineChecks = enableOnlineChecks
        this.environment = environment
        this.bundleId = bundleId
    }

    /**
     * Verifies and decodes an app receipt, as obtained from a device
     * See {@link https://developer.apple.com/documentation/appstorereceipts App Store Receipts}
     *
     * @param encodedReceipt The base64-encoded app receipt
     * @return The decoded receipt after verification
     * @throws VerificationException Thrown if the receipt could not be verified
     */
    async verifyAndDecodeAppReceipt(encodedReceipt: string): Promise<AppReceipt> {
        try {
            const signedData = parseSignedData(decodeBase64Receipt(encodedReceipt))
            // Parsed before signature verification only to learn the creation date, which the chain validity is
            // anchored at; nothing from it is trusted until the chain and signature checks pass
            const receipt = parseReceiptPayload(signedData.content)
            if (this.environment !== Environment.XCODE && this.environment !== Environment.LOCAL_TESTING) {
                const effectiveDate = this.enableOnlineChecks || receipt.receiptCreationDate === undefined ? new Date() : new Date(receipt.receiptCreationDate)
                const signerPublicKey = await this.verifyChain(signedData, effectiveDate)
                verifySignature(signedData, signerPublicKey)
            }
            // In the Xcode and LocalTesting environments the data is not signed by the App Store and signature
            // verification is skipped, but the bundle id and environment are still validated
            this.validateBundleId(receipt.bundleId)
            this.validateEnvironment(environmentForReceiptType(receipt.receiptType))
            return receipt
        } catch (error) {
            if (error instanceof VerificationException) {
                throw error
            } else if (error instanceof Error) {
                throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, error)
            }
            throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE)
        }
    }

    /**
     * Verifies an app receipt and extracts a transaction id from its in-app purchases, the validated
     * counterpart of {@link ReceiptUtility.extractTransactionIdFromAppReceipt} with the same output contract:
     * a transaction id from the array of in-app purchases, or null if the receipt contains none.
     *
     * @param encodedReceipt The base64-encoded app receipt
     * @return A transaction id from the receipt's in-app purchases, null if the receipt contains no in-app purchases
     * @throws VerificationException Thrown if the receipt could not be verified
     */
    async verifyAndExtractTransactionId(encodedReceipt: string): Promise<string | null> {
        const receipt = await this.verifyAndDecodeAppReceipt(encodedReceipt)
        for (const purchase of receipt.inAppPurchases) {
            if (purchase.transactionId !== undefined) {
                return purchase.transactionId
            }
            if (purchase.originalTransactionId !== undefined) {
                return purchase.originalTransactionId
            }
        }
        return null
    }

    /**
     * Orders the receipt's embedded certificates as leaf, intermediate, root and hands the leaf and the
     * intermediate to the shared chain verification, which enforces the WWDR intermediate OID and the
     * receipt signing leaf OID and validates to the caller-supplied Apple roots.
     */
    protected async verifyChain(signedData: SignedDataContent, effectiveDate: Date): Promise<KeyObject> {
        // The embedded certificates are attacker-supplied and are ordered into a chain below, before anything
        // about the receipt has been verified, so a receipt carrying more of them than a chain can hold is
        // rejected here rather than assembled.
        if (signedData.certificates.length > MAXIMUM_EMBEDDED_CERTIFICATES) {
            throw new VerificationException(VerificationStatus.INVALID_CHAIN_LENGTH)
        }
        const embedded = signedData.certificates.map(certificate => new X509Certificate(certificate))
        const leaf = embedded.find(certificate => matchesSignerIdentifier(certificate, signedData.signerInfo))
        if (leaf === undefined) {
            throw new VerificationException(VerificationStatus.INVALID_CERTIFICATE, new Error("Signer certificate is not embedded in the receipt"))
        }
        const ordered = [leaf]
        while (ordered.length < embedded.length) {
            const issuer = embedded.find(candidate => !ordered.includes(candidate) && candidate.subject === ordered[ordered.length - 1].issuer)
            if (issuer === undefined) {
                break
            }
            ordered.push(issuer)
        }
        if (ordered.length !== EXPECTED_CHAIN_LENGTH) {
            throw new VerificationException(VerificationStatus.INVALID_CHAIN_LENGTH)
        }
        return await this.chainVerifier.verifyReceiptCertificateChain(ordered[0], ordered[1], effectiveDate)
    }

    protected validateBundleId(bundleId?: string) {
        if (this.bundleId !== bundleId) {
            throw new VerificationException(VerificationStatus.INVALID_APP_IDENTIFIER)
        }
    }

    protected validateEnvironment(environment?: Environment) {
        if (this.environment !== environment) {
            throw new VerificationException(VerificationStatus.INVALID_ENVIRONMENT)
        }
    }
}

/**
 * Maps the receipt type attribute to a server environment. Only explicit production values map to
 * {@link Environment.PRODUCTION}; unknown or missing values map to undefined and fail environment validation.
 */
function environmentForReceiptType(receiptType?: string): Environment | undefined {
    switch (receiptType) {
        case "Production":
        case "ProductionVPP":
            return Environment.PRODUCTION
        case "ProductionSandbox":
        case "ProductionVPPSandbox":
            return Environment.SANDBOX
        case "Xcode":
            return Environment.XCODE
        case "LocalTesting":
            return Environment.LOCAL_TESTING
        default:
            return undefined
    }
}

function decodeBase64Receipt(encodedReceipt: string): Buffer {
    // Line breaks are tolerated, as base64 receipts commonly pick them up in transit
    const stripped = encodedReceipt.replace(/\s/g, '')
    if (stripped.length === 0 || !BASE64_REGEX.test(stripped)) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Receipt is not valid base64"))
    }
    return Buffer.from(stripped, 'base64')
}

// The parts of a CMS SignedData an app receipt is verified from
interface SignedDataContent {
    content: Buffer
    certificates: Buffer[]
    signerInfo: SignerInfo
}

interface SignerInfo {
    issuer: Buffer
    serialNumber: Buffer
    digestAlgorithmOid: string
    signedAttributes?: Asn1Node
    signature: Buffer
}

function parseSignedData(receiptDer: Buffer): SignedDataContent {
    let contentInfo: Asn1Node
    try {
        // Parsing must exhaust the input, rejecting trailing bytes after the CMS blob
        contentInfo = parseAsn1(receiptDer)
    } catch (error) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Receipt is not a PKCS#7 container"))
    }
    const outer = childrenOf(contentInfo)
    if (contentInfo.tag !== SEQUENCE_TAG || outer.length < 2 || outer[0].tag !== OID_TAG ||
        decodeOid(outer[0]) !== SIGNED_DATA_OID || outer[1].tag !== CONTEXT_0_TAG) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Receipt is not a PKCS#7 container"))
    }
    const signedDataNode = childrenOf(outer[1])[0]
    const signedData = signedDataNode === undefined ? [] : childrenOf(signedDataNode)
    if (signedData.length < 4) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Receipt is not a PKCS#7 container"))
    }
    const encapsulatedContentInfo = childrenOf(signedData[2])
    if (encapsulatedContentInfo.length < 2 || encapsulatedContentInfo[1].tag !== CONTEXT_0_TAG) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Receipt has no encapsulated payload"))
    }
    const contentNode = childrenOf(encapsulatedContentInfo[1])[0]
    if (contentNode === undefined || !isOctetString(contentNode)) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Receipt has no encapsulated payload"))
    }
    let certificates: Buffer[] = []
    for (const child of signedData.slice(3, signedData.length - 1)) {
        if (child.tag === CONTEXT_0_TAG) {
            certificates = childrenOf(child).map(certificate => certificate.raw)
        }
    }
    const signerInfos = signedData[signedData.length - 1]
    if (signerInfos.tag !== SET_TAG || childrenOf(signerInfos).length === 0) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Receipt has no signer info"))
    }
    return {
        content: octetStringValue(contentNode),
        certificates: certificates,
        signerInfo: parseSignerInfo(childrenOf(signerInfos)[0])
    }
}

function parseSignerInfo(node: Asn1Node): SignerInfo {
    const fields = childrenOf(node)
    if (fields.length < 5) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Malformed receipt signer info"))
    }
    const signerIdentifier = childrenOf(fields[1])
    if (fields[1].tag !== SEQUENCE_TAG || signerIdentifier.length < 2) {
        // Apple identifies the receipt signer by issuer and serial number, never by subject key identifier
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Receipt signer is not identified by issuer and serial number"))
    }
    let index = 3
    let signedAttributes: Asn1Node | undefined
    if (fields[index].tag === CONTEXT_0_TAG) {
        signedAttributes = fields[index]
        index += 1
    }
    // The signature algorithm field is skipped: the key type is checked against the certificate and the
    // digest algorithm drives the hash
    index += 1
    const digestAlgorithm = childrenOf(fields[2])[0]
    if (fields.length <= index || digestAlgorithm === undefined) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Malformed receipt signer info"))
    }
    return {
        issuer: signerIdentifier[0].raw,
        serialNumber: signerIdentifier[1].contents,
        digestAlgorithmOid: decodeOid(digestAlgorithm),
        signedAttributes: signedAttributes,
        signature: fields[index].contents
    }
}

/**
 * Whether the certificate is the one the signer info names, comparing the issuer name and the serial number
 * of TBSCertificate ::= SEQUENCE { version [0] EXPLICIT, serialNumber, signature, issuer, ... }.
 */
function matchesSignerIdentifier(certificate: X509Certificate, signerInfo: SignerInfo): boolean {
    const tbsCertificate = childrenOf(parseAsn1(certificate.raw))[0]
    const fields = tbsCertificate === undefined ? [] : childrenOf(tbsCertificate)
    // The version is an optional explicit [0] before the serial number
    const offset = fields.length > 0 && fields[0].tag === CONTEXT_0_TAG ? 1 : 0
    if (fields.length < offset + 3) {
        return false
    }
    return fields[offset].contents.equals(signerInfo.serialNumber) && fields[offset + 2].raw.equals(signerInfo.issuer)
}

function verifySignature(signedData: SignedDataContent, signerPublicKey: KeyObject) {
    if (signerPublicKey.asymmetricKeyType !== 'rsa') {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Receipt signer key is not RSA"))
    }
    const digestAlgorithm = DIGEST_ALGORITHMS[signedData.signerInfo.digestAlgorithmOid]
    if (digestAlgorithm === undefined) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Unrecognized receipt digest algorithm " + signedData.signerInfo.digestAlgorithmOid))
    }
    let signedBytes: Buffer
    const signedAttributes = signedData.signerInfo.signedAttributes
    if (signedAttributes !== undefined) {
        const contentDigest = createHash(digestAlgorithm).update(signedData.content).digest()
        const messageDigest = findMessageDigestAttribute(signedAttributes)
        if (messageDigest === undefined || messageDigest.length !== contentDigest.length || !timingSafeEqual(messageDigest, contentDigest)) {
            throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Receipt messageDigest attribute does not match the payload"))
        }
        // The signature covers the signed attributes re-encoded as an explicit SET, RFC 5652 section 5.4:
        // swap the implicit [0] tag for a SET tag
        signedBytes = Buffer.concat([Buffer.from([SET_TAG]), signedAttributes.raw.subarray(1)])
    } else {
        signedBytes = signedData.content
    }
    if (!verify(digestAlgorithm, signedBytes, signerPublicKey, signedData.signerInfo.signature)) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Receipt signature does not verify"))
    }
}

function findMessageDigestAttribute(signedAttributes: Asn1Node): Buffer | undefined {
    for (const attribute of childrenOf(signedAttributes)) {
        const fields = childrenOf(attribute)
        if (fields.length >= 2 && fields[0].tag === OID_TAG && decodeOid(fields[0]) === MESSAGE_DIGEST_OID) {
            const values = childrenOf(fields[1])
            if (values.length === 1) {
                return values[0].contents
            }
        }
    }
    return undefined
}

/** ReceiptAttribute ::= SEQUENCE { type INTEGER, version INTEGER, value OCTET STRING } */
interface ReceiptAttribute {
    type: number
    value: Buffer
}

function parseReceiptPayload(payload: Buffer): AppReceipt {
    const receipt: AppReceipt = {
        inAppPurchases: [],
        unknownAttributes: new Map()
    }
    for (const attribute of parseAttributeSet(payload, "Receipt payload")) {
        switch (attribute.type) {
            case RECEIPT_TYPE_TYPE_ID:
                receipt.receiptType = decodeString(attribute.value)
                break
            case BUNDLE_ID_TYPE_ID:
                receipt.bundleId = decodeString(attribute.value)
                receipt.bundleIdBytes = attribute.value
                break
            case APPLICATION_VERSION_TYPE_ID:
                receipt.applicationVersion = decodeString(attribute.value)
                break
            case OPAQUE_VALUE_TYPE_ID:
                receipt.opaqueValue = attribute.value
                break
            case SHA1_HASH_TYPE_ID:
                receipt.sha1Hash = attribute.value
                break
            case RECEIPT_CREATION_DATE_TYPE_ID:
                receipt.receiptCreationDate = decodeDate(attribute.value)
                break
            case IN_APP_TYPE_ID:
                receipt.inAppPurchases.push(parseInAppPurchase(attribute.value))
                break
            case ORIGINAL_PURCHASE_DATE_TYPE_ID:
                receipt.originalPurchaseDate = decodeDate(attribute.value)
                break
            case ORIGINAL_APPLICATION_VERSION_TYPE_ID:
                receipt.originalApplicationVersion = decodeString(attribute.value)
                break
            case EXPIRATION_DATE_TYPE_ID:
                receipt.expirationDate = decodeDate(attribute.value)
                break
            default:
                recordUnknownAttribute(receipt.unknownAttributes, attribute)
                break
        }
    }
    return receipt
}

function parseInAppPurchase(inAppSet: Buffer): InAppPurchaseReceipt {
    const purchase: InAppPurchaseReceipt = {
        unknownAttributes: new Map()
    }
    for (const attribute of parseAttributeSet(inAppSet, "In-app purchase attribute")) {
        switch (attribute.type) {
            case QUANTITY_TYPE_ID:
                purchase.quantity = decodeInteger(attribute.value)
                break
            case PRODUCT_IDENTIFIER_TYPE_ID:
                purchase.productId = decodeString(attribute.value)
                break
            case TRANSACTION_IDENTIFIER_TYPE_ID:
                purchase.transactionId = decodeString(attribute.value)
                break
            case PURCHASE_DATE_TYPE_ID:
                purchase.purchaseDate = decodeDate(attribute.value)
                break
            case ORIGINAL_TRANSACTION_IDENTIFIER_TYPE_ID:
                purchase.originalTransactionId = decodeString(attribute.value)
                break
            case IN_APP_ORIGINAL_PURCHASE_DATE_TYPE_ID:
                purchase.originalPurchaseDate = decodeDate(attribute.value)
                break
            case EXPIRES_DATE_TYPE_ID:
                purchase.expiresDate = decodeDate(attribute.value)
                break
            case WEB_ORDER_LINE_ITEM_IDENTIFIER_TYPE_ID:
                purchase.webOrderLineItemId = decodeInteger(attribute.value)
                break
            case CANCELLATION_DATE_TYPE_ID:
                purchase.cancellationDate = decodeDate(attribute.value)
                break
            case IS_IN_INTRO_OFFER_PERIOD_TYPE_ID:
                purchase.isInIntroOfferPeriod = decodeInteger(attribute.value) !== 0
                break
            default:
                recordUnknownAttribute(purchase.unknownAttributes, attribute)
                break
        }
    }
    return purchase
}

function recordUnknownAttribute(unknownAttributes: Map<number, Buffer[]>, attribute: ReceiptAttribute) {
    const values = unknownAttributes.get(attribute.type)
    if (values === undefined) {
        unknownAttributes.set(attribute.type, [attribute.value])
    } else {
        values.push(attribute.value)
    }
}

function parseAttributeSet(der: Buffer, what: string): ReceiptAttribute[] {
    let node = parseAttributeSetNode(der, what)
    if (isOctetString(node)) {
        // Xcode receipts double-wrap the payload in an extra OCTET STRING; ReceiptUtility handles the same shape
        node = parseAttributeSetNode(octetStringValue(node), what)
    }
    if (node.tag !== SET_TAG) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error(what + " is not an ASN.1 SET"))
    }
    const attributes: ReceiptAttribute[] = []
    for (const child of childrenOf(node)) {
        const fields = childrenOf(child)
        if (child.tag !== SEQUENCE_TAG || fields.length < 3 || fields[0].tag !== INTEGER_TAG || !isOctetString(fields[2])) {
            throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Malformed receipt attribute"))
        }
        attributes.push({
            type: integerValue(fields[0]),
            value: octetStringValue(fields[2])
        })
    }
    return attributes
}

function parseAttributeSetNode(der: Buffer, what: string): Asn1Node {
    try {
        return parseAsn1(der)
    } catch (error) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error(what + " is not valid ASN.1"))
    }
}

function decodeAttributeValue(der: Buffer): Asn1Node {
    try {
        return parseAsn1(der)
    } catch (error) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Attribute value is not valid ASN.1"))
    }
}

function decodeString(der: Buffer): string {
    const node = decodeAttributeValue(der)
    if (node.tag !== UTF8_STRING_TAG && node.tag !== IA5_STRING_TAG && node.tag !== PRINTABLE_STRING_TAG) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Attribute value is not an ASN.1 string"))
    }
    return node.contents.toString('utf8')
}

function decodeInteger(der: Buffer): number {
    const node = decodeAttributeValue(der)
    if (node.tag !== INTEGER_TAG) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Attribute value is not an ASN.1 integer"))
    }
    return integerValue(node)
}

/** RFC 3339 date in an IA5String, returned in milliseconds; empty means absent, as real receipts encode it. */
function decodeDate(der: Buffer): number | undefined {
    const text = decodeString(der)
    if (text.length === 0) {
        return undefined
    }
    const parsed = new Date(text)
    if (!RFC_3339_REGEX.test(text) || isNaN(parsed.getTime())) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Unparseable receipt date: " + text))
    }
    return parsed.getTime()
}

/**
 * Non-negative and within the safe integer range; real receipts carry 7-byte integers. The width is rejected
 * before the value is accumulated rather than after, because attribute types reach this before anything about
 * the receipt has been verified.
 */
function integerValue(node: Asn1Node): number {
    if (node.contents.length === 0 || node.contents.length > MAXIMUM_INTEGER_BYTES || node.contents[0] >= 0x80) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Receipt integer out of range"))
    }
    let value = 0
    for (const byte of node.contents) {
        value = value * 256 + byte
    }
    if (value > Number.MAX_SAFE_INTEGER) {
        throw new VerificationException(VerificationStatus.VERIFICATION_FAILURE, new Error("Receipt integer out of range"))
    }
    return value
}

// A minimal DER/BER reader. jsrsasign's ASN1HEX only walks definite length encoding, while genuine Xcode
// receipts use indefinite length encoding throughout, and verification additionally needs the exact byte
// ranges of the values it hashes and of the certificates it validates.

const INTEGER_TAG = 0x02;
const OCTET_STRING_TAG = 0x04;
const OID_TAG = 0x06;
const UTF8_STRING_TAG = 0x0c;
const PRINTABLE_STRING_TAG = 0x13;
const IA5_STRING_TAG = 0x16;
const SEQUENCE_TAG = 0x30;
const SET_TAG = 0x31;
const CONTEXT_0_TAG = 0xa0;
const CONSTRUCTED_OCTET_STRING_TAG = 0x24;

const MAXIMUM_ASN1_DEPTH = 32;

interface Asn1Node {
    tag: number
    /** The complete tag-length-value slice */
    raw: Buffer
    /** The value bytes, the concatenated children of an indefinite length value */
    contents: Buffer
    children?: Asn1Node[]
}

/** Parses a single ASN.1 value, requiring it to consume the whole buffer. */
function parseAsn1(der: Buffer): Asn1Node {
    const [node, end] = readAsn1Node(der, 0, 0)
    if (end !== der.length) {
        throw new Error("Trailing bytes after the ASN.1 value")
    }
    return node
}

function readAsn1Node(der: Buffer, offset: number, depth: number): [Asn1Node, number] {
    if (depth > MAXIMUM_ASN1_DEPTH) {
        throw new Error("Maximum ASN.1 nesting depth exceeded")
    }
    if (offset + 2 > der.length) {
        throw new Error("Truncated ASN.1 value")
    }
    const tag = der[offset]
    if ((tag & 0x1f) === 0x1f) {
        throw new Error("Multi-byte ASN.1 tags are not supported")
    }
    const constructed = (tag & 0x20) !== 0
    let position = offset + 1
    const lengthByte = der[position]
    position += 1
    if (lengthByte === 0x80) {
        if (!constructed) {
            throw new Error("Indefinite length on a primitive ASN.1 value")
        }
        const children: Asn1Node[] = []
        while (true) {
            if (position + 2 > der.length) {
                throw new Error("Unterminated indefinite length ASN.1 value")
            }
            if (der[position] === 0x00 && der[position + 1] === 0x00) {
                position += 2
                break
            }
            const [child, next] = readAsn1Node(der, position, depth + 1)
            children.push(child)
            position = next
        }
        return [{
            tag: tag,
            raw: der.subarray(offset, position),
            contents: Buffer.concat(children.map(child => child.raw)),
            children: children
        }, position]
    }
    let length = lengthByte
    if (lengthByte > 0x80) {
        const lengthBytes = lengthByte & 0x7f
        if (lengthBytes > 4 || position + lengthBytes > der.length) {
            throw new Error("Unsupported ASN.1 length")
        }
        length = 0
        for (let i = 0; i < lengthBytes; i++) {
            length = length * 256 + der[position + i]
        }
        position += lengthBytes
    }
    const end = position + length
    if (end > der.length) {
        throw new Error("ASN.1 length exceeds the input")
    }
    const node: Asn1Node = {
        tag: tag,
        raw: der.subarray(offset, end),
        contents: der.subarray(position, end)
    }
    if (constructed) {
        node.children = readAsn1Children(node.contents, depth + 1)
    }
    return [node, end]
}

function readAsn1Children(contents: Buffer, depth: number): Asn1Node[] {
    const children: Asn1Node[] = []
    let position = 0
    while (position < contents.length) {
        const [child, next] = readAsn1Node(contents, position, depth)
        children.push(child)
        position = next
    }
    return children
}

function childrenOf(node: Asn1Node): Asn1Node[] {
    return node.children === undefined ? [] : node.children
}

function isOctetString(node: Asn1Node): boolean {
    return node.tag === OCTET_STRING_TAG || node.tag === CONSTRUCTED_OCTET_STRING_TAG
}

/** The value bytes of an OCTET STRING, joining the chunks of a constructed one. */
function octetStringValue(node: Asn1Node): Buffer {
    if (node.children === undefined) {
        return node.contents
    }
    return Buffer.concat(node.children.map(child => octetStringValue(child)))
}

function decodeOid(node: Asn1Node): string {
    if (node.tag !== OID_TAG || node.contents.length === 0) {
        throw new Error("Not an ASN.1 object identifier")
    }
    const components = [Math.floor(node.contents[0] / 40), node.contents[0] % 40]
    let value = 0
    for (const byte of node.contents.subarray(1)) {
        value = value * 128 + (byte & 0x7f)
        if ((byte & 0x80) === 0) {
            components.push(value)
            value = 0
        }
    }
    return components.join('.')
}
