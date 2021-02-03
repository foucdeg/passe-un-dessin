/* eslint @typescript-eslint/no-var-requires: 0 */
const { createProxyMiddleware } = require('http-proxy-middleware');

const proxyConfig = {
  target: 'http://localhost:8000',
  changeOrigin: true,
  onProxyReq(proxyReq) {
    proxyReq.setHeader('x-request-id', Math.random().toString(36).substr(2, 9));
  },
};

module.exports = function (app) {
  app.use('/api', createProxyMiddleware(proxyConfig));
  app.use('/admin', createProxyMiddleware(proxyConfig));
  app.use('/djangostatic', createProxyMiddleware(proxyConfig));
  app.use(
    '/drawings',
    createProxyMiddleware({
      target: 'http://localhost:8888',
      changeOrigin: true,
    }),
  );
};
