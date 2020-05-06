import Switch from 'components/Switch';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Container } from './DrawOwnWordSwitch.style';

interface Props {
  drawOwnWord: boolean;
  setDrawOwnWord: (drawOwnWord: boolean) => void;
}

const DrawOwnWordSwitch: React.FC<Props> = ({ drawOwnWord, setDrawOwnWord }) => (
  <Container>
    <FormattedMessage id="roomLobby.drawOwnWord" />
    <Switch setSelected={setDrawOwnWord} selected={drawOwnWord} />
  </Container>
);

export default DrawOwnWordSwitch;
