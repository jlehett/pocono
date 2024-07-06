import Cond, { CondProps } from './Cond';
import If, { IfProps } from './If';
import ElseIf, { ElseIfProps } from './ElseIf';
import Else, { ElseProps } from './Else';

interface CondComponent extends React.FC<CondProps> {
    If: React.FC<IfProps>;
    ElseIf: React.FC<ElseIfProps>;
    Else: React.FC<ElseProps>;
}

const CondComponent = Cond as CondComponent;
CondComponent.If = If;
CondComponent.ElseIf = ElseIf;
CondComponent.Else = Else;

export default CondComponent;
