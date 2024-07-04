import esmJestConfig from '../../configs/esm/jest.config.js';

export default {
    ...esmJestConfig,
    setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
};
