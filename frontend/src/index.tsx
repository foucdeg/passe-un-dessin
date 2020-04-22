/* eslint-disable @typescript-eslint/no-var-requires */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import configureStore from './redux/store';

const { store } = configureStore();

const rootEl = document.getElementById('root');

if (rootEl) {
  ReactDOM.render(<App store={store} />, rootEl);
}

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    if (rootEl) {
      ReactDOM.render(<NextApp store={store} />, rootEl);
    }
  });
}

navigator.serviceWorker.getRegistrations().then(registrations => {
  for (const registration of registrations) {
    registration.unregister();
  }
});
