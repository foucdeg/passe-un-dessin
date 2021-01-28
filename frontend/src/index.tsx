/* eslint-disable @typescript-eslint/no-var-requires */
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import configureStore from './redux/store';

declare global {
  interface Window {
    config: {
      sentry: {
        dsn: string;
        environment: string;
      };
    };
  }
}

if (window.config && window.config.sentry && window.config.sentry.dsn) {
  Sentry.init({
    dsn: window.config.sentry.dsn,
    release: process.env.REACT_APP_SENTRY_RELEASE,
    environment: window.config.sentry.environment,
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: parseInt(process.env.REACT_APP_SENTRY_TRACING || '0'),
  });
}

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

navigator.serviceWorker &&
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
