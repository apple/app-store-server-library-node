// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import * as fs from 'fs';
import { Environment } from '../models/Environment';
import { SignedDataVerifier } from '../jws_verification';
import { ECKeyPairOptions, generateKeyPairSync, sign } from 'crypto';

export function readFile(path: string): string {
    return fs.readFileSync(path, {
        encoding: 'utf8'
    })
}

export function readBytes(path: string): Buffer {
    return fs.readFileSync(path)
}

export function getSignedPayloadVerifier(environment: Environment, bundleId: string, appAppleId: number): SignedDataVerifier {
    return new SignedDataVerifier([readBytes('tests/resources/certs/testCA.der')], false, environment, bundleId, appAppleId)
}

export function getSignedPayloadVerifierWithDefaultAppAppleId(environment: Environment, bundleId: string): SignedDataVerifier {
    return getSignedPayloadVerifier(environment, bundleId, 1234)
}

export function getDefaultSignedPayloadVerifier(): SignedDataVerifier {
    return getSignedPayloadVerifierWithDefaultAppAppleId(Environment.LOCAL_TESTING, "com.example")
}

export function createSignedDataFromJson(path: string): string {
    const fileContents = readFile(path)
    const keyPairOptions: ECKeyPairOptions = {
        namedCurve: 'prime256v1',
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    }
    const keypair = generateKeyPairSync("ec", keyPairOptions)
    // When PEM encoding was selected, the respective key will be a string, otherwise it will be a buffer containing the data encoded as DER.
    const privateKey = keypair.privateKey as string
    const header = { alg: 'ES256', typ: 'JWT' }
    const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url')
    const payloadB64 = Buffer.from(fileContents).toString('base64url')
    const signingInput = `${headerB64}.${payloadB64}`
    const signature = sign('SHA256', Buffer.from(signingInput), {
        key: privateKey,
        dsaEncoding: 'ieee-p1363'
    }).toString('base64url')
    return `${signingInput}.${signature}`
}