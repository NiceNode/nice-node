import { ComponentStory, ComponentMeta } from '@storybook/react';

import ContentClients from '../../renderer/Presentational/ContentClients/ContentClients';

export default {
  title: 'Presentational/ContentClients',
  component: ContentClients,
  argTypes: {},
} as ComponentMeta<typeof ContentClients>;

const Template: ComponentStory<typeof ContentClients> = (args) => (
  <ContentClients {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
