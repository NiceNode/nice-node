import '../src/renderer/reset.css';
import '../src/renderer/Generics/redesign/globalStyle.css';
import '../src/renderer/i18n';

import RedesignContainer from '../src/renderer/Generics/redesign/RedesignContainer';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <RedesignContainer>
      <Story />
    </RedesignContainer>
  ),
];
