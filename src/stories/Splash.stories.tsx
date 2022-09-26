import { ComponentStory, ComponentMeta } from '@storybook/react';

import Splash from '../renderer/Generics/redesign/Splash/Splash';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Generic/SplashScreen',
  component: Splash,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Splash>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Splash> = (args) => <Splash {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  title: 'Welcome to NiceNode',
  description: 'Run a node how you want it — without commands and a terminal. NiceNode shows what the node is doing at a glance. Stats like how many peer nodes are connected and synching progress are built into the app.'
};
