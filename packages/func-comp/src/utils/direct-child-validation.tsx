import React from 'react';
import { omit } from 'lodash';

export interface WithinParentProps {
    children: React.ReactNode;
}

export function enforceDirectParent<P extends WithinParentProps>(
    WrappedComponent: React.ComponentType<P>,
    componentName: string,
    enforcedParentComponentName: string,
) {
    return function WithinParent(props: P) {
        if (
            !props.hasOwnProperty(
                `__IS_WITHIN_${enforcedParentComponentName}__`,
            )
        ) {
            throw new Error(
                `${componentName} must be a direct child of ${enforcedParentComponentName}`,
            );
        }

        const propsWithoutFlag = omit(
            props,
            `__IS_WITHIN_${enforcedParentComponentName}__`,
        ) as P;

        return <WrappedComponent {...propsWithoutFlag} />;
    };
}

export function wrapChildrenWithParentFlag(
    children: React.ReactNode,
    parentComponentName: string,
) {
    return React.Children.map(children, (child) =>
        React.isValidElement(child)
            ? React.cloneElement(child, {
                  [`__IS_WITHIN_${parentComponentName}__`]: true,
              })
            : child,
    );
}
