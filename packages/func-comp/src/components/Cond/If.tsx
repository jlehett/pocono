import { CondError } from './utils';
import { useImperativeHandle, forwardRef } from 'react';

export type IfProps = {
    expr: boolean;
    children: React.ReactNode;
};

// Look into using imperative handle to resolve this
const If = forwardRef(({ children }: IfProps, ref: React.Ref) => {
    return children;
});

export default If;
