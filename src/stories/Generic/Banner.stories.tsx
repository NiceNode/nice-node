import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Banner } from '../../renderer/Generics/redesign/Banner/Banner';

export default {
  title: 'Generic/Banner',
  component: Banner,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Banner>;

const Template: ComponentStory<typeof Banner> = () => <Banner />;

export const Primary = Template.bind({});
