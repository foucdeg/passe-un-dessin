import React from 'react';
import {
  LeftSide,
  RightSide,
  LeftSideTitle,
  Subtitle,
  Header,
  HelpParagraph,
  StartButton,
  Credits,
  RightSideTitle,
  PlayerLine,
} from './Home.style';
import { useCreateRoom } from 'redux/Room/hooks';
import { useLocation } from 'react-router';
import PlayerChip from 'atoms/PlayerChip';
import { selectPlayer } from 'redux/Player/selectors';
import { useSelector } from 'redux/useSelector';
import { FormattedMessage } from 'react-intl';

const Home: React.FunctionComponent = () => {
  const doCreateRoom = useCreateRoom();
  const player = useSelector(selectPlayer);
  const location = useLocation();

  if (!location.pathname.match(/\/(room\/[^/]+)?$/)) return null;

  return (
    <>
      <LeftSide>
        <LeftSideTitle>
          <FormattedMessage id="home.title" />
        </LeftSideTitle>
        <Subtitle>
          <FormattedMessage id="home.tagline" />
        </Subtitle>
        {player && (
          <PlayerLine>
            <FormattedMessage id="home.welcome" />
            ,&nbsp;<PlayerChip color={player.color}>{player.name}</PlayerChip> !
          </PlayerLine>
        )}
        <Header>
          <FormattedMessage id="home.howToPlay" />
        </Header>
        <HelpParagraph>
          <FormattedMessage id="home.rules" />
        </HelpParagraph>
        <StartButton onClick={doCreateRoom}>
          <FormattedMessage id="home.startRoom" />
        </StartButton>
        <HelpParagraph>
          <FormattedMessage id="home.joinExistingRoom" />
        </HelpParagraph>
      </LeftSide>
      <RightSide>
        <RightSideTitle>
          <FormattedMessage id="home.title" />
        </RightSideTitle>
        <Credits>Michèle Ruaud \ Foucauld Degeorges</Credits>
      </RightSide>
    </>
  );
};

export default Home;
