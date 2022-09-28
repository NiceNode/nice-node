import { ComponentStory, ComponentMeta } from '@storybook/react';

import ProgressBar from '../renderer/Generics/redesign/ProgressBar/ProgressBar';

export default {
  title: 'Generic/ProgressBar',
  component: ProgressBar,
  argTypes: {
    progress: { control: 'number' },
    color: { control: 'color' }
  },
} as ComponentMeta<typeof ProgressBar>;

const Template: ComponentStory<typeof ProgressBar> = (args) => <ProgressBar {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  progress: 23
};


