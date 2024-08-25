import coreJestConfig from '../core/jest.config.js';

export default {
    ...coreJestConfig,
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
    },
};
