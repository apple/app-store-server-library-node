// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import assert = require("assert");
import jsonwebtoken = require('jsonwebtoken');
import { KeyObject, X509Certificate, createHash, createPublicKey, generateKeyPairSync } from "crypto";
import { KJUR, X509 } from "jsrsasign";
import { SignedDataVerifier, VerificationException, VerificationStatus } from "../../jws_verification";
import { Environment } from "../../models/Environment";
import { readFile, readBytes, getSignedPayloadVerifierWithDefaultAppAppleId, getDefaultSignedPayloadVerifier } from "../util";

const ROOT_CA_BASE64_ENCODED = "MIIBgjCCASmgAwIBAgIJALUc5ALiH5pbMAoGCCqGSM49BAMDMDYxCzAJBgNVBAYTAlVTMRMwEQYDVQQIDApDYWxpZm9ybmlhMRIwEAYDVQQHDAlDdXBlcnRpbm8wHhcNMjMwMTA1MjEzMDIyWhcNMzMwMTAyMjEzMDIyWjA2MQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTESMBAGA1UEBwwJQ3VwZXJ0aW5vMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEc+/Bl+gospo6tf9Z7io5tdKdrlN1YdVnqEhEDXDShzdAJPQijamXIMHf8xWWTa1zgoYTxOKpbuJtDplz1XriTaMgMB4wDAYDVR0TBAUwAwEB/zAOBgNVHQ8BAf8EBAMCAQYwCgYIKoZIzj0EAwMDRwAwRAIgemWQXnMAdTad2JDJWng9U4uBBL5mA7WI05H7oH7c6iQCIHiRqMjNfzUAyiu9h6rOU/K+iTR0I/3Y/NSWsXHX+acc";
const INTERMEDIATE_CA_BASE64_ENCODED = "MIIBnzCCAUWgAwIBAgIBCzAKBggqhkjOPQQDAzA2MQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTESMBAGA1UEBwwJQ3VwZXJ0aW5vMB4XDTIzMDEwNTIxMzEwNVoXDTMzMDEwMTIxMzEwNVowRTELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAkNBMRIwEAYDVQQHDAlDdXBlcnRpbm8xFTATBgNVBAoMDEludGVybWVkaWF0ZTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABBUN5V9rKjfRiMAIojEA0Av5Mp0oF+O0cL4gzrTF178inUHugj7Et46NrkQ7hKgMVnjogq45Q1rMs+cMHVNILWqjNTAzMA8GA1UdEwQIMAYBAf8CAQAwDgYDVR0PAQH/BAQDAgEGMBAGCiqGSIb3Y2QGAgEEAgUAMAoGCCqGSM49BAMDA0gAMEUCIQCmsIKYs41ullssHX4rVveUT0Z7Is5/hLK1lFPTtun3hAIgc2+2RG5+gNcFVcs+XJeEl4GZ+ojl3ROOmll+ye7dynQ=";
const LEAF_CERT_BASE64_ENCODED = "MIIBoDCCAUagAwIBAgIBDDAKBggqhkjOPQQDAzBFMQswCQYDVQQGEwJVUzELMAkGA1UECAwCQ0ExEjAQBgNVBAcMCUN1cGVydGlubzEVMBMGA1UECgwMSW50ZXJtZWRpYXRlMB4XDTIzMDEwNTIxMzEzNFoXDTMzMDEwMTIxMzEzNFowPTELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAkNBMRIwEAYDVQQHDAlDdXBlcnRpbm8xDTALBgNVBAoMBExlYWYwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAATitYHEaYVuc8g9AjTOwErMvGyPykPa+puvTI8hJTHZZDLGas2qX1+ErxgQTJgVXv76nmLhhRJH+j25AiAI8iGsoy8wLTAJBgNVHRMEAjAAMA4GA1UdDwEB/wQEAwIHgDAQBgoqhkiG92NkBgsBBAIFADAKBggqhkjOPQQDAwNIADBFAiBX4c+T0Fp5nJ5QRClRfu5PSByRvNPtuaTsk0vPB3WAIAIhANgaauAj/YP9s0AkEhyJhxQO/6Q2zouZ+H1CIOehnMzQ";    

const INTERMEDIATE_CA_INVALID_OID_BASE64_ENCODED = "MIIBnjCCAUWgAwIBAgIBDTAKBggqhkjOPQQDAzA2MQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTESMBAGA1UEBwwJQ3VwZXJ0aW5vMB4XDTIzMDEwNTIxMzYxNFoXDTMzMDEwMTIxMzYxNFowRTELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAkNBMRIwEAYDVQQHDAlDdXBlcnRpbm8xFTATBgNVBAoMDEludGVybWVkaWF0ZTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABBUN5V9rKjfRiMAIojEA0Av5Mp0oF+O0cL4gzrTF178inUHugj7Et46NrkQ7hKgMVnjogq45Q1rMs+cMHVNILWqjNTAzMA8GA1UdEwQIMAYBAf8CAQAwDgYDVR0PAQH/BAQDAgEGMBAGCiqGSIb3Y2QGAgIEAgUAMAoGCCqGSM49BAMDA0cAMEQCIFROtTE+RQpKxNXETFsf7Mc0h+5IAsxxo/X6oCC/c33qAiAmC5rn5yCOOEjTY4R1H1QcQVh+eUwCl13NbQxWCuwxxA==";
const LEAF_CERT_FOR_INTERMEDIATE_CA_INVALID_OID_BASE64_ENCODED = "MIIBnzCCAUagAwIBAgIBDjAKBggqhkjOPQQDAzBFMQswCQYDVQQGEwJVUzELMAkGA1UECAwCQ0ExEjAQBgNVBAcMCUN1cGVydGlubzEVMBMGA1UECgwMSW50ZXJtZWRpYXRlMB4XDTIzMDEwNTIxMzY1OFoXDTMzMDEwMTIxMzY1OFowPTELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAkNBMRIwEAYDVQQHDAlDdXBlcnRpbm8xDTALBgNVBAoMBExlYWYwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAATitYHEaYVuc8g9AjTOwErMvGyPykPa+puvTI8hJTHZZDLGas2qX1+ErxgQTJgVXv76nmLhhRJH+j25AiAI8iGsoy8wLTAJBgNVHRMEAjAAMA4GA1UdDwEB/wQEAwIHgDAQBgoqhkiG92NkBgsBBAIFADAKBggqhkjOPQQDAwNHADBEAiAUAs+gzYOsEXDwQquvHYbcVymyNqDtGw9BnUFp2YLuuAIgXxQ3Ie9YU0cMqkeaFd+lyo0asv9eyzk6stwjeIeOtTU=";
const LEAF_CERT_INVALID_OID_BASE64_ENCODED = "MIIBoDCCAUagAwIBAgIBDzAKBggqhkjOPQQDAzBFMQswCQYDVQQGEwJVUzELMAkGA1UECAwCQ0ExEjAQBgNVBAcMCUN1cGVydGlubzEVMBMGA1UECgwMSW50ZXJtZWRpYXRlMB4XDTIzMDEwNTIxMzczMVoXDTMzMDEwMTIxMzczMVowPTELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAkNBMRIwEAYDVQQHDAlDdXBlcnRpbm8xDTALBgNVBAoMBExlYWYwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAATitYHEaYVuc8g9AjTOwErMvGyPykPa+puvTI8hJTHZZDLGas2qX1+ErxgQTJgVXv76nmLhhRJH+j25AiAI8iGsoy8wLTAJBgNVHRMEAjAAMA4GA1UdDwEB/wQEAwIHgDAQBgoqhkiG92NkBgsCBAIFADAKBggqhkjOPQQDAwNIADBFAiAb+7S3i//bSGy7skJY9+D4VgcQLKFeYfIMSrUCmdrFqwIhAIMVwzD1RrxPRtJyiOCXLyibIvwcY+VS73HYfk0O9lgz";

