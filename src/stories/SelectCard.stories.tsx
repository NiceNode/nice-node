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

const selectCards = [
  { iconId: 'ethereum', title: 'Ethereum', info: 'The world computer' },
  {
    iconId: 'zkSync',
    title: 'zkSync',
    info: 'A Zero Knowledge Rollup built to scale Ethereum.',
  },
  {
    iconId: 'arbitrum',
    title: 'Arbitrum Nitro',
    info: 'An Optimistic Rollup built to scale Ethereum.',
  },
  {
    iconId: 'starknet',
    title: 'Starknet',
    info: 'A Zero Knowledge Rollup built to scale Ethereum.',
  },
  {
    iconId: 'livepeer',
    title: 'Livepeer',
    info: 'A decentralized video streaming network built on Ethereum.',
  },
  {
    iconId: 'radicle',
    title: 'Radicle',
    info: 'Build software together. Manage your codebases on Ethereum.',
  },
  { iconId: 'nethermind', title: 'Nethermind', info: 'Execution Client' },
  { iconId: 'besu', title: 'Besu', info: 'Execution Client' },
  { iconId: 'lodestar', title: 'Lodestar', info: 'Consensus Client' },
  { iconId: 'nimbus', title: 'Nimbus', info: 'Consensus Client' },
];

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SelectCard> = (args) => (
  <>
    {selectCards.map((obj) => {
      return <SelectCard {...obj} />;
    })}
  </>
);

export const Ethereum = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Ethereum.args = {
  iconId: 'ethereum',
  title: 'Ethereum node',
  info: 'Mainnet',
};
