import React from 'react';
import { FormattedMessage } from 'react-intl';
import SocialButtons from './components/SocialButtons';

import { LeftSide, RightSide, RightSideTitle, Credits } from './HomeLayout.style';

interface Props {
  children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = ({ children }) => (
  <>
    <LeftSide>{children}</LeftSide>
    <RightSide>
      <RightSideTitle>
        <FormattedMessage id="home.title" />
      </RightSideTitle>
      <Credits>Foucauld Degeorges • Michèle Ruaud</Credits>
      <Credits>Quentin Somerville • Léo Anesi</Credits>
      <SocialButtons />
    </RightSide>
  </>
);

export default HomeLayout;
