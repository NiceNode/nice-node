import { ComponentStory, ComponentMeta } from '@storybook/react';

import { UpdateCallout } from '../../renderer/Generics/redesign/UpdateCallout/UpdateCallout';

export default {
  title: 'Generic/UpdateCallout',
  component: UpdateCallout,
} as ComponentMeta<typeof UpdateCallout>;

const Template: ComponentStory<typeof UpdateCallout> = (args) => (
  <UpdateCallout {...args} />
);

export const Single = Template.bind({});
