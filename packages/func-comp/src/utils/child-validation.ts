import React from 'react';

type ChildValidationFn = (child: React.ReactNode) => boolean;
type ChildrenValidationFn = (children: React.ReactNode) => boolean;

export function validateChild_factory<ComponentError>(
    validations: Map<ChildValidationFn, ComponentError>,
): (child: React.ReactNode) => void {
    return function validateChild(child: React.ReactNode): void {
        for (const [validationFn, componentError] of validations) {
            if (!validationFn(child)) {
                throw componentError;
            }
        }
    };
}

export function validateChildren_factory<ComponentError>(
    validateChild: (child: React.ReactNode) => void,
    childrenValidations: Map<ChildrenValidationFn, () => ComponentError>,
): (children: React.ReactNode) => void {
    return function validateChildren(children: React.ReactNode): void {
        React.Children.toArray(children).forEach(validateChild);

        for (const [
            childrenValidationFn,
            componentError,
        ] of childrenValidations) {
            if (childrenValidationFn(children)) {
                throw componentError();
            }
        }
    };
}
