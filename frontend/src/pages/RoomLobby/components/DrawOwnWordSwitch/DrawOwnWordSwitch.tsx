import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Container, Label, StyledSwitch, Value } from './DrawOwnWordSwitch.style';

interface Props {
  playerCount: number;
  drawOwnWord: boolean;
  setDrawOwnWord: (drawOwnWord: boolean) => void;
}

const DrawOwnWordSwitch: React.FC<Props> = ({ playerCount, drawOwnWord, setDrawOwnWord }) => {
  if (playerCount < 4) return null;
  if (playerCount % 2 !== 0) return null;

  const lowerRoundCount = playerCount / 2 - 1;
  const upperRoundCount = playerCount / 2;

  return (
    <Container>
      <Label>
        <FormattedMessage id="drawOwnWordSwitch.label" />
      </Label>
      <Value selected={!drawOwnWord}>{lowerRoundCount}</Value>
      <StyledSwitch setSelected={setDrawOwnWord} selected={drawOwnWord} />
      <Value selected={drawOwnWord}>
        <FormattedMessage
          id="drawOwnWordSwitch.upperRoundCount"
          values={{ roundCount: upperRoundCount }}
        />
      </Value>
    </Container>
  );
};

export default DrawOwnWordSwitch;
