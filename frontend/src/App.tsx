import React from 'react';

import { Provider } from 'react-redux';
import { Store } from 'redux';
import { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import AppCrashFallback from './components/AppCrashFallback';
import ErrorBoundary from './components/ErrorBoundary';
import Root from './components/Root';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';

interface Props {
  persistor: Persistor;
  store: Store;
}

const App: React.FunctionComponent<Props> = ({ persistor, store }) => (
  <ErrorBoundary FallbackComponent={AppCrashFallback}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Root>
            <Routes />
          </Root>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </ErrorBoundary>
);

export default App;
