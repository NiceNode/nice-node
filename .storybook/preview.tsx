import React from 'react';

import RedesignContainer from '../src/renderer/Generics/redesign/RedesignContainer';
import type { Preview } from '@storybook/react';

export const parameters = {
  // actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      // color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
const preview: Preview = {
  parameters,
  decorators: [
    (Story) => (
      <RedesignContainer>
        <Story />
      </RedesignContainer>
    ),
  ],
};

export default preview;
