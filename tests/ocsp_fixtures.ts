// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { AsnParser, AsnSerializer, OctetString } from '@peculiar/asn1-schema';
import { AccessDescription, AlgorithmIdentifier, AttributeTypeAndValue, AttributeValue, AuthorityInfoAccessSyntax, BasicConstraints, Certificate, ExtendedKeyUsage, Extension, Extensions, GeneralName, KeyUsage, KeyUsageFlags, Name, RelativeDistinguishedName, SubjectPublicKeyInfo, TBSCertificate, Validity } from '@peculiar/asn1-x509';
import { BasicOCSPResponse, CertID, CertStatus, KeyHash, OCSPResponse, OCSPResponseStatus, ResponderID, ResponseBytes, ResponseData, SingleResponse, id_pkix_ocsp_basic } from '@peculiar/asn1-ocsp';
import { KeyObject, X509Certificate, createHash, generateKeyPairSync, sign } from 'crypto';

export const OCSP_TEST_DATE = new Date('2026-10-14T12:00:00Z')
export const OCSP_URL = 'http://ocsp.example.test'
const signatureAlgorithm = new AlgorithmIdentifier({ algorithm: '1.2.840.10045.4.3.2' })

export interface TestCertificate {
    certificate: X509Certificate
    asn: Certificate
    privateKey: KeyObject
}

export function createTestCertificate(name: string, serial: number, issuer?: TestCertificate, extensions: Extension[] = []): TestCertificate {
    const keys = generateKeyPairSync('ec', { namedCurve: 'prime256v1' })
    const subject = new Name([new RelativeDistinguishedName([new AttributeTypeAndValue({ type: '2.5.4.3', value: new AttributeValue({ utf8String: name }) })])])
    const tbsCertificate = new TBSCertificate({
        version: 2,
        serialNumber: new Uint8Array([serial]).buffer,
        signature: signatureAlgorithm,
        issuer: issuer?.asn.tbsCertificate.subject ?? subject,
        subject,
        validity: new Validity({ notBefore: new Date('2023-01-01T00:00:00Z'), notAfter: new Date('2033-01-01T00:00:00Z') }),
        subjectPublicKeyInfo: AsnParser.parse(keys.publicKey.export({ type: 'spki', format: 'der' }), SubjectPublicKeyInfo),
        extensions: new Extensions(extensions)
    })
    const asn = new Certificate({ tbsCertificate, signatureAlgorithm, signatureValue: new Uint8Array(sign('sha256', Buffer.from(AsnSerializer.serialize(tbsCertificate)), issuer?.privateKey ?? keys.privateKey)).buffer })
    return { certificate: new X509Certificate(Buffer.from(AsnSerializer.serialize(asn))), asn, privateKey: keys.privateKey }
}

export function extension(oid: string, data: ArrayBuffer): Extension {
    return new Extension({ extnID: oid, extnValue: new OctetString(data) })
}

export function createOCSPFixtures() {
    const ca = extension('2.5.29.19', AsnSerializer.serialize(new BasicConstraints({ cA: true })))
    const aia = extension('1.3.6.1.5.5.7.1.1', AsnSerializer.serialize(new AuthorityInfoAccessSyntax([new AccessDescription({ accessMethod: '1.3.6.1.5.5.7.48.1', accessLocation: new GeneralName({ uniformResourceIdentifier: OCSP_URL }) })])))
    const root = createTestCertificate('Root', 1, undefined, [ca])
    const intermediate = createTestCertificate('Intermediate', 2, root, [ca, aia, extension('1.2.840.113635.100.6.2.1', new Uint8Array([5, 0]).buffer)])
    const leaf = createTestCertificate('Leaf', 3, intermediate, [aia, extension('1.2.840.113635.100.6.11.1', new Uint8Array([5, 0]).buffer)])
    const responder = createTestCertificate('Responder', 4, intermediate, [extension('2.5.29.37', AsnSerializer.serialize(new ExtendedKeyUsage(['1.3.6.1.5.5.7.3.9']))), extension('2.5.29.15', AsnSerializer.serialize(new KeyUsage(KeyUsageFlags.digitalSignature)))])
    return { root, intermediate, leaf, responder }
}

export function testCertID(cert: TestCertificate, issuer: TestCertificate): CertID {
    return new CertID({
        hashAlgorithm: new AlgorithmIdentifier({ algorithm: '2.16.840.1.101.3.4.2.1', parameters: null }),
        issuerNameHash: new OctetString(createHash('sha256').update(Buffer.from(AsnSerializer.serialize(issuer.asn.tbsCertificate.subject))).digest()),
        issuerKeyHash: new OctetString(createHash('sha256').update(Buffer.from(issuer.asn.tbsCertificate.subjectPublicKeyInfo.subjectPublicKey)).digest()),
        serialNumber: cert.asn.tbsCertificate.serialNumber
    })
}

export function testResponseData(cert: TestCertificate, issuer: TestCertificate, signer: TestCertificate = issuer, byName: boolean = false): ResponseData {
    return new ResponseData({
        responderID: byName ? new ResponderID({ byName: signer.asn.tbsCertificate.subject }) : new ResponderID({ byKey: new KeyHash(createHash('sha1').update(Buffer.from(signer.asn.tbsCertificate.subjectPublicKeyInfo.subjectPublicKey)).digest()) }),
        producedAt: OCSP_TEST_DATE,
        responses: [new SingleResponse({ certID: testCertID(cert, issuer), certStatus: new CertStatus({ good: null }), thisUpdate: new Date(OCSP_TEST_DATE.getTime() - 60_000), nextUpdate: new Date(OCSP_TEST_DATE.getTime() + 3_600_000) })]
    })
}

export function signOCSPResponse(data: ResponseData, signer: TestCertificate, includeCertificate: boolean = true): Buffer {
    const response = new BasicOCSPResponse({
        tbsResponseData: data,
        signatureAlgorithm,
        signature: new Uint8Array(sign('sha256', Buffer.from(AsnSerializer.serialize(data)), signer.privateKey)).buffer,
        certs: includeCertificate ? [signer.asn] : undefined
    })
    return Buffer.from(AsnSerializer.serialize(new OCSPResponse({ responseStatus: OCSPResponseStatus.successful, responseBytes: new ResponseBytes({ responseType: id_pkix_ocsp_basic, response: new OctetString(AsnSerializer.serialize(response)) }) })))
}
