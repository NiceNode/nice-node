import { ComponentStory, ComponentMeta } from '@storybook/react';

import ExternalLink from '../../renderer/Generics/redesign/Link/ExternalLink';


export default {
  title: 'Generic/ExternalLink',
  component: ExternalLink,
} as ComponentMeta<typeof ExternalLink>;

const Template: ComponentStory<typeof ExternalLink> = (args) => <ExternalLink {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  text: 'Docker Install Guide',
  url: 'https://docs.docker.com/desktop/#download-and-install',
};


