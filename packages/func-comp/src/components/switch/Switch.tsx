import React, { isValidElement, Children, useMemo, useEffect } from 'react';
import Case from './Case';
import DefaultCase from './DefaultCase';
import { validateChildren } from './utils';

export type SwitchProps = {
    expr: any;
    children: React.ReactNode;
};

export default function Switch({ expr, children }: SwitchProps) {
    useEffect(() => {
        validateChildren(children);
    }, [children]);

    const matchingCase = useMemo(
        () =>
            Children.toArray(children).find((child) =>
                isValidElement(child) && child.type === Case
                    ? child.props.value === expr
                    : false,
            ),
        [expr, children],
    );

    const defaultCase = useMemo(
        () =>
            Children.toArray(children).find(
                (child) => isValidElement(child) && child.type === DefaultCase,
            ),
        [children],
    );

    return matchingCase || defaultCase || null;
}
