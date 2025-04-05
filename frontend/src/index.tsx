/* eslint-disable @typescript-eslint/no-var-requires */
import * as Sentry from '@sentry/react';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { createRoot } from 'react-dom/client';

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
    release: import.meta.env.VITE_SENTRY_RELEASE,
    environment: window.config.sentry.environment,
    integrations: [Sentry.browserTracingIntegration()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: parseInt(import.meta.env.VITE_SENTRY_TRACING || '0'),
  });
}

const { store } = configureStore();

const rootEl = document.getElementById('root');

if (rootEl) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const root = createRoot(rootEl!);
  root.render(<App store={store} />);
}

navigator.serviceWorker &&
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
