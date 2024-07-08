import React from 'react';
import { render } from '@testing-library/react';
import If from './index';

describe('If', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    describe('when the If expression evaluates to true', () => {
        it('should render the If children', () => {
            const { queryByText } = render(
                <If expr={true}>
                    <div>If True</div>
                </If>,
            );

            expect(queryByText('If True')).toBeInTheDocument();
        });
    });
});
