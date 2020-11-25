/* eslint @typescript-eslint/no-var-requires: 0 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    }),
  );
  app.use(
    '/admin',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    }),
  );
  app.use(
    '/djangostatic',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    }),
  );
  app.use(
    '/drawings',
    createProxyMiddleware({
      target: 'http://localhost:8888',
      changeOrigin: true,
    }),
  );
};
