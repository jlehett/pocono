import React from 'react';
import { render } from '@testing-library/react';
import If from './index';

describe('If', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });
});
