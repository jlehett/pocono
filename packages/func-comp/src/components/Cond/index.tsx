import Cond, { CondProps } from './Cond';
import { WithinParentProps } from '../../utils/direct-child-validation';
import { ExprProp, If, ElseIf, Else } from './subcomponents';

interface CondComponent extends React.FC<CondProps> {
    If: React.FC<ExprProp>;
    ElseIf: React.FC<ExprProp>;
    Else: React.FC<WithinParentProps>;
}

const CondComponent = Cond as CondComponent;
CondComponent.If = If;
CondComponent.ElseIf = ElseIf;
CondComponent.Else = Else;

export default CondComponent;
