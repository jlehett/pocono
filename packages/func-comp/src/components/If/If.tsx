import React from 'react';

export type IfProps = {
    expr: boolean;
    children: React.ReactNode;
};

export default function If({ expr, children }: IfProps) {
    return expr ? children : null;
}
