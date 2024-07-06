import React, { useMemo, useEffect } from 'react';
import {
    getDefaultCase,
    getFirstMatchingCase,
    validateChildren,
} from './utils';

export type SwitchProps = {
    expr: any;
    children: React.ReactNode;
};

export default function Switch({ expr, children }: SwitchProps) {
    useEffect(() => {
        validateChildren(children);
    }, [children]);

    const matchingCase = useMemo(
        () => getFirstMatchingCase(expr, children),
        [expr, children],
    );

    const defaultCase = useMemo(() => getDefaultCase(children), [children]);

    return matchingCase || defaultCase || null;
}