const LEAF_CERT_PUBLIC_KEY_BASE64_ENCODED = "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE4rWBxGmFbnPIPQI0zsBKzLxsj8pD2vqbr0yPISUx2WQyxmrNql9fhK8YEEyYFV7++p5i4YUSR/o9uQIgCPIhrA==";

const REAL_APPLE_ROOT_BASE64_ENCODED = "MIICQzCCAcmgAwIBAgIILcX8iNLFS5UwCgYIKoZIzj0EAwMwZzEbMBkGA1UEAwwSQXBwbGUgUm9vdCBDQSAtIEczMSYwJAYDVQQLDB1BcHBsZSBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eTETMBEGA1UECgwKQXBwbGUgSW5jLjELMAkGA1UEBhMCVVMwHhcNMTQwNDMwMTgxOTA2WhcNMzkwNDMwMTgxOTA2WjBnMRswGQYDVQQDDBJBcHBsZSBSb290IENBIC0gRzMxJjAkBgNVBAsMHUFwcGxlIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MRMwEQYDVQQKDApBcHBsZSBJbmMuMQswCQYDVQQGEwJVUzB2MBAGByqGSM49AgEGBSuBBAAiA2IABJjpLz1AcqTtkyJygRMc3RCV8cWjTnHcFBbZDuWmBSp3ZHtfTjjTuxxEtX/1H7YyYl3J6YRbTzBPEVoA/VhYDKX1DyxNB0cTddqXl5dvMVztK517IDvYuVTZXpmkOlEKMaNCMEAwHQYDVR0OBBYEFLuw3qFYM4iapIqZ3r6966/ayySrMA8GA1UdEwEB/wQFMAMBAf8wDgYDVR0PAQH/BAQDAgEGMAoGCCqGSM49BAMDA2gAMGUCMQCD6cHEFl4aXTQY2e3v9GwOAEZLuN+yRhHFD/3meoyhpmvOwgPUnPWTxnS4at+qIxUCMG1mihDK1A3UT82NQz60imOlM27jbdoXt2QfyFMm+YhidDkLF1vLUagM6BgD56KyKA==";
const REAL_APPLE_INTERMEDIATE_BASE64_ENCODED = "MIIDFjCCApygAwIBAgIUIsGhRwp0c2nvU4YSycafPTjzbNcwCgYIKoZIzj0EAwMwZzEbMBkGA1UEAwwSQXBwbGUgUm9vdCBDQSAtIEczMSYwJAYDVQQLDB1BcHBsZSBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eTETMBEGA1UECgwKQXBwbGUgSW5jLjELMAkGA1UEBhMCVVMwHhcNMjEwMzE3MjAzNzEwWhcNMzYwMzE5MDAwMDAwWjB1MUQwQgYDVQQDDDtBcHBsZSBXb3JsZHdpZGUgRGV2ZWxvcGVyIFJlbGF0aW9ucyBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eTELMAkGA1UECwwCRzYxEzARBgNVBAoMCkFwcGxlIEluYy4xCzAJBgNVBAYTAlVTMHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEbsQKC94PrlWmZXnXgtxzdVJL8T0SGYngDRGpngn3N6PT8JMEb7FDi4bBmPhCnZ3/sq6PF/cGcKXWsL5vOteRhyJ45x3ASP7cOB+aao90fcpxSv/EZFbniAbNgZGhIhpIo4H6MIH3MBIGA1UdEwEB/wQIMAYBAf8CAQAwHwYDVR0jBBgwFoAUu7DeoVgziJqkipnevr3rr9rLJKswRgYIKwYBBQUHAQEEOjA4MDYGCCsGAQUFBzABhipodHRwOi8vb2NzcC5hcHBsZS5jb20vb2NzcDAzLWFwcGxlcm9vdGNhZzMwNwYDVR0fBDAwLjAsoCqgKIYmaHR0cDovL2NybC5hcHBsZS5jb20vYXBwbGVyb290Y2FnMy5jcmwwHQYDVR0OBBYEFD8vlCNR01DJmig97bB85c+lkGKZMA4GA1UdDwEB/wQEAwIBBjAQBgoqhkiG92NkBgIBBAIFADAKBggqhkjOPQQDAwNoADBlAjBAXhSq5IyKogMCPtw490BaB677CaEGJXufQB/EqZGd6CSjiCtOnuMTbXVXmxxcxfkCMQDTSPxarZXvNrkxU3TkUMI33yzvFVVRT4wxWJC994OsdcZ4+RGNsYDyR5gmdr0nDGg=";
const REAL_APPLE_SIGNING_CERTIFICATE_BASE64_ENCODED = "MIIEMTCCA7agAwIBAgIQR8KHzdn554Z/UoradNx9tzAKBggqhkjOPQQDAzB1MUQwQgYDVQQDDDtBcHBsZSBXb3JsZHdpZGUgRGV2ZWxvcGVyIFJlbGF0aW9ucyBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eTELMAkGA1UECwwCRzYxEzARBgNVBAoMCkFwcGxlIEluYy4xCzAJBgNVBAYTAlVTMB4XDTI1MDkxOTE5NDQ1MVoXDTI3MTAxMzE3NDcyM1owgZIxQDA+BgNVBAMMN1Byb2QgRUNDIE1hYyBBcHAgU3RvcmUgYW5kIGlUdW5lcyBTdG9yZSBSZWNlaXB0IFNpZ25pbmcxLDAqBgNVBAsMI0FwcGxlIFdvcmxkd2lkZSBEZXZlbG9wZXIgUmVsYXRpb25zMRMwEQYDVQQKDApBcHBsZSBJbmMuMQswCQYDVQQGEwJVUzBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABNnVvhcv7iT+7Ex5tBMBgrQspHzIsXRi0Yxfek7lv8wEmj/bHiWtNwJqc2BoHzsQiEjP7KFIIKg4Y8y0/nynuAmjggIIMIICBDAMBgNVHRMBAf8EAjAAMB8GA1UdIwQYMBaAFD8vlCNR01DJmig97bB85c+lkGKZMHAGCCsGAQUFBwEBBGQwYjAtBggrBgEFBQcwAoYhaHR0cDovL2NlcnRzLmFwcGxlLmNvbS93d2RyZzYuZGVyMDEGCCsGAQUFBzABhiVodHRwOi8vb2NzcC5hcHBsZS5jb20vb2NzcDAzLXd3ZHJnNjAyMIIBHgYDVR0gBIIBFTCCAREwggENBgoqhkiG92NkBQYBMIH+MIHDBggrBgEFBQcCAjCBtgyBs1JlbGlhbmNlIG9uIHRoaXMgY2VydGlmaWNhdGUgYnkgYW55IHBhcnR5IGFzc3VtZXMgYWNjZXB0YW5jZSBvZiB0aGUgdGhlbiBhcHBsaWNhYmxlIHN0YW5kYXJkIHRlcm1zIGFuZCBjb25kaXRpb25zIG9mIHVzZSwgY2VydGlmaWNhdGUgcG9saWN5IGFuZCBjZXJ0aWZpY2F0aW9uIHByYWN0aWNlIHN0YXRlbWVudHMuMDYGCCsGAQUFBwIBFipodHRwOi8vd3d3LmFwcGxlLmNvbS9jZXJ0aWZpY2F0ZWF1dGhvcml0eS8wHQYDVR0OBBYEFIFioG4wMMVA1ku9zJmGNPAVn3eqMA4GA1UdDwEB/wQEAwIHgDAQBgoqhkiG92NkBgsBBAIFADAKBggqhkjOPQQDAwNpADBmAjEA+qXnREC7hXIWVLsLxznjRpIzPf7VHz9V/CTm8+LJlrQepnmcPvGLNcX6XPnlcgLAAjEA5IjNZKgg5pQ79knF4IbTXdKv8vutIDMXDmjPVT3dGvFtsGRwXOywR2kZCdSrfeot";

