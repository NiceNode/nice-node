import { StoryFn, Meta } from '@storybook/react';
import { NodeIconId } from '../../renderer/assets/images/nodeIcons';

import SelectCard from '../../renderer/Generics/redesign/SelectCard/SelectCard';

export default {
  title: 'Generic/SelectCard',
  component: SelectCard,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof SelectCard>;

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

const NetworksTemplate: StoryFn<typeof SelectCard> = () => (
  <>
    {networksCards.map((obj) => {
      const { iconId, ...rest } = obj;
      return <SelectCard iconId={iconId as NodeIconId} {...rest} />;
    })}
  </>
);

const ClientsTemplate: StoryFn<typeof SelectCard> = () => (
  <>
    {clientsCards.map((obj) => {
      const { iconId, ...rest } = obj;
      return <SelectCard iconId={iconId as NodeIconId} {...rest} />;
    })}
  </>
);

export const Networks = {
  render: NetworksTemplate,
};
export const Clients = {
  render: ClientsTemplate,
};
