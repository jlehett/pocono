import React from 'react';
import { render } from '@testing-library/react';
import Cond from './index';

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
                it('should render the Cond.Else children', () => {
                    const { queryByText } = render(
                        <Cond>
                            <Cond.If expr={false}>
                                <div>If True</div>
                            </Cond.If>
                            <Cond.Else>
                                <div>Else</div>
                            </Cond.Else>
                        </Cond>,
                    );

                    expect(queryByText('If True')).not.toBeInTheDocument();
                    expect(queryByText('Else')).toBeInTheDocument();
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
            it('should render the Cond.ElseIf children of the first Cond.ElseIf whose expression evaluates to true', () => {
                const { queryByText } = render(
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

                expect(queryByText('If True')).not.toBeInTheDocument();
                expect(queryByText('ElseIf False')).not.toBeInTheDocument();
                expect(queryByText('ElseIf True')).toBeInTheDocument();
            });
        });
    });
});
