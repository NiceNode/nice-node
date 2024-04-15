import path from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-mdx-gfm',
  ],
  logLevel: 'debug',
  // typescript: {
  //   reactDocgen: 'react-docgen-typescript-plugin',
  // },
  docs: {
    autodocs: 'tag',
  },

  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
};

export default config;
