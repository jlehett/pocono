import Switch, { SwitchProps } from './Switch';
import Case, { CaseProps } from './Case';
import DefaultCase, { DefaultCaseProps } from './DefaultCase';

interface SwitchComponent extends React.FC<SwitchProps> {
    Case: React.FC<CaseProps>;
    Default: React.FC<DefaultCaseProps>;
}

const SwitchComponent = Switch as SwitchComponent;
SwitchComponent.Case = Case;
SwitchComponent.Default = DefaultCase;

export default SwitchComponent;
