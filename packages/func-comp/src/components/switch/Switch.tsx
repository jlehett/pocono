import React, { useMemo, useEffect } from 'react';
import { getMatchingCases, validateChildren } from './utils';
import { wrapChildrenWithParentFlag } from '../../utils/direct-child-validation';

export type SwitchProps = {
    expr: any;
    children: React.ReactNode;
};

export default function Switch({ expr, children }: SwitchProps) {
    useEffect(() => {
        validateChildren(children);
    }, [children]);

    const matchingCases = useMemo(
        () => getMatchingCases(expr, children),
        [expr, children],
    );

    return wrapChildrenWithParentFlag(matchingCases || null, 'Switch');
}
