import {
    WithinParentProps,
    enforceDirectParent,
} from '../../utils/direct-child-validation';

export interface CaseProp extends WithinParentProps {
    value: any;
    break?: boolean;
}

export const Case = enforceDirectParent<CaseProp>(
    ({ children }: CaseProp) => children,
    'Case',
    'Switch',
);

export const Default = enforceDirectParent<WithinParentProps>(
    ({ children }: WithinParentProps) => children,
    'Default',
    'Switch',
);
