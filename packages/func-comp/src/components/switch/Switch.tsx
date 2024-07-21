import React, { useMemo, useEffect } from 'react';
import {
    getDefaultCase,
    getFirstMatchingCase,
    validateChildren,
} from './utils';
import { wrapChildrenWithParentFlag } from '../../utils/direct-child-validation';

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

    return wrapChildrenWithParentFlag(
        matchingCase || defaultCase || null,
        'Switch',
    );
}
