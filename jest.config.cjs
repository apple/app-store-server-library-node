module.exports = {
    transform: {
        '^.+\\.[jt]s$': ['ts-jest', { tsconfig: { allowJs: true, isolatedModules: true } }],
    },
    transformIgnorePatterns: ['/node_modules/(?!@preeternal/jws-verifier/)'],
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
