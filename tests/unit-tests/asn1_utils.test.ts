// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import { GeneralizedTime, Sequence, Set } from 'asn1js';
import { certificateExtensions, parseASN1, parseCertificate } from '../../asn1_utils';
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
})
