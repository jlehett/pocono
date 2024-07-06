import React from 'react';
import Case from './Case';
import DefaultCase from './DefaultCase';
import {
    getFirstEleOfType,
    isChildASubcomponent_factory,
    numChildrenOfType,
} from '../../utils/ele-utils';
import {
    validateChild_factory,
    validateChildren_factory,
} from '../../utils/child-validation';

//#region Types

const SwitchSubcomponents = [Case, DefaultCase];

//#endregion

//#region Error Config

const SwitchErrorConfig = {
    InvalidChildren: 'All Switch children must be of type Case or DefaultCase',
    MissingChildren: 'Switch must have children',
    MultipleDefaultCases: 'Switch cannot have multiple DefaultCase children',
} as const;
type SwitchErrorType = keyof typeof SwitchErrorConfig;

class SwitchError extends Error {
    constructor(type: SwitchErrorType) {
        super(SwitchErrorConfig[type]);
        this.name = 'SwitchError';
    }
}

//#endregion

//#region Helper Functions

const isChildASubcomponent = isChildASubcomponent_factory(SwitchSubcomponents);

//#endregion

//#region Validation Functions

const validateChild = validateChild_factory<SwitchError>(
    new Map([[isChildASubcomponent, new SwitchError('InvalidChildren')]]),
);

export const validateChildren = validateChildren_factory<SwitchError>(
    validateChild,
    new Map([
        [
            (children: React.ReactNode) => !children,
            () => new SwitchError('MissingChildren'),
        ],
        [
            (children: React.ReactNode) =>
                numChildrenOfType(DefaultCase, children) > 1,
            () => new SwitchError('MultipleDefaultCases'),
        ],
    ]),
);

//#endregion

//#region Utility Functions

export function getFirstMatchingCase(
    expr: any,
    children: React.ReactNode,
): React.ReactNode | null {
    return getFirstEleOfType(Case, children, [
        (child) => React.isValidElement(child) && child.props.value === expr,
    ]);
}

export function getDefaultCase(
    children: React.ReactNode,
): React.ReactNode | null {
    return getFirstEleOfType(DefaultCase, children);
}

//#endregion
