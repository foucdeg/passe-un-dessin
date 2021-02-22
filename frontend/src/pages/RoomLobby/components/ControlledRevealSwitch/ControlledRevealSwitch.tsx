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
    <Value selected={!controlledReveal}>
      <FormattedMessage id="common.no" />
    </Value>
    <StyledSwitch
      setSelected={setControlledReveal}
      selected={controlledReveal}
      data-test="controlled-reveal"
    />
    <Value selected={controlledReveal}>
      <FormattedMessage id="common.yes" />
    </Value>
  </Container>
);

export default ControlledRevealSwitch;
