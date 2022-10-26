import { ComponentStory, ComponentMeta } from '@storybook/react';

import ContentSingleClient from '../../renderer/Presentational/ContentSingleClient/ContentSingleClient';

export default {
  title: 'Presentational/ContentSingleClient',
  component: ContentSingleClient,
  argTypes: {},
} as ComponentMeta<typeof ContentSingleClient>;

const Template: ComponentStory<typeof ContentSingleClient> = (args) => (
  <ContentSingleClient {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
