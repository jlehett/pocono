import React from 'react';
import { render } from '@testing-library/react';
import Switch from './index';
import { createRenderCycleTest } from '../../tests/perf-utils/render-cycle-testing';

describe('Switch', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn());
    });

    describe('when a matching case exists', () => {
        const getScenario = () =>
            render(
                <Switch expr={2}>
                    <Switch.Case value={1}>One</Switch.Case>
                    <Switch.Case value={2}>Two</Switch.Case>
                    <Switch.Case value={2}>Two Copy</Switch.Case>
                    <Switch.Case value={3}>Three</Switch.Case>
                    <Switch.Default>Default</Switch.Default>
                </Switch>,
            );

        it('should render the first matching case', () => {
            const { queryByText } = getScenario();
            expect(queryByText('Two')).toBeInTheDocument();
        });

        it('should not render any other cases', () => {
            const { queryByText } = getScenario();
            expect(queryByText('One')).not.toBeInTheDocument();
            expect(queryByText('Two Copy')).not.toBeInTheDocument();
            expect(queryByText('Three')).not.toBeInTheDocument();
            expect(queryByText('Default')).not.toBeInTheDocument();
        });
    });

    describe('when no matching case exists', () => {
        describe('and a default case exists', () => {
            const getScenario = () =>
                render(
                    <Switch expr={4}>
                        <Switch.Case value={1}>One</Switch.Case>
                        <Switch.Case value={2}>Two</Switch.Case>
                        <Switch.Case value={3}>Three</Switch.Case>
                        <Switch.Default>Default</Switch.Default>
                    </Switch>,
                );

            it('should render the default case', () => {
                const { queryByText } = getScenario();
                expect(queryByText('Default')).toBeInTheDocument();
            });

            it('should not render any other cases', () => {
                const { queryByText } = getScenario();
                expect(queryByText('One')).not.toBeInTheDocument();
                expect(queryByText('Two')).not.toBeInTheDocument();
                expect(queryByText('Three')).not.toBeInTheDocument();
            });
        });

        describe('and no default case exists', () => {
            const getScenario = () =>
                render(
                    <Switch expr={4}>
                        <Switch.Case value={1}>One</Switch.Case>
                        <Switch.Case value={2}>Two</Switch.Case>
                        <Switch.Case value={3}>Three</Switch.Case>
                    </Switch>,
                );

            it('should not render anything', () => {
                const { queryByText } = getScenario();
                expect(queryByText('One')).not.toBeInTheDocument();
                expect(queryByText('Two')).not.toBeInTheDocument();
                expect(queryByText('Three')).not.toBeInTheDocument();
            });
        });
    });

    describe('when no cases exist', () => {
        describe('and a default case exists', () => {
            const getScenario = () =>
                render(
                    <Switch expr={4}>
                        <Switch.Default>Default</Switch.Default>
                    </Switch>,
                );

            it('should render the default case', () => {
                const { queryByText } = getScenario();
                expect(queryByText('Default')).toBeInTheDocument();
            });
        });
    });

    describe('when non-case children exist', () => {
        const getScenario = () =>
            render(
                <Switch expr={2}>
                    <div>Hi</div>
                    <Switch.Case value={2}>Two</Switch.Case>
                </Switch>,
            );

        it('should throw an error', () => {
            expect(getScenario).toThrow();
        });
    });

    describe('when contains multiple default cases', () => {
        const getScenario = () =>
            render(
                <Switch expr={4}>
                    <Switch.Case value={1}>One</Switch.Case>
                    <Switch.Case value={2}>Two</Switch.Case>
                    <Switch.Case value={3}>Three</Switch.Case>
                    <Switch.Default>Default One</Switch.Default>
                    <Switch.Default>Default Two</Switch.Default>
                </Switch>,
            );

        it('should throw an error', () => {
            expect(getScenario).toThrow();
        });
    });

    describe('when contains nested cases', () => {
        const getScenario = () =>
            render(
                <Switch expr={1}>
                    <Switch.Case value={1}>
                        One
                        <Switch.Case value={2}>Two</Switch.Case>
                    </Switch.Case>
                    <Switch.Default>Default</Switch.Default>
                </Switch>,
            );

        it('should throw an error', () => {
            expect(getScenario).toThrow();
        });
    });

    describe('when nesting switches', () => {
        const getScenario = () =>
            render(
                <Switch expr={2}>
                    <Switch.Case value={1}>
                        <Switch expr={1}>
                            <Switch.Case value={1}>O1I1</Switch.Case>
                            <Switch.Case value={2}>O1I2</Switch.Case>
                        </Switch>
                    </Switch.Case>
                    <Switch.Case value={2}>
                        <Switch expr={1}>
                            <Switch.Case value={1}>O2I1</Switch.Case>
                            <Switch.Case value={2}>O2I2</Switch.Case>
                        </Switch>
                    </Switch.Case>
                </Switch>,
            );

        it("should render the matching case of the inner switch found in the outer switch's matching case", () => {
            const { queryByText } = getScenario();
            expect(queryByText('O1I1')).not.toBeInTheDocument();
            expect(queryByText('O1I2')).not.toBeInTheDocument();
            expect(queryByText('O2I1')).toBeInTheDocument();
            expect(queryByText('O2I2')).not.toBeInTheDocument();
        });
    });

    describe('when used in a component that re-renders', () => {
        it('should re-render without unmounting / remounting the case content when the container re-renders', () => {
            const {
                renderTracker,
                mountTracker,
                unmountTracker,
                updateContainer,
            } = createRenderCycleTest((RenderTracker) => () => (
                <Switch expr={1}>
                    <Switch.Case value={1}>
                        <RenderTracker />
                    </Switch.Case>
                </Switch>
            ));

            expect(renderTracker).toHaveBeenCalledTimes(1);
            expect(mountTracker).toHaveBeenCalledTimes(1);
            expect(unmountTracker).not.toHaveBeenCalled();

            updateContainer();

            expect(renderTracker).toHaveBeenCalledTimes(2);
            expect(mountTracker).toHaveBeenCalledTimes(1);
            expect(unmountTracker).not.toHaveBeenCalled();
        });

        it('should unmount / remount the case content when the case changes', () => {
            const {
                renderTracker,
                mountTracker,
                unmountTracker,
                updateContainer,
            } = createRenderCycleTest(
                (RenderTracker) =>
                    ({ containerValue }) => (
                        <Switch expr={containerValue}>
                            <Switch.Case value={1}>
                                <RenderTracker id={1} />
                            </Switch.Case>
                            <Switch.Case value={2}>
                                <RenderTracker id={2} />
                            </Switch.Case>
                        </Switch>
                    ),
                1,
                (prev) => (prev === 1 ? 2 : 1),
            );

            expect(renderTracker).toHaveBeenCalledTimes(1);
            expect(renderTracker).toHaveBeenCalledWith(1);
            expect(mountTracker).toHaveBeenCalledTimes(1);
            expect(mountTracker).toHaveBeenCalledWith(1);
            expect(unmountTracker).not.toHaveBeenCalled();

            updateContainer();

            expect(renderTracker).toHaveBeenCalledTimes(2);
            expect(renderTracker).toHaveBeenCalledWith(2);
            expect(mountTracker).toHaveBeenCalledTimes(2);
            expect(mountTracker).toHaveBeenCalledWith(2);
            expect(unmountTracker).toHaveBeenCalledTimes(1);
            expect(unmountTracker).toHaveBeenCalledWith(1);
        });
    });

    describe('when rendering a Switch subcomponent and the direct parent is NOT a Cond element', () => {
        const subcomponents = [
            { name: 'Case', component: Switch.Case, props: { value: 1 } },
            { name: 'Default', component: Switch.Default, props: {} },
        ];

        it.each(subcomponents)(
            'should throw an error when rendering $name',
            ({ component: Subcomponent, props }) => {
                const getScenario = () =>
                    render(
                        <div>
                            <Subcomponent {...(props as any)}>
                                Test
                            </Subcomponent>
                        </div>,
                    );

                expect(getScenario).toThrow();
            },
        );
    });
});
