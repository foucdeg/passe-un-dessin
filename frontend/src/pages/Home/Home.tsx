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
import BareAnchor from 'atoms/BareAnchor';
import Loader from 'atoms/Loader';
import {
  LeftSide,
  RightSide,
  LeftSideTitle,
  Subtitle,
  Credits,
  RightSideTitle,
  Donate,
  LegalLinks,
  DiscordLogo,
  Actions,
  Row,
  StyledSecondaryButton,
} from './Home.style';
import PlayerGameForm from './components/PlayerGameForm';
import RulesModal from './components/RulesModal';
import HighlightedDrawing from './components/HighlightedDrawing';

const highlightedStepId = '68550e01-5bc9-48ed-9936-a383b736487b';
const discordLink = 'https://discord.gg/8y9s5yFgYq';

const Home: React.FunctionComponent = () => {
  const location = useLocation();
  const [isRulesModalOpen, openRulesModal, closeRulesModal] = useBoolean(false);

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
        {hightlightedPadStep && <HighlightedDrawing padStep={hightlightedPadStep} />}
        <Spacer />
        <Actions>
          <Row>
            <StyledSecondaryButton onClick={openRulesModal}>
              <FormattedMessage id="home.openRules" />
            </StyledSecondaryButton>
            <BareAnchor href={discordLink} target="_blank">
              <StyledSecondaryButton>
                <DiscordLogo src={discordLogo} alt="discord logo" />
                <FormattedMessage id="home.joinDiscord" />
              </StyledSecondaryButton>
            </BareAnchor>
          </Row>
          <PlayerGameForm />
        </Actions>
        <Spacer />
        <p>
          <Link to="/leaderboard" target="_blank">
            <FormattedMessage id="home.leaderboard" />
          </Link>
        </p>
        <Donate>
          <FormattedMessage
            id="home.donate"
            values={{
              a: (...chunks: string[]) => (
                <a href="https://utip.io/passeundessin" target="_blank" rel="noreferrer">
                  {chunks}
                </a>
              ),
            }}
          />
        </Donate>
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
    </>
  );
};

export default Home;
