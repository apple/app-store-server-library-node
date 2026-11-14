// Copyright (c) 2023 Apple Inc. Licensed under MIT License.

describe('jsrsasign loading', () => {
    it('does not load jsrsasign while importing the public library', () => {
        jest.isolateModules(() => {
            jest.doMock('jsrsasign', () => {
                throw new Error('jsrsasign was loaded during module initialization')
            }, { virtual: true })

            expect(() => require('../../index')).not.toThrow()
        })
    })
})
