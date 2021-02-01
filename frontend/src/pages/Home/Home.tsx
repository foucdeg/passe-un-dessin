import React, { useEffect, lazy } from 'react';
import { useLocation } from 'react-router';
import { FormattedMessage } from 'react-intl';

import discordLogo from 'assets/discord.webp';
import Spacer from 'atoms/Spacer';
import { Link } from 'react-router-dom';
import { useBoolean } from 'services/utils';
import client from 'services/networking/client';
import { selectCurrentStreamsCount } from 'redux/Twitch/selectors';
import { useFetchCurrentStreamsCount } from 'redux/Twitch/hooks';
import { useSelector } from 'redux/useSelector';
import { PadStep } from 'redux/Game/types';
import { useAsyncFn } from 'react-use';
import BareAnchor from 'atoms/BareAnchor';
import Loader from 'atoms/Loader';
import HomeLayout from 'layout/HomeLayout';
import {
  LeftSideTitle,
  Subtitle,
  Donate,
  LegalLinks,
  DiscordLogo,
  Actions,
  Row,
  StyledSecondaryButton,
} from './Home.style';
import PlayerGameForm from './components/PlayerGameForm';
import RulesModal from './components/RulesModal';
import HighlightedDrawing from './components/FeaturedDrawing';

const TwitchModal = lazy(() => import('./components/TwitchModal'));

const discordLink = 'https://discord.gg/8y9s5yFgYq';

const Home: React.FunctionComponent = () => {
  const location = useLocation();
  const [isRulesModalOpen, openRulesModal, closeRulesModal] = useBoolean(false);
  const [isTwitchModalOpen, openTwitchModal, closeTwitchModal] = useBoolean(false);

  const currentStreamsCount = useSelector(selectCurrentStreamsCount);
  const doFetchCurrentStreamsCount = useFetchCurrentStreamsCount();

  useEffect(() => {
    doFetchCurrentStreamsCount();
  }, [doFetchCurrentStreamsCount]);

  const [
    { loading, value: hightlightedPadSteps },
    doFetchHighlightedSteps,
  ] = useAsyncFn(async (): Promise<PadStep[]> => {
    return (await client.get(`/featured-pad-steps`)) as PadStep[];
  }, []);

  useEffect(() => {
    doFetchHighlightedSteps();
  }, [doFetchHighlightedSteps]);

  if (!location.pathname.match(/\/(room\/[^/]+)?$/)) return null;

  return (
    <>
      <HomeLayout>
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
        {hightlightedPadSteps && hightlightedPadSteps.length > 0 && (
          <HighlightedDrawing padSteps={hightlightedPadSteps} />
        )}
        <Spacer />
        <Actions>
          <Row>
            <StyledSecondaryButton onClick={openRulesModal}>
              <FormattedMessage id="home.openRules" />
            </StyledSecondaryButton>
            <BareAnchor href={discordLink} target="_blank" rel="noreferrer">
              <StyledSecondaryButton>
                <DiscordLogo src={discordLogo} alt="discord logo" />
                <FormattedMessage id="home.joinDiscord" />
              </StyledSecondaryButton>
            </BareAnchor>
            {!!currentStreamsCount && (
              <StyledSecondaryButton onClick={openTwitchModal}>
                <FormattedMessage id="home.twitchStreams" values={{ currentStreamsCount }} />
              </StyledSecondaryButton>
            )}
          </Row>
          <PlayerGameForm />
        </Actions>
        <Spacer />
        <p>
          <Link to="/leaderboard" target="_blank" rel="noreferrer">
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
      </HomeLayout>
      <RulesModal isOpen={isRulesModalOpen} onClose={closeRulesModal} />
      {isTwitchModalOpen && <TwitchModal isOpen={isTwitchModalOpen} onClose={closeTwitchModal} />}
    </>
  );
};

export default Home;
