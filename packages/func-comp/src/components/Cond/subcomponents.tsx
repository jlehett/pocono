import {
    WithinParentProps,
    enforceDirectParent,
} from '../../utils/direct-child-validation';

export interface ExprProp extends WithinParentProps {
    expr: boolean;
}

export const If = enforceDirectParent<ExprProp>(
    ({ children }: ExprProp) => children,
    'If',
    'Cond',
);

export const ElseIf = enforceDirectParent<ExprProp>(
    ({ children }: ExprProp) => children,
    'ElseIf',
    'Cond',
);

export const Else = enforceDirectParent<WithinParentProps>(
    ({ children }: WithinParentProps) => children,
    'Else',
    'Cond',
);
