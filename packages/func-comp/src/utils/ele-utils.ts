import React from 'react';

export function doesChildHaveType(
    child: React.ReactNode,
    ...type: React.FC<any>[]
): boolean {
    return (
        React.isValidElement(child) &&
        type.includes(child.type as React.FC<any>)
    );
}

export function isChildASubcomponent_factory(
    subcomponentTypes: React.FC<any>[],
): (child: React.ReactNode) => boolean {
    return function isChildASubcomponent(child: React.ReactNode): boolean {
        return doesChildHaveType(child, ...subcomponentTypes);
    };
}

export function getIndexOfFirstEleOfType(
    type: React.FC<any>,
    children: React.ReactNode,
): number {
    return React.Children.toArray(children).findIndex((child) =>
        doesChildHaveType(child, type),
    );
}

export function getIndexOfLastEleOfType(
    type: React.FC<any>,
    children: React.ReactNode,
): number {
    const childrenArray = React.Children.toArray(children);
    return (
        childrenArray.length -
        1 -
        getIndexOfFirstEleOfType(type, childrenArray.reverse())
    );
}

export function getFirstEleOfType(
    type: React.FC<any>,
    children: React.ReactNode,
    additionalFilters: ((child: React.ReactNode) => boolean)[] = [],
): React.ReactNode | null {
    return React.Children.toArray(children).find((child) => {
        return (
            doesChildHaveType(child, type) &&
            additionalFilters.every((filter) => filter(child))
        );
    });
}

export function numChildrenOfType(
    type: React.FC<any>,
    children: React.ReactNode,
): number {
    return React.Children.toArray(children).filter((child) =>
        doesChildHaveType(child, type),
    ).length;
}
