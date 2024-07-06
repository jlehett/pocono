import React, { useEffect, useMemo } from 'react';
import { getFirstPassingCondChild, validateChildren } from './utils';

export type CondProps = {
    children: React.ReactNode;
};

export default function Cond({ children }: CondProps) {
    useEffect(() => {
        validateChildren(children);
    }, [children]);

    const childToRender = useMemo(
        () => getFirstPassingCondChild(children),
        [children],
    );

    return childToRender;
}
