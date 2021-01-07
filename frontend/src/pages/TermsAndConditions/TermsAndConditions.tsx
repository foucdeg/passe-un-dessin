import React from 'react';
import { NoProps } from 'services/utils';
import { FormattedMessage } from 'react-intl';
import SecondaryButton from 'atoms/SecondaryButton';
import HomeLayout from 'layout/HomeLayout';
import {
  LeftSideTitle,
  Subtitle,
  Header,
  LegalParagraph,
  ArrowLeft,
} from './TermsAndConditions.style';

const TermsAndConditions: React.FC<NoProps> = () => (
  <HomeLayout>
    <LeftSideTitle>
      <FormattedMessage id="home.title" />
    </LeftSideTitle>
    <Subtitle>
      <FormattedMessage id="home.tagline" />
    </Subtitle>
    <Header>
      <FormattedMessage id="legal.termsAndConditionsTitle" />
    </Header>
    <LegalParagraph>
      This website is provided as is, without any warranty. While the best effort has been made to
      keep you and your device safe and secure, we decline any responsibility in case of damage to
      yourself or your devices in the use of this website.
    </LegalParagraph>
    <LegalParagraph>
      By using the website and submitting drawn or written content, you renounce any and all
      applicable intellectual property rights on the submitted content.
    </LegalParagraph>
    <LegalParagraph>
      The content submitted by users on the website is not currently moderated. Therefore, and for
      instance, the content may be of a sexual or even illegal nature in your country. We advise you
      to play only with friends or family, if you wish to only view safe content through the
      website.
    </LegalParagraph>
    <LegalParagraph>
      You may report any abuse in user-submitted content by email to{' '}
      <a href="mailto:foucauld.degeorges@gmail.com">foucauld.degeorges@gmail.com</a>, and I will try
      to take steps to remove such content.
    </LegalParagraph>
    <SecondaryButton to="/">
      <ArrowLeft />
      <FormattedMessage id="legal.backToHome" />
    </SecondaryButton>
  </HomeLayout>
);

export default TermsAndConditions;
