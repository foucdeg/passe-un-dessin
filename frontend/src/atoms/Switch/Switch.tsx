import React, { HTMLAttributes } from 'react';
import { Circle, Container, Rod } from './Switch.style';

type Props = {
  setSelected: (selected: boolean) => void;
  selected: boolean;
};

const Switch: React.FC<Props & HTMLAttributes<HTMLButtonElement>> = ({
  setSelected,
  selected,
  ...containerProps
}) => (
  <Container {...containerProps} onClick={() => setSelected(!selected)}>
    <Rod selected={selected} />
    <Circle selected={selected} />
  </Container>
);

export default Switch;
