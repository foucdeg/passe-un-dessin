import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { FormattedMessage } from 'react-intl';

import discordLogo from 'assets/discord.webp';
import Spacer from 'atoms/Spacer';
import { Link } from 'react-router-dom';
import { useBoolean } from 'services/utils';
import client from 'services/networking/client';
import { PadStep } from 'redux/Game/types';
import { useAsyncFn } from 'react-use';
import Loader from 'atoms/Loader';
import {
  LeftSide,
  RightSide,
  LeftSideTitle,
  Subtitle,
  Credits,
  RightSideTitle,
  Attribution,
  LegalLinks,
  DiscordLogo,
  Actions,
  Row,
  StyledSecondaryButton,
} from './Home.style';
import PlayerGameForm from './components/PlayerGameForm';
import RulesModal from './components/RulesModal';
import DiscordModal from './components/DiscordModal';
import HighlightedDrawing from './components/HighlightedDrawing';

const highlightedStepId = '68550e01-5bc9-48ed-9936-a383b736487b';

const Home: React.FunctionComponent = () => {
  const location = useLocation();
  const [isRulesModalOpen, openRulesModal, closeRulesModal] = useBoolean(false);
  const [isDiscordModalOpen, openDiscordModal, closeDiscordModal] = useBoolean(false);

  const [
    { loading, value: hightlightedPadStep },
    doFetchHighlightedStep,
  ] = useAsyncFn(async (): Promise<PadStep> => {
    return (await client.get(`/pad-step/${highlightedStepId}`)) as PadStep;
  }, []);

  useEffect(() => {
    doFetchHighlightedStep();
  }, [doFetchHighlightedStep]);

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

        {loading && (
          <div style={{ height: '278px' }}>
            <Loader />
          </div>
        )}
        <div style={{ width: '277px', height: '277px', backgroundColor: 'red' }} />
        {hightlightedPadStep && <HighlightedDrawing padStep={hightlightedPadStep} />}
        <Spacer />
        <Actions>
          <Row>
            <StyledSecondaryButton onClick={openRulesModal}>
              <FormattedMessage id="home.openRules" />
            </StyledSecondaryButton>
            <StyledSecondaryButton onClick={openDiscordModal}>
              <DiscordLogo src={discordLogo} alt="discord logo" />
              <FormattedMessage id="home.joinDiscord" />
            </StyledSecondaryButton>
          </Row>
          <PlayerGameForm />
        </Actions>
        <Spacer />
        <p>
          <Link to="/leaderboard" target="_blank">
            <FormattedMessage id="home.leaderboard" />
          </Link>
        </p>
        <Attribution>
          <FormattedMessage id="home.attribution" />.{' '}
        </Attribution>
        <LegalLinks>
          <Link to="/terms-and-conditions">
            <FormattedMessage id="home.termsAndConditions" />
          </Link>
          &nbsp;&middot;&nbsp;
          <Link to="/privacy-policy">
            <FormattedMessage id="home.privacyPolicy" />
          </Link>
        </LegalLinks>
      </LeftSide>
      <RightSide>
        <RightSideTitle>
          <FormattedMessage id="home.title" />
        </RightSideTitle>
        <Credits>Foucauld Degeorges • Michèle Ruaud</Credits>
        <Credits>Quentin Somerville • Léo Anesi</Credits>
      </RightSide>
      <RulesModal isOpen={isRulesModalOpen} onClose={closeRulesModal} />
      <DiscordModal isOpen={isDiscordModalOpen} onClose={closeDiscordModal} />
    </>
  );
};

export default Home;
