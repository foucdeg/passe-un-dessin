import React from 'react';
import {
  LeftSide,
  RightSide,
  LeftSideTitle,
  Subtitle,
  Header,
  StartButton,
  Credits,
  RightSideTitle,
  RuleNumberBackground,
  RuleNumber,
  RuleParagraph,
  Rule,
  RuleSection,
} from './Home.style';
import { useCreateRoom } from 'redux/Room/hooks';
import { useLocation } from 'react-router';
import { FormattedMessage } from 'react-intl';

import ruleBackgrounds from 'assets/rule-backgrounds';
import { Spacer } from 'atoms/Spacer';

const Home: React.FunctionComponent = () => {
  const doCreateRoom = useCreateRoom();
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
        <Header>
          <FormattedMessage id="home.howToPlay" />
        </Header>
        <RuleSection>
          {ruleBackgrounds.map((ruleBackground, index) => (
            <Rule key={ruleBackground}>
              <RuleNumberBackground background={ruleBackground}>
                <RuleNumber>{index + 1}</RuleNumber>
              </RuleNumberBackground>

              <RuleParagraph>
                <FormattedMessage
                  id={`home.rules.${index}`}
                  values={{ strong: (...chunks: string[]) => <strong>{chunks}</strong> }}
                />
              </RuleParagraph>
            </Rule>
          ))}
        </RuleSection>
        <Spacer />
        <StartButton onClick={doCreateRoom}>
          <FormattedMessage id="home.startRoom" />
        </StartButton>
        <p>
          <FormattedMessage id="home.joinExistingRoom" />
        </p>
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
