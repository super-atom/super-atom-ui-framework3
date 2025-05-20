import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.common.mjs';
import ESLintPlugin from 'eslint-webpack-plugin';
import ENV from './env.js';
import { cssLoaders } from './util.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(common, {
  mode: 'development',
  stats: {
    warnings: false,
  },

  devtool: 'inline-source-map',
  target: 'web',
  devServer: {
    client: {
      overlay: {
        errors: false,
        warnings: false,
      },
    },
    static: {
      directory: path.join(__dirname, '../dist'),
      publicPath: '/',
      watch: true,
    },
    compress: true,
    open: true,
    port: ENV.server.port,
    liveReload: true,
    hot: true,
    host: 'localhost',
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 300,
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.(css)$/,
        use: ['style-loader', ...cssLoaders],
      },
    ],
  },
  plugins: [
    new ESLintPlugin({
      emitWarning: true,
      files: path.resolve(__dirname, '../src'),
    }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false),
    }),
    new webpack.HotModuleReplacementPlugin({}),
  ],
});
