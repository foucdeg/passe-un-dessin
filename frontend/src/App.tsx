import React from 'react';

import { Provider } from 'react-redux';
import { Store } from '@reduxjs/toolkit';

import { BrowserRouter } from 'react-router-dom';
import AppCrashFallback from './components/AppCrashFallback';
import ErrorBoundary from './components/ErrorBoundary';
import Root from './components/Root';
import Routes from './routes';

interface Props {
  store: Store;
}

const App: React.FunctionComponent<Props> = ({ store }) => (
  <ErrorBoundary FallbackComponent={AppCrashFallback}>
    <Provider store={store}>
      <BrowserRouter>
        <Root>
          <Routes />
        </Root>
      </BrowserRouter>
    </Provider>
  </ErrorBoundary>
);

export default App;
