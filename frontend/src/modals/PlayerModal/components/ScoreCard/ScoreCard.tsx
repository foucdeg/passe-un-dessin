import React from 'react';
import Loader from 'atoms/Loader';
import { FormattedMessage } from 'react-intl';
import { Container, Label, Value, StyledLink } from './ScoreCard.style';

interface Props {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
  color?: string;
  loading?: boolean;
  linkTo?: string;
  linkToLabelId?: string;
}

const ScoreCard: React.FC<Props> = ({
  label,
  value,
  className,
  color,
  loading,
  linkTo,
  linkToLabelId,
}) => (
  <Container className={className} color={color}>
    <Label color={color}>{label}</Label>
    {loading ? <Loader /> : <Value color={color}>{value}</Value>}
    {linkTo && linkToLabelId && (
      <StyledLink to={linkTo} color={color} target="_blank" rel="noreferrer">
        <FormattedMessage id={linkToLabelId} />
      </StyledLink>
    )}
  </Container>
);

export default ScoreCard;
