import React from 'react';
import { Circle, Container, Rod } from './Switch.style';

type Props = {
  setSelected: (selected: boolean) => void;
  selected: boolean;
  className?: string;
};

const Switch: React.FC<Props> = ({ setSelected, selected, className }) => (
  <Container onClick={() => setSelected(!selected)} className={className}>
    <Rod selected={selected} />
    <Circle selected={selected} />
  </Container>
);

export default Switch;
