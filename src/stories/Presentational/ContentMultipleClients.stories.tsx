import { ComponentStory, ComponentMeta } from '@storybook/react';

import ContentMultipleClients from '../../renderer/Presentational/ContentMultipleClients/ContentMultipleClients';

export default {
  title: 'Presentational/ContentMultipleClients',
  component: ContentMultipleClients,
  argTypes: {},
} as ComponentMeta<typeof ContentMultipleClients>;

const Template: ComponentStory<typeof ContentMultipleClients> = (args) => (
  <ContentMultipleClients {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
