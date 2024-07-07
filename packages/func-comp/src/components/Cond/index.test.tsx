import React from 'react';
import { render } from '@testing-library/react';
import Cond from './index';
import { createRenderCycleTest } from '../../tests/perf-utils/render-cycle-testing';

describe('Cond', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    describe('when the Cond.If expression evaluates to true', () => {
        it('should render the Cond.If children', () => {
            const { queryByText } = render(
                <Cond>
                    <Cond.If expr={true}>
                        <div>If True</div>
                    </Cond.If>
                </Cond>,
            );

            expect(queryByText('If True')).toBeInTheDocument();
        });

        it('should not render the Cond.ElseIf children', () => {
            const { queryByText } = render(
                <Cond>
                    <Cond.If expr={true}>
                        <div>If True</div>
                    </Cond.If>
                    <Cond.ElseIf expr={true}>
                        <div>ElseIf True</div>
                    </Cond.ElseIf>
                </Cond>,
            );

            expect(queryByText('If True')).toBeInTheDocument();
            expect(queryByText('ElseIf True')).not.toBeInTheDocument();
        });

        it('should not render the Cond.Else children', () => {
            const { queryByText } = render(
                <Cond>
                    <Cond.If expr={true}>
                        <div>If True</div>
                    </Cond.If>
                    <Cond.Else>
                        <div>Else</div>
                    </Cond.Else>
                </Cond>,
            );

            expect(queryByText('If True')).toBeInTheDocument();
            expect(queryByText('Else')).not.toBeInTheDocument();
        });
    });

    describe('when the Cond.If expression evaluates to false', () => {
        describe('and there are no Cond.ElseIf components', () => {
            describe('and there is a Cond.Else component', () => {
                const getScenario = () =>
                    render(
                        <Cond>
                            <Cond.If expr={false}>
                                <div>If True</div>
                            </Cond.If>
                            <Cond.Else>
                                <div>Else</div>
                            </Cond.Else>
                        </Cond>,
                    );

                it('should render the Cond.Else children', () => {
                    const { queryByText } = getScenario();
                    expect(queryByText('Else')).toBeInTheDocument();
                });

                it('should not render any other children', () => {
                    const { queryByText } = getScenario();
                    expect(queryByText('If True')).not.toBeInTheDocument();
                });
            });

            describe('and there is no Cond.Else component', () => {
                it('should not render anything', () => {
                    const { queryByText } = render(
                        <Cond>
                            <Cond.If expr={false}>
                                <div>If True</div>
                            </Cond.If>
                        </Cond>,
                    );

                    expect(queryByText('If True')).not.toBeInTheDocument();
                });
            });
        });

        describe('and there are Cond.ElseIf components', () => {
            const getScenario = () =>
                render(
                    <Cond>
                        <Cond.If expr={false}>
                            <div>If True</div>
                        </Cond.If>
                        <Cond.ElseIf expr={false}>
                            <div>ElseIf False</div>
                        </Cond.ElseIf>
                        <Cond.ElseIf expr={true}>
                            <div>ElseIf True</div>
                        </Cond.ElseIf>
                    </Cond>,
                );

            it('should render the Cond.ElseIf children of the first Cond.ElseIf whose expression evaluates to true', () => {
                const { queryByText } = getScenario();
                expect(queryByText('ElseIf True')).toBeInTheDocument();
            });

            it('should not render any other children', () => {
                const { queryByText } = getScenario();
                expect(queryByText('If True')).not.toBeInTheDocument();
                expect(queryByText('ElseIf False')).not.toBeInTheDocument();
            });
        });
    });

    describe('when there is no Cond.If child', () => {
        const getScenario = () =>
            render(
                <Cond>
                    <div>Test</div>
                </Cond>,
            );

        it('should throw an error', () => {
            expect(getScenario).toThrow();
        });
    });

    describe('when multiple Cond.If children exist', () => {
        const getScenario = () =>
            render(
                <Cond>
                    <Cond.If expr={true}>If True 1</Cond.If>
                    <Cond.If expr={true}>If True 2</Cond.If>
                </Cond>,
            );

        it('should throw an error', () => {
            expect(getScenario).toThrow();
        });
    });

    describe('when the Cond.If child is not the first child', () => {
        const getScenario = () =>
            render(
                <Cond>
                    <Cond.ElseIf expr={true}>Else If True</Cond.ElseIf>
                    <Cond.If expr={true}>If True</Cond.If>
                </Cond>,
            );

        it('should throw an error', () => {
            expect(getScenario).toThrow();
        });
    });

    describe('when multiple Cond.Else children exist', () => {
        const getScenario = () =>
            render(
                <Cond>
                    <Cond.If expr={true}>If True</Cond.If>
                    <Cond.Else>Else 1</Cond.Else>
                    <Cond.Else>Else 2</Cond.Else>
                </Cond>,
            );

        it('should throw an error', () => {
            expect(getScenario).toThrow();
        });
    });

    describe('when a Cond.Else child exists but is not the last child', () => {
        const getScenario = () =>
            render(
                <Cond>
                    <Cond.If expr={true}>If True</Cond.If>
                    <Cond.Else>Else</Cond.Else>
                    <Cond.ElseIf expr={true}>Else If True</Cond.ElseIf>
                </Cond>,
            );

        it('should throw an error', () => {
            expect(getScenario).toThrow();
        });
    });

    describe("when a child exists that isn't a valid Cond subcomponent", () => {
        const getScenario = () =>
            render(
                <Cond>
                    <Cond.If expr={true}>If True</Cond.If>
                    <div>Invalid Child</div>
                    <Cond.Else>Else True</Cond.Else>
                </Cond>,
            );

        it('should throw an error', () => {
            expect(getScenario).toThrow();
        });
    });

    describe('when nesting conds', () => {
        const getScenario = () =>
            render(
                <Cond>
                    <Cond.If expr={false}>
                        <Cond>
                            <Cond.If expr={false}>OFIF</Cond.If>
                            <Cond.Else>OFIT</Cond.Else>
                        </Cond>
                    </Cond.If>
                    <Cond.Else>
                        <Cond>
                            <Cond.If expr={true}>OTIT</Cond.If>
                            <Cond.Else>OTIF</Cond.Else>
                        </Cond>
                    </Cond.Else>
                </Cond>,
            );

        it("should render the passing subcomponent of the inner Cond found in the outer Cond's passing subcomponent", () => {
            const { queryByText } = getScenario();
            expect(queryByText('OFIF')).not.toBeInTheDocument();
            expect(queryByText('OFIT')).not.toBeInTheDocument();
            expect(queryByText('OTIF')).not.toBeInTheDocument();
            expect(queryByText('OTIT')).toBeInTheDocument();
        });
    });

    describe('when used in a component that re-renders', () => {
        it('should re-render without unmounting / remounting the passing Cond subcomponent when the container re-renders', () => {
            const {
                renderTracker,
                mountTracker,
                unmountTracker,
                updateContainer,
            } = createRenderCycleTest((RenderTracker) => () => (
                <Cond>
                    <Cond.If expr={true}>
                        <RenderTracker />
                    </Cond.If>
                </Cond>
            ));

            expect(renderTracker).toHaveBeenCalledTimes(1);
            expect(mountTracker).toHaveBeenCalledTimes(1);
            expect(unmountTracker).not.toHaveBeenCalled();

            updateContainer();

            expect(renderTracker).toHaveBeenCalledTimes(2);
            expect(mountTracker).toHaveBeenCalledTimes(1);
            expect(unmountTracker).not.toHaveBeenCalled();
        });
    });
});
