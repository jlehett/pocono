import {
    WithinParentProps,
    enforceDirectParent,
} from '../../utils/direct-child-validation';

export interface ValueProp extends WithinParentProps {
    value: any;
}

export const Case = enforceDirectParent<ValueProp>(
    ({ children }: ValueProp) => children,
    'Case',
    'Switch',
);

export const Default = enforceDirectParent<WithinParentProps>(
    ({ children }: WithinParentProps) => children,
    'Default',
    'Switch',
);
