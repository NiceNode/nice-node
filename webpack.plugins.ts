import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';
import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import webpack from 'webpack';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
];

export const frontEndPlugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),

  // NN plugins
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'development',
    // setting process.env.MP_PROJECT_TOKEN & MP_PROJECT_TOKEN overrides this
    // these are required to be declared here so webpack knows which to replace in code
    MP_PROJECT_TOKEN: 'FAKE',
    MP_PROJECT_ENV: 'dev',
    NICENODE_ENV: 'development',
  }),
  new VanillaExtractPlugin({ identifiers: 'debug' }),
];