const EFFECTIVE_DATE = new Date(1761962975000); // October 2025

const CLOCK_DATE = 41231
class SignedJWTVerifierTest extends SignedDataVerifier {
    effectiveDate = EFFECTIVE_DATE
    async testVerifyCertificateChain(trustedRoots: X509Certificate[], leaf: string, intermediate: string): Promise<KeyObject> {
        return await this.verifyCertificateChain(trustedRoots, new X509Certificate(Buffer.from(leaf, 'base64')), new X509Certificate(Buffer.from(intermediate, 'base64')), this.effectiveDate)
    }

    public async verifyCertificateChainWithoutCaching(trustedRoots: X509Certificate[], leaf: X509Certificate, intermediate: X509Certificate, effectiveDate: Date): Promise<KeyObject> {
        return await super.verifyCertificateChainWithoutCaching(trustedRoots, leaf, intermediate, effectiveDate)
    }

    async testCheckOCSPStatus(cert: X509Certificate, issuer: X509Certificate): Promise<void> {
        return await this.checkOCSPStatus(cert, issuer)
    }

    getRootCertificates() {
        return this.rootCertificates
    } 

    getCacheSize() {
        return Object.keys(this.verifiedPublicKeyCache).length
    }
}

class SignedDataVerifierWithTrustedKey extends SignedDataVerifier {
    private trustedKey: KeyObject

    constructor(trustedKey: KeyObject, environment: Environment, bundleId: string, appAppleId?: number) {
        super([], false, environment, bundleId, appAppleId)
        this.trustedKey = trustedKey
    }

    protected async verifyCertificateChain(trustedRoots: X509Certificate[], leaf: X509Certificate, intermediate: X509Certificate, effectiveDate: Date): Promise<KeyObject> {
        return this.trustedKey
    }
}

function generateKeyPair(): { publicKey: string, privateKey: string } {
    return generateKeyPairSync('ec', {
        namedCurve: 'prime256v1',
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    })
}

function signPayloadWithChain(payload: object, privateKey: string, chain: string[]): string {
    return jsonwebtoken.sign(payload, privateKey, { algorithm: 'ES256', noTimestamp: true, header: { alg: 'ES256', x5c: chain } })
}

function replaceX5CHeader(jwt: string, chain: string[]): string {
    const parts = jwt.split('.')
    const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString())
    header['x5c'] = chain
    return [Buffer.from(JSON.stringify(header)).toString('base64url'), parts[1], parts[2]].join('.')
}

function toGeneralizedTime(date: Date): string {
    return date.toISOString().replace(/[-:T]/g, '').replace(/\.\d{3}/, '')
}

function createCertificate(serial: number, subject: string, issuer: string, publicKey: string, issuerPrivateKey: string, ext: object[]): X509Certificate {
    const now = Date.now()
    const certificate = new (KJUR.asn1.x509 as any).Certificate({
        version: 3,
        serial: { int: serial },
        issuer: { str: issuer },
        subject: { str: subject },
        notbefore: { type: 'gen', str: toGeneralizedTime(new Date(now - 24 * 60 * 60 * 1_000)) },
        notafter: { type: 'gen', str: toGeneralizedTime(new Date(now + 24 * 60 * 60 * 1_000)) },
        sbjpubkey: publicKey,
        ext: ext,
        sigalg: 'SHA256withECDSA',
        cakey: issuerPrivateKey
    })
    return new X509Certificate(certificate.getPEM())
}

function createSigningChain() {
    const rootKeys = generateKeyPair()
    const intermediateKeys = generateKeyPair()
    const leafKeys = generateKeyPair()
    const ca = { extname: 'basicConstraints', cA: true, critical: true }
    const rootName = '/CN=SDK Test Root'
    const intermediateName = '/CN=SDK Test Intermediate'
    const rootUrl = 'http://ocsp.example.com/root'
    const intermediateUrl = 'http://ocsp.example.com/issuer'
    const root = createCertificate(10, rootName, rootName, rootKeys.publicKey, rootKeys.privateKey, [ca])
    const intermediate = createCertificate(11, intermediateName, rootName, intermediateKeys.publicKey, rootKeys.privateKey, [
        ca,
        { extname: '1.2.840.113635.100.6.2.1', extn: '0500' },
        { extname: 'authorityInfoAccess', array: [{ ocsp: rootUrl }] },
    ])
    const issueLeaf = (serial: number, ocspUrl: string) =>
        createCertificate(serial, '/CN=SDK Test Leaf', intermediateName, leafKeys.publicKey, intermediateKeys.privateKey, [
            { extname: '1.2.840.113635.100.6.11.1', extn: '0500' },
            { extname: 'authorityInfoAccess', array: [{ ocsp: ocspUrl }] },
        ])
    const leaf = issueLeaf(12, intermediateUrl)
    const chain = [leaf, intermediate, root].map(cert => cert.raw.toString('base64'))
    return { root, intermediate, leaf, rootKeys, intermediateKeys, leafKeys, rootUrl, intermediateUrl, chain, issueLeaf }
}

