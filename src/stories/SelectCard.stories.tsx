import { ComponentStory, ComponentMeta } from '@storybook/react';
import { NodeIconId } from '../renderer/assets/images/nodeIcons';

import { SelectCard as OldSelectCard } from '../renderer/Generics/redesign/SelectCard';
import SelectCard from '../renderer/Generics/redesign/SelectCard/SelectCard';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/SelectCard',
  component: SelectCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof SelectCard>;

const networksCards = [
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
];

const clientsCards = [
  {
    iconId: 'geth',
    title: 'Geth',
    info: 'Execution Client',
    onClick: function () {
      console.log('hello');
    },
  },
  { iconId: 'erigon', title: 'Erigon', info: 'Execution Client' },
  { iconId: 'nethermind', title: 'Nethermind', info: 'Execution Client' },
  {
    iconId: 'besu',
    title: 'Besu',
    info: 'Execution Client',
    minority: true,
    onClick: function () {
      console.log('hello');
    },
  },
  { iconId: 'prysm', title: 'Prysm', info: 'Consensus Client' },
  { iconId: 'teku', title: 'Teku', info: 'Consensus Client', minority: true },
  { iconId: 'lighthouse', title: 'Lighthouse', info: 'Consensus Client' },
  { iconId: 'lodestar', title: 'Lodestar', info: 'Consensus Client' },
  { iconId: 'nimbus', title: 'Nimbus', info: 'Consensus Client' },
];

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const NetworksTemplate: ComponentStory<typeof SelectCard> = (args) => (
  <>
    {networksCards.map((obj) => {
      const darkMode = args.darkMode;
      const { iconId, ...rest } = obj
      return <OldSelectCard iconId={iconId as NodeIconId} {...rest} darkMode={darkMode} />;
    })}
  </>
);

const ClientsTemplate: ComponentStory<typeof SelectCard> = (args) => (
  <>
    {clientsCards.map((obj) => {
      const darkMode = args.darkMode;
      const { iconId, ...rest } = obj
      return <SelectCard iconId={iconId as NodeIconId} {...rest} darkMode={darkMode} />;
    })}
  </>
);

export const Networks = NetworksTemplate.bind({});
export const Clients = ClientsTemplate.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
