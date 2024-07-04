import React, { useEffect, useState } from 'react';
import { render, act } from '@testing-library/react';
import Switch from './index';

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
                <Switch expr={2}>
                    <Switch.Case value={1}>
                        One
                        <Switch.Case value={2}>Two</Switch.Case>
                    </Switch.Case>
                    <Switch.Default>Default</Switch.Default>
                </Switch>,
            );

        it('should ignore nested cases', () => {
            const { queryByText } = getScenario();
            expect(queryByText('One')).not.toBeInTheDocument();
            expect(queryByText('Two')).not.toBeInTheDocument();
            expect(queryByText('Default')).toBeInTheDocument();
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
        const renderTracker = jest.fn();
        const mountTracker = jest.fn();
        const unmountTracker = jest.fn();

        const CaseContent = ({ id }: any) => {
            useEffect(() => {
                mountTracker(id);
                return () => unmountTracker(id);
            }, []);

            renderTracker(id);

            return <p>Case Content</p>;
        };

        beforeEach(() => {
            renderTracker.mockClear();
            mountTracker.mockClear();
            unmountTracker.mockClear();
        });

        it('should re-render without unmounting / remounting the case content when the container re-renders', () => {
            const Container = () => {
                const [, setState] = useState(0);

                return (
                    <div>
                        <Switch expr={1}>
                            <Switch.Case value={1}>
                                <CaseContent />
                            </Switch.Case>
                        </Switch>
                        <button
                            data-testid="update-container"
                            onClick={() => setState((prev) => prev + 1)}
                        >
                            Update
                        </button>
                    </div>
                );
            };

            const rtl = render(<Container />);

            expect(renderTracker).toHaveBeenCalledTimes(1);
            expect(mountTracker).toHaveBeenCalledTimes(1);
            expect(unmountTracker).not.toHaveBeenCalled();

            act(() => {
                rtl.getByTestId('update-container').click();
            });

            expect(renderTracker).toHaveBeenCalledTimes(2);
            expect(mountTracker).toHaveBeenCalledTimes(1);
            expect(unmountTracker).not.toHaveBeenCalled();
        });

        it('should unmount / remount the case content when the case changes', () => {
            const Container = () => {
                const [expr, setExpr] = useState(1);

                return (
                    <div>
                        <Switch expr={expr}>
                            <Switch.Case value={1}>
                                <CaseContent id={1} />
                            </Switch.Case>
                            <Switch.Case value={2}>
                                <CaseContent id={2} />
                            </Switch.Case>
                        </Switch>
                        <button
                            data-testid="update-expr"
                            onClick={() =>
                                setExpr((prev) => (prev === 1 ? 2 : 1))
                            }
                        >
                            Update
                        </button>
                    </div>
                );
            };

            const rtl = render(<Container />);

            expect(renderTracker).toHaveBeenCalledTimes(1);
            expect(renderTracker).toHaveBeenCalledWith(1);
            expect(mountTracker).toHaveBeenCalledTimes(1);
            expect(mountTracker).toHaveBeenCalledWith(1);
            expect(unmountTracker).not.toHaveBeenCalled();

            act(() => {
                rtl.getByTestId('update-expr').click();
            });

            expect(renderTracker).toHaveBeenCalledTimes(2);
            expect(renderTracker).toHaveBeenCalledWith(2);
            expect(mountTracker).toHaveBeenCalledTimes(2);
            expect(mountTracker).toHaveBeenCalledWith(2);
            expect(unmountTracker).toHaveBeenCalledTimes(1);
            expect(unmountTracker).toHaveBeenCalledWith(1);
        });
    });
});