describe("Chain Verification Checks", () => {
    afterEach(() => {
        jest.useRealTimers()
    })

    it('should validate a chain without OCSP', async () => {
        const verifier = new SignedJWTVerifierTest([Buffer.from(ROOT_CA_BASE64_ENCODED, 'base64')], false, Environment.PRODUCTION, "com.example", 1234);
        const publicKey = await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), LEAF_CERT_BASE64_ENCODED, INTERMEDIATE_CA_BASE64_ENCODED)
        expect(Buffer.from(LEAF_CERT_PUBLIC_KEY_BASE64_ENCODED, 'base64')).toMatchObject(publicKey.export({
            type: 'spki',
            format: 'der'
        }))
    })

    it('should fail to validate a chain with an invalid intermediate OID', async () => {
        const verifier = new SignedJWTVerifierTest([Buffer.from(ROOT_CA_BASE64_ENCODED, 'base64')], false, Environment.PRODUCTION, "com.example", 1234);
        try {
            await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), LEAF_CERT_FOR_INTERMEDIATE_CA_INVALID_OID_BASE64_ENCODED, INTERMEDIATE_CA_INVALID_OID_BASE64_ENCODED)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.VERIFICATION_FAILURE)
        }
    })

    it('should fail to validate a chain with an invalid leaf OID', async () => {
        const verifier = new SignedJWTVerifierTest([Buffer.from(ROOT_CA_BASE64_ENCODED, 'base64')], false, Environment.PRODUCTION, "com.example", 1234);
        try {
            await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), LEAF_CERT_INVALID_OID_BASE64_ENCODED, INTERMEDIATE_CA_BASE64_ENCODED)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.VERIFICATION_FAILURE)
        }
    })

    it('should fail to validate a chain with empty root certificate array', async () => {
        const verifier = new SignedJWTVerifierTest([], false, Environment.PRODUCTION, "com.example", 1234);
        try {
            await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), LEAF_CERT_BASE64_ENCODED, INTERMEDIATE_CA_BASE64_ENCODED)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.VERIFICATION_FAILURE)
        }
    })

    it('should fail to validate a chain with an expired chain', async () => {
        const verifier = new SignedJWTVerifierTest([Buffer.from(ROOT_CA_BASE64_ENCODED, 'base64')], false, Environment.PRODUCTION, "com.example", 1234);
        verifier.effectiveDate = new Date(2280946846000)
        try {
            await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), LEAF_CERT_BASE64_ENCODED, INTERMEDIATE_CA_BASE64_ENCODED)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.INVALID_CERTIFICATE)
        }
    })

    it('should validate a real chain with OCSP', async () => {
        const verifier = new SignedJWTVerifierTest([Buffer.from(REAL_APPLE_ROOT_BASE64_ENCODED, 'base64')], true, Environment.PRODUCTION, "com.example", 1234);
        await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), REAL_APPLE_SIGNING_CERTIFICATE_BASE64_ENCODED, REAL_APPLE_INTERMEDIATE_BASE64_ENCODED)
    })

    it('should fail to validate a chain with mismatched root certificates', async () => {
        const verifier = new SignedJWTVerifierTest([Buffer.from(REAL_APPLE_ROOT_BASE64_ENCODED, 'base64')], false, Environment.PRODUCTION, "com.example", 1234);
        try {
            await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), LEAF_CERT_BASE64_ENCODED, INTERMEDIATE_CA_BASE64_ENCODED)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.VERIFICATION_FAILURE)
            return
        }
    })

    it('should fail to validate a chain with invalid root certificates', async () => {
        try {
            const verifier = new SignedJWTVerifierTest([Buffer.from("abc", "utf-8")], false, Environment.PRODUCTION, "com.example", 1234);
            await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), LEAF_CERT_BASE64_ENCODED, INTERMEDIATE_CA_BASE64_ENCODED)
        } catch (e) {
            return
        }
        assert(false)
    })

    it('should cache OCSP responses', async () => {
        jest.useFakeTimers()
        jest.setSystemTime(CLOCK_DATE)
        const verifier = new SignedJWTVerifierTest([Buffer.from(ROOT_CA_BASE64_ENCODED, 'base64')], true, Environment.PRODUCTION, "com.example", 1234);
        let spy = jest.spyOn(verifier, 'verifyCertificateChainWithoutCaching').mockImplementation((_, _2, _3, _4) => Promise.resolve(new X509Certificate(Buffer.from(LEAF_CERT_BASE64_ENCODED, 'base64')).publicKey));
        await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), LEAF_CERT_BASE64_ENCODED, INTERMEDIATE_CA_BASE64_ENCODED)
        expect(spy).toHaveBeenCalledTimes(1);
        jest.setSystemTime(CLOCK_DATE + 1_000) // 1 second
        await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), LEAF_CERT_BASE64_ENCODED, INTERMEDIATE_CA_BASE64_ENCODED)
        expect(spy).toHaveBeenCalledTimes(1);
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    it('should cache OCSP responses for a limited time', async () => {
        jest.useFakeTimers()
        jest.setSystemTime(CLOCK_DATE)
        const verifier = new SignedJWTVerifierTest([Buffer.from(ROOT_CA_BASE64_ENCODED, 'base64')], true, Environment.PRODUCTION, "com.example", 1234);
        let spy = jest.spyOn(verifier, 'verifyCertificateChainWithoutCaching').mockImplementation((_, _2, _3, _4) => Promise.resolve(new X509Certificate(Buffer.from(LEAF_CERT_BASE64_ENCODED, 'base64')).publicKey));
        await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), LEAF_CERT_BASE64_ENCODED, INTERMEDIATE_CA_BASE64_ENCODED)
        expect(spy).toHaveBeenCalledTimes(1);
        jest.setSystemTime(CLOCK_DATE + 15 * 60 * 1_000) // 15 minutes
        await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), LEAF_CERT_BASE64_ENCODED, INTERMEDIATE_CA_BASE64_ENCODED)
        expect(spy).toHaveBeenCalledTimes(2);
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    it('should not return cached OCSP responses for a different chain', async () => {
        jest.useFakeTimers()
        jest.setSystemTime(CLOCK_DATE)
        const verifier = new SignedJWTVerifierTest([Buffer.from(ROOT_CA_BASE64_ENCODED, 'base64')], true, Environment.PRODUCTION, "com.example", 1234);
        let spy = jest.spyOn(verifier, 'verifyCertificateChainWithoutCaching').mockImplementation((_, _2, _3, _4) => Promise.resolve(new X509Certificate(Buffer.from(LEAF_CERT_BASE64_ENCODED, 'base64')).publicKey));
        await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), LEAF_CERT_BASE64_ENCODED, INTERMEDIATE_CA_BASE64_ENCODED)
        expect(spy).toHaveBeenCalledTimes(1);
        jest.setSystemTime(CLOCK_DATE + 1_000) // 1 second
        await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), REAL_APPLE_SIGNING_CERTIFICATE_BASE64_ENCODED, REAL_APPLE_INTERMEDIATE_BASE64_ENCODED)
        expect(spy).toHaveBeenCalledTimes(2);
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    it('should not return cached OCSP responses for a slightly different chain', async () => {
        jest.useFakeTimers()
        jest.setSystemTime(CLOCK_DATE)
        const verifier = new SignedJWTVerifierTest([Buffer.from(ROOT_CA_BASE64_ENCODED, 'base64')], true, Environment.PRODUCTION, "com.example", 1234);
        let spy = jest.spyOn(verifier, 'verifyCertificateChainWithoutCaching').mockImplementation((_, _2, _3, _4) => Promise.resolve(new X509Certificate(Buffer.from(LEAF_CERT_BASE64_ENCODED, 'base64')).publicKey));
        await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), LEAF_CERT_BASE64_ENCODED, INTERMEDIATE_CA_BASE64_ENCODED)
        expect(spy).toHaveBeenCalledTimes(1);
        jest.setSystemTime(CLOCK_DATE + 1_000) // 1 second
        await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), LEAF_CERT_BASE64_ENCODED, REAL_APPLE_INTERMEDIATE_BASE64_ENCODED)
        expect(spy).toHaveBeenCalledTimes(2);
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    it('should evict expired cache entries once the cache is full', async () => {
        jest.useFakeTimers()
        jest.setSystemTime(CLOCK_DATE)
        const verifier = new SignedJWTVerifierTest([Buffer.from(ROOT_CA_BASE64_ENCODED, 'base64')], true, Environment.PRODUCTION, "com.example", 1234);
        let spy = jest.spyOn(verifier, 'verifyCertificateChainWithoutCaching').mockImplementation((_, _2, _3, _4) => Promise.resolve(new X509Certificate(Buffer.from(LEAF_CERT_BASE64_ENCODED, 'base64')).publicKey));
        const certificates = [ROOT_CA_BASE64_ENCODED, INTERMEDIATE_CA_BASE64_ENCODED, LEAF_CERT_BASE64_ENCODED, INTERMEDIATE_CA_INVALID_OID_BASE64_ENCODED, LEAF_CERT_FOR_INTERMEDIATE_CA_INVALID_OID_BASE64_ENCODED, LEAF_CERT_INVALID_OID_BASE64_ENCODED, REAL_APPLE_ROOT_BASE64_ENCODED, REAL_APPLE_INTERMEDIATE_BASE64_ENCODED, REAL_APPLE_SIGNING_CERTIFICATE_BASE64_ENCODED]
        const chains: string[][] = []
        for (const leaf of certificates) {
            for (const intermediate of certificates) {
                chains.push([leaf, intermediate])
            }
        }
        for (const chain of chains.slice(0, 32)) {
            await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), chain[0], chain[1])
        }
        expect(spy).toHaveBeenCalledTimes(32);
        expect(verifier.getCacheSize()).toBe(32)
        jest.setSystemTime(CLOCK_DATE + 15 * 60 * 1_000 + 1_000)
        await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), chains[32][0], chains[32][1])
        expect(spy).toHaveBeenCalledTimes(33);
        expect(verifier.getCacheSize()).toBe(1)
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })
})

