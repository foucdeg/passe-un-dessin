const {
  override,
  overrideDevServer,
  addBundleVisualizer,
  addWebpackPlugin,
  addBabelPlugin,
} = require('customize-cra');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const SitemapPlugin = require('sitemap-webpack-plugin').default;
const paths = ['/', '/leaderboard'];

module.exports = {
  webpack: override(
    addBundleVisualizer(
      {
        analyzerMode: 'static',
        reportFilename: 'report.html',
      },
      true,
    ),
    // We generate a manifest with all of Webpack's output files. It contains
    // the path to theoverrideDevServer file and an isInitial boolean.
    // We use this boolean later to only inject the initial chunks into the
    // app's HTML.
    addWebpackPlugin(
      new WebpackManifestPlugin({
        fileName: 'static-manifest.json', // manifest.json was already taken (PWA)
        publicPath: '',
        generate: (seed, files) =>
          files.reduce(
            (manifest, { name, path, isInitial }) => ({
              ...manifest,
              [name]: { path, isInitial },
            }),
            seed,
          ),
      }),
    ),
    addWebpackPlugin(
      new SitemapPlugin({
        base: 'https://passeundessin.com',
        paths,
        options: { lastmod: true },
      }),
    ),
    addBabelPlugin([
      'babel-plugin-styled-components',
      {
        displayName: true,
      },
    ]),
  ),
};
