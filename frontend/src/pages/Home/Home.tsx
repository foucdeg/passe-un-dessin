import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import Spacer from 'atoms/Spacer';
import { Link } from 'react-router-dom';
import { useBoolean } from 'services/utils';
import client from 'services/networking/client';
import { PadStep } from 'redux/Game/types';
import { useAsyncFn } from 'react-use';
import Loader from 'atoms/Loader';
import HomeLayout from 'layout/HomeLayout';
import { PUBLIC_PATHS } from 'routes';
import { useCurrentStreamCount } from './components/TwitchModal/hooks';
import {
  LeftSideTitle,
  Subtitle,
  Donate,
  LegalLinks,
  Actions,
  Row,
  StyledSecondaryButton,
  DonateTitle,
} from './Home.style';
import PlayerGameForm from './components/PlayerGameForm';
import RulesModal from './components/RulesModal';
import FeaturedDrawing from './components/FeaturedDrawing';

import TwitchModal from './components/TwitchModal';

const Home: React.FunctionComponent = () => {
  const [isRulesModalOpen, openRulesModal, closeRulesModal] = useBoolean(false);
  const [isTwitchModalOpen, openTwitchModal, closeTwitchModal] = useBoolean(false);

  const [{ value: currentStreamsCount }, doFetchCurrentStreamCount] = useCurrentStreamCount();

  useEffect(() => {
    doFetchCurrentStreamCount();
  }, [doFetchCurrentStreamCount]);

  const [{ loading, value: hightlightedPadSteps }, doFetchHighlightedSteps] =
    useAsyncFn(async (): Promise<PadStep[]> => {
      return (await client.get(`/featured-pad-steps`)) as PadStep[];
    }, []);

  useEffect(() => {
    doFetchHighlightedSteps();
  }, [doFetchHighlightedSteps]);

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
          <div style={{ height: '192px' }}>
            <Loader />
          </div>
        )}
        {hightlightedPadSteps && hightlightedPadSteps.length > 0 && (
          <FeaturedDrawing padSteps={hightlightedPadSteps} />
        )}
        <Spacer />
        <Actions>
          <Row>
            <PlayerGameForm />
            <StyledSecondaryButton onClick={openRulesModal}>
              <FormattedMessage id="home.openRules" />
            </StyledSecondaryButton>
          </Row>
          <Row>
            <StyledSecondaryButton to={PUBLIC_PATHS.LEADERBOARD}>
              <FormattedMessage id="home.leaderboard" />
            </StyledSecondaryButton>
            {!!currentStreamsCount && (
              <StyledSecondaryButton onClick={openTwitchModal}>
                <FormattedMessage id="home.twitchStreams" values={{ currentStreamsCount }} />
              </StyledSecondaryButton>
            )}
          </Row>
        </Actions>
        <Spacer />
        <Donate href="https://utip.io/passeundessin" target="_blank">
          <DonateTitle>
            <FormattedMessage id="home.donateTitle" />
          </DonateTitle>
          <p>
            <FormattedMessage id="home.donateDescription" />
          </p>
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
