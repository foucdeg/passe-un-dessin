import React from 'react';
import { NoProps } from 'services/utils';
import { FormattedMessage } from 'react-intl';
import SecondaryButton from 'atoms/SecondaryButton';
import {
  LeftSide,
  LeftSideTitle,
  Subtitle,
  Header,
  RightSide,
  RightSideTitle,
  Credits,
  LegalParagraph,
  ArrowLeft,
} from './Legal.style';

const Legal: React.FC<NoProps> = () => (
  <>
    <LeftSide>
      <LeftSideTitle>
        <FormattedMessage id="home.title" />
      </LeftSideTitle>
      <Subtitle>
        <FormattedMessage id="home.tagline" />
      </Subtitle>
      <Header id="terms-and-conditions">
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
        instance, the content may be of a sexual or even illegal nature in your country. We advise
        you to play only with friends or family, if you wish to only view safe content through the
        website.
      </LegalParagraph>
      <LegalParagraph>
        You may report any abuse in user-submitted content by email to{' '}
        <a href="mailto:foucauld.degeorges@gmail.com">foucauld.degeorges@gmail.com</a>, and I will
        try to take steps to remove such content.
      </LegalParagraph>
      <Header id="privacy-policy">
        <FormattedMessage id="legal.privacyPolicyTitle" />
      </Header>
      <LegalParagraph>
        The following paragraphs describe the data that is collected by this website, and our use of
        it.
      </LegalParagraph>
      <LegalParagraph>
        In order to access or request deletion of your personal data from our database, please send
        an email to <a href="mailto:foucauld.degeorges@gmail.com">foucauld.degeorges@gmail.com</a>.
      </LegalParagraph>
      <LegalParagraph>
        <strong>User-submitted information:</strong> When using the website, you might submit a
        username, textual and drawn content, and cast votes. This data is collected and kept in our
        database to allow users to view history of past games. This data is <strong>not</strong>{' '}
        shared with any third party.
      </LegalParagraph>
      <LegalParagraph>
        <strong>User-submitted information when creating an account:</strong> If you choose to
        create an account on the website, you submit an email address and a password. The email is
        used as an unique identifier to guarantee that only you can access your account. For that
        purpose, we may send you occasional emails for security purposes, such as email address
        verification or password reset. We do <strong>not</strong> send marketing emails.
      </LegalParagraph>
      <LegalParagraph>
        The password is safely stored in our database in an encrypted format. Email addresses and
        passwords are <strong>not</strong> shared with any third party.
      </LegalParagraph>
      <LegalParagraph>
        <strong>Information provided by social authentication providers:</strong> If you choose to
        create an account on the website using either Facebook or Google, these providers provide us
        with a short-lived token. We do not keep that token, we use it once to retrieve your email
        address and basic profile information (in the case of Facebook, this also includes your name
        and profile picture), and then discard the token. We only keep the email address, which is
        used as an unique identifier to guarantee that only you can access your account. For that
        purpose, we may send you occasional emails for security purposes, such as email address
        verification or password reset. We do <strong>not</strong> send marketing emails.
      </LegalParagraph>
      <LegalParagraph>
        The other information that may be provided by the social authentication provider, besides
        your email address, is immediately discarded. It is <strong>not</strong> kept in database.
        It is not currently possible to prevent Facebook and Google from providing us this
        unnecessary information.
      </LegalParagraph>
      <LegalParagraph>
        <strong>Data stored and collected for analytics purposes:</strong> This website uses Google
        Analytics to access statistical data such as number of users and countries of origin. The
        data is <strong>fully anonymized</strong> by Google before being provided to us (including
        IP addresses) and no subset of the data can be associated with a specific person. These
        analytics function using cookies set by Google when you visit a Google-owned website. This
        website has no control and is not responsible of managing these cookies.
      </LegalParagraph>
      <LegalParagraph>
        <strong>Cookies used by this website:</strong> This website uses the minimal amount of
        cookies required for its proper function, such as session cookies, and also uses a similar
        browser feature called Local Storage for convenience features such as remembering your user
        settings. This data is <strong>not</strong> stored on our side, only in your browser. You
        can use your browser settings page to access, modify, or delete this data.
      </LegalParagraph>
      <SecondaryButton to="/">
        <ArrowLeft />
        <FormattedMessage id="legal.backToHome" />
      </SecondaryButton>
    </LeftSide>
    <RightSide>
      <RightSideTitle>
        <FormattedMessage id="home.title" />
      </RightSideTitle>
      <Credits>Foucauld Degeorges • Michèle Ruaud</Credits>
      <Credits>Quentin Somerville • Léo Anesi</Credits>
    </RightSide>
  </>
);

export default Legal;
