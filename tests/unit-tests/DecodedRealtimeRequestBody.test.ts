// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { Environment } from "../../models/Environment";
import { createSignedDataFromJson, getDefaultSignedPayloadVerifier } from "../util";

describe('DecodedRealtimeRequestBody', () => {
    it('should decode a realtime request', async () => {
        const signedRealtimeRequest = createSignedDataFromJson("tests/resources/models/decodedRealtimeRequest.json")

        const request = await getDefaultSignedPayloadVerifier().verifyAndDecodeRealtimeRequest(signedRealtimeRequest)

        expect("99371282").toBe(request.originalTransactionId)
        expect(531412).toBe(request.appAppleId)
        expect("com.example.product").toBe(request.productId)
        expect("en-US").toBe(request.userLocale)
        expect("3db5c98d-8acf-4e29-831e-8e1f82f9f6e9").toBe(request.requestIdentifier)
        expect(Environment.LOCAL_TESTING).toBe(request.environment)
        expect(1698148900000).toBe(request.signedDate)
    })
})
