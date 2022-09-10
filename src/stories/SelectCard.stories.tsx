import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SelectCard } from '../renderer/Generics/redesign/SelectCard';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/SelectCard',
  component: SelectCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof SelectCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SelectCard> = (args) => (
  <SelectCard {...args} />
);

export const Ethereum = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Ethereum.args = {
  iconId: 'ethereum',
  title: 'Ethereum node',
  info: 'Mainnet',
};
