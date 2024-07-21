import React from 'react';
import { Case, Default } from './subcomponents';
import {
    isChildASubcomponent_factory,
    numChildrenOfType,
} from '../../utils/ele-utils';
import {
    validateChild_factory,
    validateChildren_factory,
} from '../../utils/child-validation';

//#region Types

const SwitchSubcomponents = [Case, Default];

//#endregion

//#region Error Config

const SwitchErrorConfig = {
    InvalidChildren: 'All Switch children must be of type Case or Default',
    MissingChildren: 'Switch must have children',
    MultipleDefaults: 'Switch cannot have multiple Default children',
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
                numChildrenOfType(Default, children) > 1,
            () => new SwitchError('MultipleDefaults'),
        ],
    ]),
);

//#endregion

//#region Utility Functions

export function getMatchingCases(
    expr: any,
    children: React.ReactNode,
): React.ReactNode[] {
    const matchingCases = [];

    for (const child of React.Children.toArray(children)) {
        if (React.isValidElement(child) && child.type === Case) {
            if (child.props.value === expr) {
                matchingCases.push(child);

                if (child.props.break) {
                    break;
                }
            }
        } else if (React.isValidElement(child) && child.type === Default) {
            matchingCases.push(child);
            break;
        }
    }

    return matchingCases;
}

//#endregion
