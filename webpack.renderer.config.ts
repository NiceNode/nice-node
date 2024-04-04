import type { Configuration } from 'webpack';

import dotenv from 'dotenv';
import { rules } from './webpack.rules';
import { frontEndPlugins } from './webpack.plugins';

// NN imports
dotenv.config();

// rules.push({
//   test: /\.css$/,
//   use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
// });

rules.push(
  ...[
    // Required for vanilla-extract to set classes on components
    {
      test: /\.(js|ts|tsx)$/,
      exclude: [/node_modules/],
      use: [
        {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              '@babel/preset-typescript',
              ['@babel/preset-react', { runtime: 'automatic' }],
              ['@babel/preset-env', { targets: { node: 14 }, modules: false }],
            ],
            plugins: ['@vanilla-extract/babel-plugin'],
          },
        },
      ],
    },
    {
      test: /\.s?css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            // modules: true,
            sourceMap: true,
            // importLoaders: 1,
          },
        },
        'sass-loader',
      ],
      include: /\.module\.s?(c|a)ss$/,
    },
    {
      test: /\.s?css$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      exclude: /\.module\.s?(c|a)ss$/,
    },
    // Fonts
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    },
    // Images
    {
      test: /\.(png|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    },
    // SVGs - converts svg files to React Components
    {
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: false,
            svgoConfig: {
              plugins: [{ removeViewBox: false }],
            },
            titleProp: true,
            ref: true,
          },
        },
        'file-loader',
      ],
    },
  ],
);

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins: frontEndPlugins,
  resolve: {
    extensions: [
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.css',
      '.scss',
      '.png',
      '.svg',
      '.jpg',
    ],
  },
};
