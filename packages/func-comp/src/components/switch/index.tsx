import Switch, { SwitchProps } from './Switch';
import { WithinParentProps } from '../../utils/direct-child-validation';
import { ValueProp, Case, Default } from './subcomponents';

interface SwitchComponent extends React.FC<SwitchProps> {
    Case: React.FC<ValueProp>;
    Default: React.FC<WithinParentProps>;
}

const SwitchComponent = Switch as SwitchComponent;
SwitchComponent.Case = Case;
SwitchComponent.Default = Default;

export default SwitchComponent;
