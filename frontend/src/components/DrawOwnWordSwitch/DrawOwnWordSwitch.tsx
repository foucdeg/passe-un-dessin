import React from 'react';
import Switch from 'components/Switch';
import { FormattedMessage } from 'react-intl';
import { Container, Description } from './DrawOwnWordSwitch.style';

interface Props {
  drawOwnWord: boolean;
  setDrawOwnWord: (drawOwnWord: boolean) => void;
}

const DrawOwnWordSwitch: React.FC<Props> = ({ drawOwnWord, setDrawOwnWord }) => (
  <Container>
    <Description>
      <FormattedMessage id="roomLobby.drawOwnWord" />
    </Description>
    <Switch setSelected={setDrawOwnWord} selected={drawOwnWord} />
  </Container>
);

export default DrawOwnWordSwitch;
