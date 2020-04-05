import React, { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';

import { flattenMessages } from 'services/i18n/intl';
import enMessages from 'translations/en.json';
import frMessages from 'translations/fr.json';

/* Language polyfills needed for IE11, Edge, Safari 12 & 13 support
https://github.com/formatjs/react-intl/blob/master/docs/Upgrade-Guide.md#migrate-to-using-native-intl-apis
*/
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/dist/locale-data/en';
import '@formatjs/intl-pluralrules/dist/locale-data/fr';

import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/dist/locale-data/en';
import '@formatjs/intl-relativetimeformat/dist/locale-data/fr';
/* End of language polyfills */

import { RootContainer } from './Root.style';
import UserNameGate from 'components/UserNameGate';
import AudioControl from 'components/AudioControl';

const locales = {
  fr: flattenMessages(frMessages),
  en: flattenMessages(enMessages),
};

interface Props {
  children: ReactNode;
}

const Root: React.FunctionComponent<Props> = ({ children }) => (
  <IntlProvider locale="fr" messages={locales.fr}>
    <RootContainer>
      <AudioControl />
      <UserNameGate>{children}</UserNameGate>
    </RootContainer>
  </IntlProvider>
);

export default Root;
