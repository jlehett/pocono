import React from 'react';
import { render } from '@testing-library/react';
import If from './index';
import { createRenderCycleTest } from '../../tests/perf-utils/render-cycle-testing';

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

    describe('when the If expression evaluates to false', () => {
        const { queryByText } = render(
            <If expr={false}>
                <div>If False</div>
            </If>,
        );

        expect(queryByText('If False')).not.toBeInTheDocument();
    });

    describe('when nesting If components', () => {
        it('should render render the children of If components w/ `expr` evaluating to `true', () => {
            const { queryByText } = render(
                <>
                    <If expr={true}>
                        <If expr={true}>TT</If>
                        <If expr={false}>TF</If>
                    </If>
                    <If expr={false}>
                        <If expr={true}>FT</If>
                        <If expr={false}>FF</If>
                    </If>
                </>,
            );

            expect(queryByText('TT')).toBeInTheDocument();
            expect(queryByText('TF')).not.toBeInTheDocument();
            expect(queryByText('FT')).not.toBeInTheDocument();
            expect(queryByText('FF')).not.toBeInTheDocument();
        });
    });

    describe('when used in a component that re-renders', () => {
        it('should re-render without unmounting / remounting when the container re-renders', () => {
            const {
                renderTracker,
                mountTracker,
                unmountTracker,
                updateContainer,
            } = createRenderCycleTest((RenderTracker) => () => (
                <If expr={true}>
                    <RenderTracker />
                </If>
            ));

            expect(renderTracker).toHaveBeenCalledTimes(1);
            expect(mountTracker).toHaveBeenCalledTimes(1);
            expect(unmountTracker).not.toHaveBeenCalled();

            updateContainer();

            expect(renderTracker).toHaveBeenCalledTimes(2);
            expect(mountTracker).toHaveBeenCalledTimes(1);
            expect(unmountTracker).not.toHaveBeenCalled();
        });

        it('should unmount / remount the If children when the `expr` prop changes', () => {
            const {
                renderTracker,
                mountTracker,
                unmountTracker,
                updateContainer,
            } = createRenderCycleTest(
                (RenderTracker) =>
                    ({ containerValue }) => (
                        <If expr={Boolean(containerValue)}>
                            <RenderTracker />
                        </If>
                    ),
                1,
                (prev) => {
                    switch (prev) {
                        case 1:
                            return 2;
                        default:
                            return 0;
                    }
                },
            );

            expect(renderTracker).toHaveBeenCalledTimes(1);
            expect(mountTracker).toHaveBeenCalledTimes(1);
            expect(unmountTracker).not.toHaveBeenCalled();

            updateContainer();

            expect(renderTracker).toHaveBeenCalledTimes(2);
            expect(mountTracker).toHaveBeenCalledTimes(1);
            expect(unmountTracker).toHaveBeenCalledTimes(0);

            updateContainer();

            expect(renderTracker).toHaveBeenCalledTimes(2);
            expect(mountTracker).toHaveBeenCalledTimes(1);
            expect(unmountTracker).toHaveBeenCalledTimes(1);
        });
    });
});
