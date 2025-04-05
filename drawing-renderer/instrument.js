const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_BACKEND_DSN,
  environment: process.env.ENVIRONMENT,
});
