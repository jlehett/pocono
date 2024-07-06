import React from 'react';
import If from './If';
import ElseIf from './ElseIf';
import Else from './Else';
import {
    doesChildHaveType,
    getIndexOfFirstEleOfType,
    getIndexOfLastEleOfType,
    isChildASubcomponent_factory,
    numChildrenOfType,
} from '../../utils/ele-utils';
import {
    validateChild_factory,
    validateChildren_factory,
} from '../../utils/child-validation';

const CondSubcomponents = [If, ElseIf, Else];

//#region Error Config

const CondErrorConfig = {
    InvalidChildren: 'All Cond children must be of type If, ElseIf, or Else',
    MissingChildren: 'Cond must have children',
    MultipleIfChildren: 'Cond cannot have multiple If children',
    MultipleElseChildren: 'Cond cannot have multiple Else children',
    InvalidIfPosition: 'If must be the first child of Cond',
    InvalidElsePosition: 'Else must be the last child of Cond',
} as const;
type CondErrorType = keyof typeof CondErrorConfig;

class CondError extends Error {
    constructor(type: CondErrorType) {
        super(CondErrorConfig[type]);
        this.name = 'CondError';
    }
}

//#endregion

//#region Helper Functions

const isChildASubcomponent = isChildASubcomponent_factory(CondSubcomponents);

//#endregion

//#region Validation Functions

const validateChild = validateChild_factory<CondError>(
    new Map([[isChildASubcomponent, new CondError('InvalidChildren')]]),
);

export const validateChildren = validateChildren_factory<CondError>(
    validateChild,
    new Map([
        [
            (children: React.ReactNode) => !children,
            () => new CondError('MissingChildren'),
        ],
        [
            (children: React.ReactNode) => numChildrenOfType(If, children) > 1,
            () => new CondError('MultipleIfChildren'),
        ],
        [
            (children: React.ReactNode) =>
                numChildrenOfType(Else, children) > 1,
            () => new CondError('MultipleElseChildren'),
        ],
        [
            (children: React.ReactNode) =>
                getIndexOfFirstEleOfType(If, children) !== 0,
            () => new CondError('InvalidIfPosition'),
        ],
        [
            (children: React.ReactNode) =>
                numChildrenOfType(Else, children) !== 0 &&
                getIndexOfLastEleOfType(Else, children) !==
                    React.Children.count(children) - 1,
            () => new CondError('InvalidElsePosition'),
        ],
    ]),
);

//#endregion

//#region Utility Functions

export function getFirstPassingCondChild(
    children: React.ReactNode,
): React.ReactNode | null {
    return (
        React.Children.toArray(children).find((child) => {
            if (doesChildHaveType(child, Else)) {
                return child;
            }

            return (
                React.isValidElement(child) &&
                doesChildHaveType(child, If, ElseIf) &&
                child.props.expr
            );
        }) || null
    );
}

//#endregion
``;
