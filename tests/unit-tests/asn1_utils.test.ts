// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { GeneralizedTime, OctetString, Sequence, Set, Utf8String } from 'asn1js';
import { certificateExtensions, parseASN1, parseCertificate, parseOctetString } from '../../asn1_utils';
import { ReceiptUtility } from '../../receipt_utility';
import { createOCSPFixtures, createTestCertificate, extension } from '../ocsp_fixtures';

describe('ASN.1 parsing', () => {
    it.each(['3000ff', '308100', '30820000', '30800000', '3003020201', '03020301'])('rejects malformed DER %s', hex => {
        expect(() => parseASN1(Buffer.from(hex, 'hex'))).toThrow()
    })

    it('allows BER indefinite length for receipts', () => {
        expect(parseASN1(Buffer.from('318030000000', 'hex'), false)).toBeInstanceOf(Set)
    })

    it.each(['20260230120000Z', '20261301120000Z', '20261014250000Z', '20261014120000', '20261014120000+0100'])('rejects invalid GeneralizedTime %s', text => {
        expect(() => parseASN1(Buffer.concat([Buffer.from([24, text.length]), Buffer.from(text)]))).toThrow()
    })

    it('accepts a UTC leap day independently of the process timezone', () => {
        const text = '20240229120000Z'
        const parsed = parseASN1(Buffer.concat([Buffer.from([24, text.length]), Buffer.from(text)])) as GeneralizedTime
        expect(parsed.toDate().toISOString()).toEqual('2024-02-29T12:00:00.000Z')
    })

    it('rejects duplicate certificate extensions', () => {
        const duplicate = extension('1.2.3.4', new Uint8Array([5, 0]).buffer)
        const cert = createTestCertificate('Duplicate', 10, undefined, [duplicate, duplicate])
        expect(() => parseCertificate(cert.certificate.raw)).toThrow('Duplicate')
        expect(() => certificateExtensions(cert.certificate.raw)).toThrow('Duplicate')
    })

    it('rejects trailing certificate bytes', () => {
        const { root } = createOCSPFixtures()
        expect(() => parseCertificate(Buffer.concat([root.certificate.raw, Buffer.from([0])]))).toThrow()
    })

    it.each(['', 'MAA=', 'MIAAAA==', 'AAAA'])('throws for an invalid receipt %s', receipt => {
        expect(() => new ReceiptUtility().extractTransactionIdFromAppReceipt(receipt)).toThrow()
    })

    it('limits nesting of untrusted ASN.1', () => {
        let value: Sequence = new Sequence()
        for (let i = 0; i < 110; i++) value = new Sequence({ value: [value] })
        expect(() => parseASN1(new Uint8Array(value.toBER()))).toThrow()
    })

    it.each(['', '3000ff', '308100', '30800000', '03020301'])('rejects invalid encapsulated DER %s', hex => {
        const octet = new OctetString({ valueHex: new Uint8Array(Buffer.from(hex, 'hex')).buffer })
        const parsed = parseASN1(new Uint8Array(octet.toBER()), false)
        expect(() => parseOctetString(parsed)).toThrow()
    })

    it('rechecks the calendar date of an already decoded encapsulated value', () => {
        const text = '20260230120000Z'
        const octet = new OctetString({ valueHex: new Uint8Array(Buffer.concat([Buffer.from([24, text.length]), Buffer.from(text)])).buffer })
        const parsed = parseASN1(new Uint8Array(octet.toBER()), false)
        expect(() => parseOctetString(parsed)).toThrow('calendar')
    })

    it.each([1, 2])('decodes a constructed OCTET STRING containing %s chunks', chunks => {
        const payload = new Uint8Array(new Utf8String({ value: 'transaction' }).toBER())
        const value = chunks === 1 ? [new OctetString({ valueHex: payload.buffer })] :
            [new OctetString({ valueHex: payload.slice(0, 3).buffer }), new OctetString({ valueHex: payload.slice(3).buffer })]
        const octet = new OctetString({ isConstructed: true, value })
        const parsed = parseASN1(new Uint8Array(octet.toBER()), false)
        expect((parseOctetString(parsed, false) as Utf8String).valueBlock.value).toEqual('transaction')
    })

    it('rejects constructed OCTET STRING payloads with trailing bytes', () => {
        const chunk = new OctetString({ valueHex: new Uint8Array([48, 0, 255]).buffer })
        const octet = new OctetString({ isConstructed: true, value: [chunk] })
        const parsed = parseASN1(new Uint8Array(octet.toBER()), false)
        expect(() => parseOctetString(parsed, false)).toThrow()
    })

    it('rejects a non-OCTET encapsulation', () => {
        expect(() => parseOctetString(new Sequence())).toThrow()
    })
})