describe("Decoding checks", () => {
    const signing = createSigningChain()
    const signFixture = (name: string) => {
        const fixture = readFile(`tests/resources/mock_signed_data/${name}`)
        const payload = JSON.parse(Buffer.from(fixture.split('.')[1], 'base64url').toString())
        return signPayloadWithChain({ ...payload, signedDate: Date.now() }, signing.leafKeys.privateKey, signing.chain)
    }
    const notificationJws = signFixture('testNotification')
    const transactionJws = signFixture('transactionInfo')
    const verifierForChain = (environment: Environment, bundleId = 'com.example', appAppleId = 1234) =>
        new SignedDataVerifier([signing.root.raw], false, environment, bundleId, appAppleId)

    it('should fail to verify with a missing x5c header', async () => {
        const verifier = getSignedPayloadVerifierWithDefaultAppAppleId(Environment.PRODUCTION, "com.example")
        try {
            const missingX5CHeaderClaim = readFile('tests/resources/mock_signed_data/missingX5CHeaderClaim')
            await verifier.verifyAndDecodeNotification(missingX5CHeaderClaim)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.INVALID_CHAIN_LENGTH)
        }
    })

    it('should fail to verify with an invalid chain length', async () => {
        const verifier = getSignedPayloadVerifierWithDefaultAppAppleId(Environment.SANDBOX, "com.example")
        const testNotification = readFile('tests/resources/mock_signed_data/testNotification')
        const chain: string[] = JSON.parse(Buffer.from(testNotification.split('.')[0], 'base64url').toString())['x5c']
        for (const invalidChain of [chain.slice(0, 1), chain.slice(0, 2), chain.concat(chain.slice(0, 1))]) {
            try {
                await verifier.verifyAndDecodeNotification(replaceX5CHeader(testNotification, invalidChain))
                assert(false)
            } catch (e) {
                expect(e).toBeInstanceOf(VerificationException)
                expect((e as VerificationException).status).toEqual(VerificationStatus.INVALID_CHAIN_LENGTH)
            }
        }
    })

    it('should fail to verify with a certificate that cannot be parsed', async () => {
        const verifier = getSignedPayloadVerifierWithDefaultAppAppleId(Environment.SANDBOX, "com.example")
        const testNotification = readFile('tests/resources/mock_signed_data/testNotification')
        try {
            await verifier.verifyAndDecodeNotification(replaceX5CHeader(testNotification, ["abc", "def", "ghi"]))
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.INVALID_CERTIFICATE)
        }
    })

    it('should fail to verify with an invalid bundle id', async () => {
        const verifier = getSignedPayloadVerifierWithDefaultAppAppleId(Environment.SANDBOX, "com.example")
        try {
            const wrongBundleId = readFile('tests/resources/mock_signed_data/wrongBundleId')
            await verifier.verifyAndDecodeNotification(wrongBundleId)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.INVALID_APP_IDENTIFIER)
        }
    })

    it('should fail to verify with an invalid bundle id for transaction', async () => {
        try {
            const verifier = verifierForChain(Environment.SANDBOX, "com.example.x")
            await verifier.verifyAndDecodeTransaction(transactionJws)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.INVALID_APP_IDENTIFIER)
        }
    })

    it('should fail to verify a notification with an invalid app apple id', async () => {
        const verifier = verifierForChain(Environment.PRODUCTION, "com.example", 1235)
        try {
            await verifier.verifyAndDecodeNotification(notificationJws)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.INVALID_APP_IDENTIFIER)
        }
    })

    it('should fail to verify a transaction with an invalid environment', async () => {
        const verifier = verifierForChain(Environment.PRODUCTION)
        try {
            await verifier.verifyAndDecodeTransaction(transactionJws)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.INVALID_ENVIRONMENT)
        }
    })

    it('should fail to verify a renewal info with an invalid environment', async () => {
        const verifier = getSignedPayloadVerifierWithDefaultAppAppleId(Environment.PRODUCTION, "com.example")
        try {
            const renewalInfo = readFile('tests/resources/mock_signed_data/renewalInfo')
            await verifier.verifyAndDecodeRenewalInfo(renewalInfo)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.INVALID_ENVIRONMENT)
        }
    })

    it('should fail to verify with an invalid environment', async () => {
        try {
            const verifier = verifierForChain(Environment.PRODUCTION)
            await verifier.verifyAndDecodeNotification(notificationJws)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.INVALID_ENVIRONMENT)
        }
    })

    it('should fail to verify with a malformed JWT with too many parts', async () => {
        const verifier = getSignedPayloadVerifierWithDefaultAppAppleId(Environment.SANDBOX, "com.example")
        try {
            await verifier.verifyAndDecodeNotification("a.b.c.d")
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.VERIFICATION_FAILURE)
        }
    })

    it('should fail to verify with a malformed JWT', async () => {
        const verifier = getSignedPayloadVerifierWithDefaultAppAppleId(Environment.SANDBOX, "com.example")
        try {
            await verifier.verifyAndDecodeNotification("a.b.c")
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.VERIFICATION_FAILURE)
        }
    })

    it('should verify and decode a valid notification', async () => {
        const verifier = verifierForChain(Environment.SANDBOX)
        const notification = await verifier.verifyAndDecodeNotification(notificationJws)
        expect(notification.notificationType).toEqual("TEST")
    })

    it('should reject a presented root certificate that differs from the configured anchor', async () => {
        const verifier = getSignedPayloadVerifierWithDefaultAppAppleId(Environment.SANDBOX, 'com.example')
        const notification = readFile('tests/resources/mock_signed_data/testNotification')
        await expect(verifier.verifyAndDecodeNotification(notification)).rejects.toMatchObject({
            status: VerificationStatus.VERIFICATION_FAILURE,
        })
    })

    it('should verify and decode a valid renewal info', async () => {
        const verifier =getSignedPayloadVerifierWithDefaultAppAppleId(Environment.SANDBOX, "com.example")

        const renewalInfo = readFile('tests/resources/mock_signed_data/renewalInfo')
        const notification = await verifier.verifyAndDecodeRenewalInfo(renewalInfo)
        expect(notification.environment).toEqual(Environment.SANDBOX)
    })

    it('should verify and decode a valid transaction info', async () => {
        const verifier = verifierForChain(Environment.SANDBOX)
        const transaction = await verifier.verifyAndDecodeTransaction(transactionJws)
        expect(transaction.bundleId).toEqual("com.example")
        expect(transaction.environment).toEqual(Environment.SANDBOX)
    })

    it('should fail to verify data that does not pass validation', async () => {
        const verifier = getDefaultSignedPayloadVerifier()
        try {
            const signedTransaction = signPayloadWithChain({ bundleId: 1234, environment: Environment.LOCAL_TESTING }, generateKeyPair().privateKey, [])
            await verifier.verifyAndDecodeTransaction(signedTransaction)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.FAILURE)
        }
    })

    it('should fail to verify a notification whose externalPurchaseToken lacks a required field', async () => {
        const verifier = getDefaultSignedPayloadVerifier()
        const notification = JSON.parse(readFile('tests/resources/models/signedExternalPurchaseTokenNotification.json'))
        delete notification.externalPurchaseToken.tokenCreationDate
        try {
            const signedNotification = signPayloadWithChain(notification, generateKeyPair().privateKey, [])
            await verifier.verifyAndDecodeNotification(signedNotification)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.FAILURE)
        }
    })

    it('should fail to verify a realtime request that lacks a required field', async () => {
        const verifier = getDefaultSignedPayloadVerifier()
        const realtimeRequest = JSON.parse(readFile('tests/resources/models/decodedRealtimeRequest.json'))
        delete realtimeRequest.signedDate
        try {
            const signedRealtimeRequest = signPayloadWithChain(realtimeRequest, generateKeyPair().privateKey, [])
            await verifier.verifyAndDecodeRealtimeRequest(signedRealtimeRequest)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.FAILURE)
        }
    })
});

