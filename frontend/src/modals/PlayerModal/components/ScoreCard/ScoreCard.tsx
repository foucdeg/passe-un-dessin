import React from 'react';
import { Container, Label, Value } from './ScoreCard.style';
import Loader from 'atoms/Loader';

interface Props {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
  color?: string;
  loading?: boolean;
}

const ScoreCard: React.FC<Props> = ({ label, value, className, color, loading }) => (
  <Container className={className} color={color}>
    <Label color={color}>{label}</Label>
    {loading ? <Loader /> : <Value color={color}>{value}</Value>}
  </Container>
);

export default ScoreCard;
