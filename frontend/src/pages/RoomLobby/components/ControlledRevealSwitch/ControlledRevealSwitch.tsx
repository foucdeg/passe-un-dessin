import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Container, Label, StyledSwitch, Value } from './ControlledRevealSwitch.style';

interface Props {
  controlledReveal: boolean;
  setControlledReveal: (controlledReveal: boolean) => void;
}

const ControlledRevealSwitch: React.FC<Props> = ({ controlledReveal, setControlledReveal }) => (
  <Container>
    <Label>
      <FormattedMessage id="controlledRevealSwitch.label" />
    </Label>
    <Value selected={!controlledReveal}>No</Value>
    <StyledSwitch setSelected={setControlledReveal} selected={controlledReveal} />
    <Value selected={controlledReveal}>Yes</Value>
  </Container>
);

export default ControlledRevealSwitch;
