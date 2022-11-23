import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ContentHeader } from '../../renderer/Generics/redesign/ContentHeader/ContentHeader';

export default {
  title: 'Generic/ContentHeader',
  component: ContentHeader,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ContentHeader>;

const Template: ComponentStory<typeof ContentHeader> = (args) => (
  <ContentHeader {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  title: 'Title',
  subtitle: 'Subtitle',
  leftButtonIconId: 'left',
  rightButtonIconId: 'close',
};
