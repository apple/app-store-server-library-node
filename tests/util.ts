// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

import * as fs from 'fs';
import { Environment } from '../models/Environment';
import { SignedDataVerifier } from '../jws_verification';
import { ECKeyPairOptions, generateKeyPairSync } from 'crypto';
import jsonwebtoken = require('jsonwebtoken');
import { Validator } from '../models/Validator';

export type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T]

export type Equals<A, B> = (<X>() => X extends A ? 1 : 2) extends (<X>() => X extends B ? 1 : 2) ? true : false

export function expectRequestBodyValidation(validator: Validator<unknown>, completeBody: () => any, requiredKeys: string[]) {
    expect(validator.validate(completeBody())).toBe(true)
    const keys = Object.keys(completeBody())
    expect(keys).toEqual(expect.arrayContaining(requiredKeys))
    for (const key of keys) {
        const body = completeBody()
        delete body[key]
        expect([key, validator.validate(body)]).toEqual([key, !requiredKeys.includes(key)])
    }
    for (const key of keys) {
        const nullValue = completeBody()
        nullValue[key] = null
        expect([key, validator.validate(nullValue)]).toEqual([key, false])
        const wrongType = completeBody()
        wrongType[key] = typeof wrongType[key] === 'number' ? String(wrongType[key]) : 1
        expect([key, validator.validate(wrongType)]).toEqual([key, false])
    }
    expect(validator.validate(null)).toBe(false)
    expect(validator.validate(undefined)).toBe(false)
    expect(validator.validate("body")).toBe(false)
}

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
    return createSignedData(readFile(path))
}

export function createSignedDataFromObject(payload: object): string {
    return createSignedData(JSON.stringify(payload))
}

function createSignedData(payload: string): string {
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
    return jsonwebtoken.sign(payload, privateKey, { algorithm: 'ES256'});
}