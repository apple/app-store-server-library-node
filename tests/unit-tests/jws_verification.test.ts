// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import assert = require("assert");
import { KeyObject, X509Certificate } from "crypto";
import { SignedDataVerifier, VerificationException, VerificationStatus } from "../../jws_verification";
import { Environment } from "../../models/Environment";
import { readFile, getSignedPayloadVerifierWithDefaultAppAppleId, getDefaultSignedPayloadVerifier } from "../util";

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

    getRootCertificates() {
        return this.rootCertificates
    } 
}

describe("Chain Verification Checks", () => {
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
        jest.setSystemTime(CLOCK_DATE + 15 * 60 * 1_000) // 15 minutes
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
        jest.setSystemTime(CLOCK_DATE + 15 * 60 * 1_000) // 15 minutes
        await verifier.testVerifyCertificateChain(verifier.getRootCertificates(), LEAF_CERT_BASE64_ENCODED, REAL_APPLE_INTERMEDIATE_BASE64_ENCODED)
        expect(spy).toHaveBeenCalledTimes(2);
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })
})

describe("Decoding checks", () => {
    it('should fail to verify with a missing x5c header', async () => {
        const verifier = getSignedPayloadVerifierWithDefaultAppAppleId(Environment.PRODUCTION, "com.example")
        try {
            const missingX5CHeaderClaim = readFile('tests/resources/mock_signed_data/missingX5CHeaderClaim')
            await verifier.verifyAndDecodeNotification(missingX5CHeaderClaim)
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
            const verifier = getSignedPayloadVerifierWithDefaultAppAppleId(Environment.SANDBOX, "com.example.x")
            const transactionInfo = readFile('tests/resources/mock_signed_data/transactionInfo')
            await verifier.verifyAndDecodeTransaction(transactionInfo)
            assert(false)
        } catch (e) {
            expect(e).toBeInstanceOf(VerificationException)
            expect((e as VerificationException).status).toEqual(VerificationStatus.INVALID_APP_IDENTIFIER)
        }
    })

    it('should fail to verify with an invalid environment', async () => {
        try {
            const verifier = getSignedPayloadVerifierWithDefaultAppAppleId(Environment.PRODUCTION, "com.example")
            const testNotification = readFile('tests/resources/mock_signed_data/testNotification')
            const notification = await verifier.verifyAndDecodeNotification(testNotification)
            await verifier.verifyAndDecodeNotification(testNotification)
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
        const verifier = getSignedPayloadVerifierWithDefaultAppAppleId(Environment.SANDBOX, "com.example")
        const testNotification = readFile('tests/resources/mock_signed_data/testNotification')
        const notification = await verifier.verifyAndDecodeNotification(testNotification)
        expect(notification.notificationType).toEqual("TEST")
    })

    it('should verify and decode a valid renewal info', async () => {
        const verifier =getSignedPayloadVerifierWithDefaultAppAppleId(Environment.SANDBOX, "com.example")

        const renewalInfo = readFile('tests/resources/mock_signed_data/renewalInfo')
        const notification = await verifier.verifyAndDecodeRenewalInfo(renewalInfo)
        expect(notification.environment).toEqual(Environment.SANDBOX)
    })

    it('should verify and decode a valid transaction info', async () => {
        const verifier = getSignedPayloadVerifierWithDefaultAppAppleId(Environment.SANDBOX, "com.example")

        const transactionInfo = readFile('tests/resources/mock_signed_data/transactionInfo')
        const notification = await verifier.verifyAndDecodeRenewalInfo(transactionInfo)
        expect(notification.environment).toEqual(Environment.SANDBOX)
    })
});