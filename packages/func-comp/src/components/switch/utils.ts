import React from 'react';
import Case from './Case';
import DefaultCase from './DefaultCase';

//#region Types

const SwitchSubcomponents = [Case, DefaultCase] as const;
type SwitchSubcomponentType = (typeof SwitchSubcomponents)[number];

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

function doesChildHaveType(
    child: React.ReactNode,
    type: SwitchSubcomponentType,
): boolean {
    return React.isValidElement(child) && child.type === type;
}

function isChildASubcomponent(child: React.ReactNode): boolean {
    return SwitchSubcomponents.some((type) => doesChildHaveType(child, type));
}

//#endregion

//#region Validation Functions

function validateChild(child: React.ReactNode): void {
    if (!isChildASubcomponent(child)) {
        throw new SwitchError('InvalidChildren');
    }
}

function hasMultipleDefaultCases(children: React.ReactNode): boolean {
    return (
        React.Children.toArray(children).filter((child) =>
            doesChildHaveType(child, DefaultCase),
        ).length > 1
    );
}

export function validateChildren(children: React.ReactNode): void {
    if (!children) {
        throw new SwitchError('MissingChildren');
    }

    if (hasMultipleDefaultCases(children)) {
        throw new SwitchError('MultipleDefaultCases');
    }

    React.Children.toArray(children).forEach(validateChild);
}

//#endregion