describe("Verifier configuration checks", () => {
    it('should require an appAppleId in the production environment', () => {
        expect(() => new SignedDataVerifier([readBytes('tests/resources/certs/testCA.der')], false, Environment.PRODUCTION, "com.example")).toThrow("appAppleId is required when the environment is Production")
    })

    it('should not require an appAppleId in the sandbox environment', () => {
        expect(() => new SignedDataVerifier([readBytes('tests/resources/certs/testCA.der')], false, Environment.SANDBOX, "com.example")).not.toThrow()
    })
});

describe("App transaction and realtime request checks", () => {
    const keyPair = generateKeyPair()
    const chain = [LEAF_CERT_BASE64_ENCODED, INTERMEDIATE_CA_BASE64_ENCODED, ROOT_CA_BASE64_ENCODED]
    const appTransaction = JSON.parse(readFile('tests/resources/models/appTransaction.json'))
    const realtimeRequest = JSON.parse(readFile('tests/resources/models/decodedRealtimeRequest.json'))
    const verifier = new SignedDataVerifierWithTrustedKey(createPublicKey(keyPair.publicKey), Environment.PRODUCTION, "com.example", 531412)

    it('should verify and decode a valid app transaction', async () => {
        const signedAppTransaction = signPayloadWithChain({ ...appTransaction, receiptType: Environment.PRODUCTION }, keyPair.privateKey, chain)
        const decodedAppTransaction = await verifier.verifyAndDecodeAppTransaction(signedAppTransaction)
        expect(decodedAppTransaction.receiptType).toEqual(Environment.PRODUCTION)
        expect(decodedAppTransaction.appAppleId).toEqual(531412)
        expect(decodedAppTransaction.bundleId).toEqual("com.example")
    })

    it('should fail to verify an app transaction with an invalid app apple id', async () => {
        try {
            const signedAppTransaction = signPayloadWithChain({ ...appTransaction, receiptType: Environment.PRODUCTION, appAppleId: 1234 }, keyPair.privateKey, chain)
            await verifier.verifyAndDecodeAppTransaction(signedAppTransaction)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.INVALID_APP_IDENTIFIER)
        }
    })

    it('should fail to verify an app transaction with an invalid bundle id', async () => {
        try {
            const signedAppTransaction = signPayloadWithChain({ ...appTransaction, receiptType: Environment.PRODUCTION, bundleId: "com.example.x" }, keyPair.privateKey, chain)
            await verifier.verifyAndDecodeAppTransaction(signedAppTransaction)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.INVALID_APP_IDENTIFIER)
        }
    })

    it('should fail to verify an app transaction with an invalid environment', async () => {
        try {
            const signedAppTransaction = signPayloadWithChain({ ...appTransaction, receiptType: Environment.SANDBOX }, keyPair.privateKey, chain)
            await verifier.verifyAndDecodeAppTransaction(signedAppTransaction)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.INVALID_ENVIRONMENT)
        }
    })

    it('should fail to verify an app transaction signed by a different key', async () => {
        try {
            const signedAppTransaction = signPayloadWithChain({ ...appTransaction, receiptType: Environment.PRODUCTION }, generateKeyPair().privateKey, chain)
            await verifier.verifyAndDecodeAppTransaction(signedAppTransaction)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.VERIFICATION_FAILURE)
        }
    })

    it('should verify and decode a valid realtime request', async () => {
        const signedRealtimeRequest = signPayloadWithChain({ ...realtimeRequest, environment: Environment.PRODUCTION }, keyPair.privateKey, chain)
        const decodedRealtimeRequest = await verifier.verifyAndDecodeRealtimeRequest(signedRealtimeRequest)
        expect(decodedRealtimeRequest.environment).toEqual(Environment.PRODUCTION)
        expect(decodedRealtimeRequest.appAppleId).toEqual(531412)
    })

    it('should fail to verify a realtime request with an invalid app apple id', async () => {
        try {
            const signedRealtimeRequest = signPayloadWithChain({ ...realtimeRequest, environment: Environment.PRODUCTION, appAppleId: 1234 }, keyPair.privateKey, chain)
            await verifier.verifyAndDecodeRealtimeRequest(signedRealtimeRequest)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.INVALID_APP_IDENTIFIER)
        }
    })

    it('should fail to verify a realtime request with an invalid environment', async () => {
        try {
            const signedRealtimeRequest = signPayloadWithChain({ ...realtimeRequest, environment: Environment.SANDBOX }, keyPair.privateKey, chain)
            await verifier.verifyAndDecodeRealtimeRequest(signedRealtimeRequest)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.INVALID_ENVIRONMENT)
        }
    })
});

