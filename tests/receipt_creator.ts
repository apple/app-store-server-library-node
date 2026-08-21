// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { X509Certificate, generateKeyPairSync, sign } from 'crypto';
import { KJUR, X509 } from 'jsrsasign';

const WWDR_INTERMEDIATE_OID = "1.2.840.113635.100.6.2.1";
const RECEIPT_SIGNER_OID = "1.2.840.113635.100.6.11.1";
const SIGNATURE_ALGORITHM = "SHA256withRSA";
const DAY_IN_MILLIS = 86_400_000;

let serialNumber = 1

/**
 * Generates a throwaway "Apple-like" RSA PKI (root, WWDR intermediate, receipt signing leaf) and CMS-signs
 * synthetic legacy app receipts with it, so {@link AppReceiptVerifier} can be exercised without any real
 * Apple key material or a checked-in receipt.
 */
export class ReceiptCreator {

    /** Leaf first, then intermediate, then root; a self-signed creator holds one entry. */
    private chain: string[]
    private signingKey: string

    private constructor(chain: string[], signingKey: string) {
        this.chain = chain
        this.signingKey = signingKey
    }

    /**
     * A chain carrying both Apple marker OIDs, with a validity window wide enough to cover any plausible
     * receipt creation date - the chain of a receipt is evaluated at the date the receipt was created, not now.
     *
     * @param receiptSignerOid Whether the leaf carries the receipt-signing marker OID
     * @param wwdrIntermediateOid Whether the intermediate carries the WWDR marker OID
     * @param notBefore The start of the validity window of every certificate in the chain
     * @param notAfter The end of the validity window of every certificate in the chain
     */
    static createReceiptCreator(receiptSignerOid: boolean = true, wwdrIntermediateOid: boolean = true, notBefore: Date = daysAgo(3650), notAfter: Date = inOneYear()): ReceiptCreator {
        const rootKeyPair = rsaKeyPair()
        const intermediateKeyPair = rsaKeyPair()
        const leafKeyPair = rsaKeyPair()
        const root = certificate("Test App Store Root CA", rootKeyPair.publicKey, "Test App Store Root CA", rootKeyPair.privateKey, true, undefined, notBefore, notAfter)
        const intermediate = certificate("Test WWDR CA", intermediateKeyPair.publicKey, "Test App Store Root CA", rootKeyPair.privateKey, true, wwdrIntermediateOid ? WWDR_INTERMEDIATE_OID : undefined, notBefore, notAfter)
        const leaf = certificate("Test Receipt Signing", leafKeyPair.publicKey, "Test WWDR CA", intermediateKeyPair.privateKey, false, receiptSignerOid ? RECEIPT_SIGNER_OID : undefined, notBefore, notAfter)
        return new ReceiptCreator([leaf, intermediate, root], leafKeyPair.privateKey)
    }

    /**
     * A single self-signed certificate, as an Xcode-generated receipt carries; such a receipt is never chain
     * verified.
     */
    static createSelfSignedReceiptCreator(): ReceiptCreator {
        const keyPair = rsaKeyPair()
        const selfSigned = certificate("Test Xcode Receipt Signing", keyPair.publicKey, "Test Xcode Receipt Signing", keyPair.privateKey, false, RECEIPT_SIGNER_OID, daysAgo(3650), inOneYear())
        return new ReceiptCreator([selfSigned], keyPair.privateKey)
    }

    /** The root of this chain, in the form the verifier's constructor accepts. */
    getRootCertificate(): Buffer {
        return new X509Certificate(this.chain[this.chain.length - 1]).raw
    }

    /**
     * CMS-signs a payload as encapsulated content, embedding the chain.
     *
     * @param payload The receipt payload to encapsulate
     * @param embeddedCertificates How many certificates of the chain, starting at the leaf, to embed in the container
     * @param signingTime The CMS signing time attribute, which an old receipt signed by a since expired
     *                    certificate needs set to its original signing time
     */
    signReceipt(payload: Buffer, embeddedCertificates: number = this.chain.length, signingTime: Date = new Date()): Buffer {
        const signedData = new KJUR.asn1.cms.SignedData({
            econtent: {
                type: "data",
                content: { hex: payload.toString('hex') }
            },
            certs: this.chain.slice(0, embeddedCertificates),
            sinfos: [{
                id: { type: "isssn", cert: this.chain[0] },
                hashalg: "sha256",
                sattrs: {
                    array: [
                        { attr: "contentType" },
                        { attr: "signingTime", str: utcTime(signingTime) },
                        { attr: "messageDigest" }
                    ]
                },
                sigalg: SIGNATURE_ALGORITHM,
                signkey: this.signingKey
            }]
        } as any)
        return Buffer.from(signedData.getContentInfoEncodedHex(), 'hex')
    }

    /**
     * CMS-signs a payload without signed attributes, the signature over the payload directly - the shape
     * genuine App Store receipts have, which jsrsasign's CMS generator cannot produce. The container is
     * assembled by hand for that reason.
     */
    signReceiptWithoutSignedAttributes(payload: Buffer): Buffer {
        const leaf = new X509()
        leaf.readCertPEM(this.chain[0])
        const sha256Algorithm = derTlvHex(0x30, derTlvHex(0x06, "608648016503040201") + "0500")
        const rsaAlgorithm = derTlvHex(0x30, derTlvHex(0x06, "2a864886f70d010101") + "0500")
        const signerInfo = derTlvHex(0x30,
            derTlvHex(0x02, "01") +
            derTlvHex(0x30, leaf.getIssuerHex() + derTlvHex(0x02, leaf.getSerialNumberHex())) +
            sha256Algorithm +
            rsaAlgorithm +
            derTlvHex(0x04, sign('sha256', payload, this.signingKey).toString('hex')))
        const encapsulatedContentInfo = derTlvHex(0x30,
            derTlvHex(0x06, "2a864886f70d010701") +
            derTlvHex(0xa0, derTlvHex(0x04, payload.toString('hex'))))
        const certificates = this.chain.map(pem => new X509Certificate(pem).raw.toString('hex')).join('')
        const signedData = derTlvHex(0x30,
            derTlvHex(0x02, "01") +
            derTlvHex(0x31, sha256Algorithm) +
            encapsulatedContentInfo +
            derTlvHex(0xa0, certificates) +
            derTlvHex(0x31, signerInfo))
        return Buffer.from(derTlvHex(0x30, derTlvHex(0x06, "2a864886f70d010702") + derTlvHex(0xa0, signedData)), 'hex')
    }

