// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import * as fs from 'fs';
import { Environment } from '../models/Environment';
import { SignedDataVerifier } from '../jwt_verification';
import { ECKeyPairOptions, generateKeyPairSync } from 'crypto';
import jsonwebtoken = require('jsonwebtoken');

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
    const keyPairOptions: ECKeyPairOptions<'pem', 'pem'> = {
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
    const privateKey = keypair.privateKey
    return jsonwebtoken.sign(fileContents, privateKey, { algorithm: 'ES256'});
}