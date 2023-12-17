import fs from 'fs';
import { defineConfig, HttpProxy, ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import mkcert from 'vite-plugin-mkcert';
import serveStatic from 'serve-static';

function configure(proxy: HttpProxy.Server) {
  proxy.on('proxyReq', (proxyReq, req, res) => {
    proxyReq.setHeader('x-request-id', Math.random().toString(36).substring(2, 9));
  });
}

const proxyToBackend: ProxyOptions = {
  target: 'http://localhost:8000',
  changeOrigin: true,
  secure: false,
  configure,
};

const drawingsPlugin = () => ({
  name: 'drawings-plugin',
  configureServer(server) {
    server.middlewares.use('/drawings', serveStatic(__dirname + '/../drawings'));
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin(), mkcert(), drawingsPlugin()],
  server: {
    port: 3000,
    https: {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost.pem'),
    },
    proxy: {
      '/api': proxyToBackend,
      '/admin': proxyToBackend,
      '/djangostatic': proxyToBackend,
      '/__debug__': proxyToBackend,
    },
  },
  build: {
    outDir: 'build',
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
});