describe("OCSP Checks", () => {
    const OCSP_URL = "http://ocsp.example.com/intermediate"
    const ONE_HOUR = 60 * 60 * 1_000
    const rootKeys = generateKeyPair()
    const intermediateKeys = generateKeyPair()
    const leafKeys = generateKeyPair()
    const responderKeys = generateKeyPair()
    const intermediate = createCertificate(1, '/CN=Test Intermediate', '/CN=Test Root', intermediateKeys.publicKey, rootKeys.privateKey, [{ extname: 'basicConstraints', cA: true, critical: true }, { extname: 'keyUsage', critical: true, names: ['keyCertSign', 'cRLSign'] }])
    const leaf = createCertificate(2, '/CN=Test Leaf', '/CN=Test Intermediate', leafKeys.publicKey, intermediateKeys.privateKey, [{ extname: 'authorityInfoAccess', array: [{ ocsp: OCSP_URL }] }])
    const responder = createCertificate(3, '/CN=Test OCSP Responder', '/CN=Test Intermediate', responderKeys.publicKey, intermediateKeys.privateKey, [{ extname: 'extKeyUsage', array: [{ name: 'ocspSigning' }] }])
    const responderWithoutOCSPSigning = createCertificate(4, '/CN=Test Server', '/CN=Test Intermediate', responderKeys.publicKey, intermediateKeys.privateKey, [{ extname: 'extKeyUsage', array: [{ name: 'serverAuth' }] }])
    const responderWithoutExtendedKeyUsage = createCertificate(5, '/CN=Test Server Without Extended Key Usage', '/CN=Test Intermediate', responderKeys.publicKey, intermediateKeys.privateKey, [{ extname: 'basicConstraints', cA: false }])

    function getVerifier(): SignedJWTVerifierTest {
        return new SignedJWTVerifierTest([Buffer.from(ROOT_CA_BASE64_ENCODED, 'base64')], true, Environment.PRODUCTION, "com.example", 1234)
    }

    function getKeyHash(cert: X509Certificate): string {
        const parsedCert = new X509()
        parsedCert.readCertPEM(cert.toString())
        return createHash('sha1').update(Buffer.from(parsedCert.getSPKIValue(), 'hex')).digest('hex')
    }

    function getGoodSingleResponse(): { [key: string]: any } {
        return {
            status: { status: 'good' },
            thisupdate: toGeneralizedTime(new Date(Date.now() - ONE_HOUR)),
            nextupdate: toGeneralizedTime(new Date(Date.now() + ONE_HOUR))
        }
    }

    function createOCSPResponse(signingKey: string, responderId: object, certs: X509Certificate[], singleResponse: { [key: string]: any }, checked = leaf, issuer = intermediate): Buffer {
        const certId = new (KJUR.asn1.ocsp.CertID as any)().getParamByCerts(issuer.toString(), checked.toString(), 'sha256')
        const response = new (KJUR.asn1.ocsp as any).OCSPResponse({
            resstatus: 'successful',
            restype: 'ocspBasic',
            respid: responderId,
            prodat: toGeneralizedTime(new Date()),
            array: [{ certid: certId, ...singleResponse }],
            certs: certs.map(cert => cert.toString()),
            sigalg: 'SHA256withECDSA',
            reskey: signingKey
        })
        return Buffer.from(response.getEncodedHex(), 'hex')
    }

    function mockOCSPResponse(body: Buffer, status: number = 200) {
        return jest.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.resolve(new Response(Uint8Array.from(body), { status: status })))
    }

    async function expectOCSPFailure(status: VerificationStatus) {
        try {
            await getVerifier().testCheckOCSPStatus(leaf, intermediate)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(status)
        }
    }

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should authenticate the JWS, start both OCSP requests together and reuse the verified chain', async () => {
        const signing = createSigningChain()
        const verifier = new SignedDataVerifier([signing.root.raw], true, Environment.SANDBOX, 'com.example')
        const payload = { bundleId: 'com.example', environment: Environment.SANDBOX }
        const signed = signPayloadWithChain(payload, signing.leafKeys.privateKey, signing.chain)
        const invalid = signPayloadWithChain(payload, signing.rootKeys.privateKey, signing.chain)
        const leafStatus = createOCSPResponse(signing.intermediateKeys.privateKey, { key: getKeyHash(signing.intermediate) }, [], getGoodSingleResponse(), signing.leaf, signing.intermediate)
        const intermediateStatus = createOCSPResponse(signing.rootKeys.privateKey, { key: getKeyHash(signing.root) }, [], getGoodSingleResponse(), signing.intermediate, signing.root)
        let releaseResponses!: () => void
        const pendingResponses = new Promise<void>(resolve => { releaseResponses = resolve })
        const fetch = jest.spyOn(globalThis, 'fetch').mockImplementation(async input => {
            const status = input === signing.intermediateUrl ? leafStatus : input === signing.rootUrl ? intermediateStatus : undefined
            if (status === undefined) throw new Error('Unexpected OCSP endpoint')
            await pendingResponses
            return new Response(Uint8Array.from(status), { headers: { 'Content-Type': 'application/ocsp-response' } })
        })

        await expect(verifier.verifyAndDecodeTransaction(invalid)).rejects.toMatchObject({ status: VerificationStatus.VERIFICATION_FAILURE })
        expect(fetch).toHaveBeenCalledTimes(0)
        const verification = verifier.verifyAndDecodeTransaction(signed)
        await Promise.resolve()
        const requestsBeforeResponses = fetch.mock.calls.map(([url, init]) => [url, init?.method, init?.redirect])
        releaseResponses()
        await expect(verification).resolves.toMatchObject(payload)
        expect(requestsBeforeResponses).toEqual([
            [signing.intermediateUrl, 'POST', 'manual'],
            [signing.rootUrl, 'POST', 'manual'],
        ])
        await expect(verifier.verifyAndDecodeTransaction(signed)).resolves.toMatchObject(payload)
        await expect(verifier.verifyAndDecodeTransaction(invalid)).rejects.toMatchObject({ status: VerificationStatus.VERIFICATION_FAILURE })
        expect(fetch).toHaveBeenCalledTimes(2)
    })

    it('should share a backend across new chains only when their OCSP endpoint sets match', async () => {
        const signing = createSigningChain()
        const verifier = new SignedDataVerifier([signing.root.raw], true, Environment.SANDBOX, 'com.example')
        const createBackend = jest.spyOn(verifier as unknown as { createBackend(endpoints: string[]): unknown }, 'createBackend')
        const payload = { bundleId: 'com.example', environment: Environment.SANDBOX }
        const sign = (cert: X509Certificate, key = signing.leafKeys.privateKey) =>
            signPayloadWithChain(payload, key, [cert.raw.toString('base64'), ...signing.chain.slice(1)])
        const respondForLeaf = (cert: X509Certificate) =>
            createOCSPResponse(signing.intermediateKeys.privateKey, { key: getKeyHash(signing.intermediate) }, [], getGoodSingleResponse(), cert, signing.intermediate)
        const responses = new Map([
            [signing.intermediateUrl, respondForLeaf(signing.leaf)],
            [signing.rootUrl, createOCSPResponse(signing.rootKeys.privateKey, { key: getKeyHash(signing.root) }, [], getGoodSingleResponse(), signing.intermediate, signing.root)],
        ])
        const fetch = jest.spyOn(globalThis, 'fetch').mockImplementation(async input => {
            const status = responses.get(String(input))
            if (status === undefined) throw new Error('Unexpected OCSP endpoint')
            return new Response(Uint8Array.from(status), { headers: { 'Content-Type': 'application/ocsp-response' } })
        })
        const original = sign(signing.leaf)
        await expect(verifier.verifyAndDecodeTransaction(original)).resolves.toMatchObject(payload)
        expect(createBackend).toHaveBeenCalledTimes(1)

        const replacement = signing.issueLeaf(13, signing.intermediateUrl)
        const replacementJws = sign(replacement)
        await expect(verifier.verifyAndDecodeTransaction(sign(replacement, signing.rootKeys.privateKey))).rejects.toMatchObject({
            status: VerificationStatus.VERIFICATION_FAILURE,
        })
        expect(fetch).toHaveBeenCalledTimes(2)
        responses.set(signing.intermediateUrl, respondForLeaf(replacement))
        await expect(verifier.verifyAndDecodeTransaction(replacementJws)).resolves.toMatchObject(payload)
        expect(createBackend).toHaveBeenCalledTimes(1)
        expect(fetch).toHaveBeenCalledTimes(4)
        await expect(verifier.verifyAndDecodeTransaction(original)).resolves.toMatchObject(payload)
        await expect(verifier.verifyAndDecodeTransaction(replacementJws)).resolves.toMatchObject(payload)
        expect(fetch).toHaveBeenCalledTimes(4)

        const rotatedUrl = 'http://ocsp.example.com/new-issuer'
        const rotated = signing.issueLeaf(14, rotatedUrl)
        responses.set(rotatedUrl, respondForLeaf(rotated))
        await expect(verifier.verifyAndDecodeTransaction(sign(rotated))).resolves.toMatchObject(payload)
        expect(createBackend.mock.calls).toEqual([
            [[signing.intermediateUrl, signing.rootUrl]],
            [[rotatedUrl, signing.rootUrl]],
        ])
        expect(fetch.mock.calls.slice(4).map(([url]) => url)).toEqual([rotatedUrl, signing.rootUrl])
    })

    it('should reject a redirect from an OCSP responder without following it', async () => {
        const signing = createSigningChain()
        const verifier = new SignedDataVerifier([signing.root.raw], true, Environment.SANDBOX, 'com.example')
        const signed = signPayloadWithChain({ bundleId: 'com.example', environment: Environment.SANDBOX }, signing.leafKeys.privateKey, signing.chain)
        const fetch = jest.spyOn(globalThis, 'fetch').mockImplementation(async () =>
            Response.redirect('https://other.example.com/ocsp', 302))

        await expect(verifier.verifyAndDecodeTransaction(signed)).rejects.toMatchObject({
            status: VerificationStatus.RETRYABLE_VERIFICATION_FAILURE,
            cause: { code: 'transport-error', cause: { message: 'OCSP responder returned HTTP 302' } },
        })
        expect(fetch.mock.calls.map(([url, init]) => [url, init?.redirect])).toEqual([
            [signing.intermediateUrl, 'manual'],
            [signing.rootUrl, 'manual'],
        ])
    })

    it('should accept a good OCSP response from a delegated responder', async () => {
        const spy = mockOCSPResponse(createOCSPResponse(responderKeys.privateKey, { key: getKeyHash(responder) }, [responder], getGoodSingleResponse()))
        await getVerifier().testCheckOCSPStatus(leaf, intermediate)
        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy.mock.calls[0][0]).toBe(OCSP_URL)
    })

    it('should accept a good OCSP response signed directly by the issuer', async () => {
        mockOCSPResponse(createOCSPResponse(intermediateKeys.privateKey, { key: getKeyHash(intermediate) }, [], getGoodSingleResponse()))
        await getVerifier().testCheckOCSPStatus(leaf, intermediate)
    })

    it('should accept a good OCSP response from a responder identified by name', async () => {
        mockOCSPResponse(createOCSPResponse(responderKeys.privateKey, { name: { str: '/CN=Test OCSP Responder' } }, [responder], getGoodSingleResponse()))
        await getVerifier().testCheckOCSPStatus(leaf, intermediate)
    })

    it('should reject OCSP response dates with fractional seconds under RFC 6960', async () => {
        mockOCSPResponse(createOCSPResponse(responderKeys.privateKey, { key: getKeyHash(responder) }, [responder], {
            status: { status: 'good' },
            thisupdate: toGeneralizedTime(new Date(Date.now() - ONE_HOUR)).replace('Z', '.5Z'),
            nextupdate: toGeneralizedTime(new Date(Date.now() + ONE_HOUR)).replace('Z', '.25Z')
        }))
        await expectOCSPFailure(VerificationStatus.FAILURE)
    })

    it('should reject an OCSP response after its next update time', async () => {
        mockOCSPResponse(createOCSPResponse(responderKeys.privateKey, { key: getKeyHash(responder) }, [responder], {
            status: { status: 'good' },
            thisupdate: toGeneralizedTime(new Date(Date.now() - 2 * ONE_HOUR)),
            nextupdate: toGeneralizedTime(new Date(Date.now() - ONE_HOUR))
        }))
        await expectOCSPFailure(VerificationStatus.FAILURE)
    })

    it('should reject an OCSP response with a this update time in the future', async () => {
        mockOCSPResponse(createOCSPResponse(responderKeys.privateKey, { key: getKeyHash(responder) }, [responder], {
            status: { status: 'good' },
            thisupdate: toGeneralizedTime(new Date(Date.now() + ONE_HOUR)),
            nextupdate: toGeneralizedTime(new Date(Date.now() + 2 * ONE_HOUR))
        }))
        await expectOCSPFailure(VerificationStatus.FAILURE)
    })

    it('should reject an OCSP response without a next update time', async () => {
        mockOCSPResponse(createOCSPResponse(responderKeys.privateKey, { key: getKeyHash(responder) }, [responder], {
            status: { status: 'good' },
            thisupdate: toGeneralizedTime(new Date(Date.now() - ONE_HOUR))
        }))
        await expectOCSPFailure(VerificationStatus.FAILURE)
    })

    it('should reject a revoked certificate', async () => {
        mockOCSPResponse(createOCSPResponse(responderKeys.privateKey, { key: getKeyHash(responder) }, [responder], {
            ...getGoodSingleResponse(),
            status: { status: 'revoked', time: toGeneralizedTime(new Date(Date.now() - ONE_HOUR)) }
        }))
        await expectOCSPFailure(VerificationStatus.FAILURE)
    })

    it('should reject an OCSP response with an invalid signature', async () => {
        mockOCSPResponse(createOCSPResponse(leafKeys.privateKey, { key: getKeyHash(responder) }, [responder], getGoodSingleResponse()))
        await expectOCSPFailure(VerificationStatus.FAILURE)
    })

    it('should reject an OCSP response from a responder without the OCSP signing purpose', async () => {
        mockOCSPResponse(createOCSPResponse(responderKeys.privateKey, { key: getKeyHash(responderWithoutOCSPSigning) }, [responderWithoutOCSPSigning], getGoodSingleResponse()))
        await expectOCSPFailure(VerificationStatus.INVALID_CERTIFICATE)
    })

    it('should reject an OCSP response from a responder without an extended key usage', async () => {
        mockOCSPResponse(createOCSPResponse(responderKeys.privateKey, { key: getKeyHash(responderWithoutExtendedKeyUsage) }, [responderWithoutExtendedKeyUsage], getGoodSingleResponse()))
        await expectOCSPFailure(VerificationStatus.INVALID_CERTIFICATE)
    })

    it('should return a retryable failure when the OCSP responder returns an error', async () => {
        mockOCSPResponse(Buffer.from(''), 500)
        await expectOCSPFailure(VerificationStatus.RETRYABLE_VERIFICATION_FAILURE)
    })

    it('should return a retryable failure when the OCSP responder cannot be reached', async () => {
        jest.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.reject(new Error("Network error")))
        await expectOCSPFailure(VerificationStatus.RETRYABLE_VERIFICATION_FAILURE)
    })
});
