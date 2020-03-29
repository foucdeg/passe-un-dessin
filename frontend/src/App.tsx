import React from 'react';

import { Provider } from 'react-redux';
import { Store } from 'redux';

import AppCrashFallback from './components/AppCrashFallback';
import ErrorBoundary from './components/ErrorBoundary';
import Root from './components/Root';
import Routes from './routes';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';

interface Props {
  store: Store;
  history: History<History.PoorMansUnknown>;
}

const App: React.FunctionComponent<Props> = ({ store, history }) => (
  <ErrorBoundary FallbackComponent={AppCrashFallback}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Root>
          <Routes />
        </Root>
      </ConnectedRouter>
    </Provider>
  </ErrorBoundary>
);

export default App;
