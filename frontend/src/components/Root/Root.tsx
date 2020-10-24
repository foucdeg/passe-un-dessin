import React, { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';

import { flattenMessages } from 'services/i18n/intl';
import enMessages from 'translations/en.json';
import frMessages from 'translations/fr.json';

/* Language polyfills needed for IE11, Edge, Safari 12 & 13 support
https://github.com/formatjs/react-intl/blob/master/docs/Upgrade-Guide.md#migrate-to-using-native-intl-apis
*/
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/fr';
/* End of language polyfills */

import { useHistory } from 'react-router';
import useAnchors from 'useAnchors';
import { RootContainer } from './Root.style';
import UserNameGate from './components/UserNameGate';
import SideButtons from './components/SideButtons';
import MobileGate from './components/MobileGate';

const locales = {
  fr: flattenMessages(frMessages),
  en: flattenMessages(enMessages),
};

const userLocale = navigator.language.includes('fr') ? 'fr' : 'en';

interface Props {
  children: ReactNode;
}

const Root: React.FunctionComponent<Props> = ({ children }) => {
  const history = useHistory();
  useAnchors(history, 500);

  return (
    <IntlProvider locale={userLocale} messages={locales[userLocale]}>
      <MobileGate>
        <RootContainer>
          <UserNameGate>{children}</UserNameGate>
          <SideButtons />
        </RootContainer>
      </MobileGate>
    </IntlProvider>
  );
};

export default Root;