    static attributeSet(): AttributeSet {
        return new AttributeSet()
    }

    /** The extra OCTET STRING wrapper Xcode-generated receipts put around the payload. */
    static doubleWrap(payload: Buffer): Buffer {
        return derBytes(new KJUR.asn1.DEROctetString({ hex: payload.toString('hex') }))
    }
}

/**
 * Builds a receipt attribute SET, the shape both the receipt payload and the value of an in-app purchase
 * attribute take. Each attribute is SEQUENCE { type INTEGER, version INTEGER, value OCTET STRING }.
 */
export class AttributeSet {
    private attributes: any[] = []

    /** An attribute whose value is a DER UTF8String, e.g. the bundle identifier. */
    string(type: number, value: string): AttributeSet {
        return this.raw(type, derBytes(new KJUR.asn1.DERUTF8String({ str: value })))
    }

    /** An attribute whose value is a DER IA5String holding an RFC 3339 date. */
    date(type: number, value: string): AttributeSet {
        return this.raw(type, derBytes(new KJUR.asn1.DERIA5String({ str: value })))
    }

    /** An attribute whose value is a DER INTEGER, e.g. a purchase quantity. */
    integer(type: number, value: number): AttributeSet {
        return this.raw(type, derBytes(new KJUR.asn1.DERInteger({ int: value })))
    }

    /** An attribute whose value bytes are used as-is, e.g. an opaque value or a nested SET. */
    raw(type: number, value: Buffer): AttributeSet {
        this.attributes.push(new KJUR.asn1.DERSequence({
            array: [
                new KJUR.asn1.DERInteger({ int: type }),
                new KJUR.asn1.DERInteger({ int: 1 }),
                new KJUR.asn1.DEROctetString({ hex: value.toString('hex') })
            ]
        } as any))
        return this
    }

    /**
     * The attributes are left in insertion order rather than sorted into DER canonical order, so that a test
     * can assert on the order of the in-app purchases it put in.
     */
    build(): Buffer {
        return derBytes(new KJUR.asn1.DERSet({ array: this.attributes, sortflag: false } as any))
    }
}

// The bundled type declarations leave the DER string and structured classes off ASN1Object, so the encoder
// entry point they all share is reached untyped
function derBytes(object: any): Buffer {
    return Buffer.from(object.getEncodedHex(), 'hex')
}

/** A DER TLV from a tag byte and the hex of its content. */
function derTlvHex(tag: number, contentHex: string): string {
    const length = contentHex.length / 2
    let lengthHex: string
    if (length < 0x80) {
        lengthHex = length.toString(16).padStart(2, '0')
    } else {
        let hex = length.toString(16)
        if (hex.length % 2 === 1) {
            hex = '0' + hex
        }
        lengthHex = (0x80 + hex.length / 2).toString(16) + hex
    }
    return tag.toString(16).padStart(2, '0') + lengthHex + contentHex
}

function rsaKeyPair(): { publicKey: string, privateKey: string } {
    return generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    })
}

function certificate(subject: string, subjectPublicKey: string, issuer: string, issuerPrivateKey: string, certificateAuthority: boolean, markerOid: string | undefined, notBefore: Date, notAfter: Date): string {
    const extensions: any[] = [{ extname: "basicConstraints", cA: certificateAuthority, critical: true }]
    if (markerOid !== undefined) {
        // The Apple marker extensions are non-critical and carry no value
        extensions.push({ extname: markerOid, critical: false, extn: { null: '' } })
    }
    const tbsCertificate = new KJUR.asn1.x509.TBSCertificate({
        version: 3,
        serial: { int: serialNumber++ },
        issuer: { str: "/CN=" + issuer },
        subject: { str: "/CN=" + subject },
        notbefore: utcTime(notBefore),
        notafter: utcTime(notAfter),
        sbjpubkey: subjectPublicKey,
        ext: extensions,
        sigalg: SIGNATURE_ALGORITHM
    } as any)
    // Signed with the platform RSA implementation rather than the pure JavaScript one, which is an order of
    // magnitude slower under the test runner
    const signature = sign('sha256', derBytes(tbsCertificate), issuerPrivateKey)
    return new KJUR.asn1.x509.Certificate({
        tbsobj: tbsCertificate,
        sigalg: SIGNATURE_ALGORITHM,
        sighex: signature.toString('hex')
    } as any).getPEM()
}

/** A UTCTime, YYMMDDHHMMSSZ, the encoding X.509 uses for dates before 2050. */
function utcTime(date: Date): string {
    return date.toISOString().replace(/^\d\d(\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d).*$/, '$1$2$3$4$5$6') + 'Z'
}

export function daysAgo(days: number): Date {
    return new Date(new Date().getTime() - days * DAY_IN_MILLIS)
}

export function inOneYear(): Date {
    return new Date(new Date().getTime() + 365 * DAY_IN_MILLIS)
}
