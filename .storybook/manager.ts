import { addons } from '@storybook/manager-api';
import niceNodeTheme from './niceNodeTheme';

addons.setConfig({
  theme: niceNodeTheme,
});
