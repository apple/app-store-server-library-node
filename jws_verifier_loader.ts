// Copyright (c) 2026 Apple Inc. Licensed under MIT License.

import type { VerificationError } from '@preeternal/jws-verifier'

type VerifierModule = typeof import('@preeternal/jws-verifier')
let verifierModule: VerifierModule | undefined

// Defer initialization until verification or receipt parsing needs it.
// ReceiptUtility's public methods are synchronous.
export function getVerifierModule(): VerifierModule {
    return verifierModule ??= require('@preeternal/jws-verifier')
}

export function isVerifierError(error: unknown): error is VerificationError {
    return verifierModule !== undefined && error instanceof verifierModule.VerificationError
}
