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
} from '../TermsAndConditions/TermsAndConditions.style';

const PrivacyPolicy: React.FC<NoProps> = () => (
  <HomeLayout>
    <LeftSideTitle>
      <FormattedMessage id="home.title" />
    </LeftSideTitle>
    <Subtitle>
      <FormattedMessage id="home.tagline" />
    </Subtitle>
    <Header>
      <FormattedMessage id="legal.privacyPolicyTitle" />
    </Header>
    <LegalParagraph>
      The following paragraphs describe the data that is collected by this website, and our use of
      it.
    </LegalParagraph>
    <LegalParagraph>
      In order to access or request deletion of your personal data from our database, please send an
      email to <a href="mailto:foucauld.degeorges@gmail.com">foucauld.degeorges@gmail.com</a>.
    </LegalParagraph>
    <LegalParagraph>
      <strong>User-submitted information:</strong> When using the website, you might submit a
      username, text content, drawings, and cast votes. This data is collected and kept in our
      database to allow users to view history of past games. This data is <strong>not</strong>{' '}
      shared with any third party.
    </LegalParagraph>
    <LegalParagraph>
      <strong>User-submitted information when creating an account:</strong> If you choose to create
      an account on the website, you submit an email address and a password. The email is used as an
      unique identifier to guarantee that only you can access your account. For that purpose, we may
      send you occasional emails for security purposes, such as email address verification or
      password reset. We do <strong>not</strong> send marketing emails.
    </LegalParagraph>
    <LegalParagraph>
      The password is safely stored in our database in an encrypted format. Email addresses and
      passwords are <strong>not</strong> shared with any third party.
    </LegalParagraph>
    <LegalParagraph>
      <strong>Information provided by social authentication providers:</strong> If you choose to
      create an account on the website using either "Sign in with Facebook" or "Sign in with
      Google", Facebook or Google provide us with your email address and basic profile information
      (in the case of Facebook, this also includes your name and profile picture).{' '}
      <strong>We only keep your email address</strong>, which is used as an unique identifier to
      guarantee that only you can access your account. For that purpose, we may send you
      <strong>occasional emails for security purposes</strong>, such as email address verification
      or password reset. We do <strong>not</strong> send marketing emails.
    </LegalParagraph>
    <LegalParagraph>
      The other information that may be provided by the social authentication provider, besides your
      email address, is immediately discarded. It is <strong>not</strong> kept in database. It is
      not currently possible to prevent Facebook and Google from providing us some unnecessary
      information.
    </LegalParagraph>
    <LegalParagraph>
      Our use of information received from Google APIs will adhere to the{' '}
      <a
        href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
        target="_blank"
        rel="noreferrer"
      >
        Google API Services User Data Policy
      </a>
      , including the Limited Use requirements.
    </LegalParagraph>
    <LegalParagraph>
      <strong>Data stored and collected for analytics purposes:</strong> This website uses Google
      Analytics to access statistical data such as number of users and countries of origin. The data
      is <strong>fully anonymized</strong> by Google before being provided to us (including IP
      addresses) and no subset of the data can be associated with a specific person. These analytics
      function using cookies set by Google when access a Google-owned resource online. This website
      has no control over and is not responsible of managing these cookies.
    </LegalParagraph>
    <LegalParagraph>
      <strong>Cookies used by this website:</strong> This website uses the minimal amount of cookies
      required for its proper function, such as session cookies, and also uses a similar browser
      feature called Local Storage for convenience features such as remembering your user settings.
      This data is <strong>not</strong> stored on our side, only in your browser. You can use your
      browser settings pages to access, modify, or delete this data.
    </LegalParagraph>
    <SecondaryButton to="/">
      <ArrowLeft />
      <FormattedMessage id="legal.backToHome" />
    </SecondaryButton>
  </HomeLayout>
);

export default PrivacyPolicy;
