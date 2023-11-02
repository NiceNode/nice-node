import { Meta } from '@storybook/react';

import SpecialSelect from '../../renderer/Generics/redesign/SpecialSelect/SpecialSelect';

export default {
  title: 'Generic/SpecialSelect',
  component: SpecialSelect,
} as Meta<typeof SpecialSelect>;

export const Primary = {
  args: {
    options: [
      {
        iconId: 'nimbus',
        title: 'Nimbus',
        value: 'nimbus',
        label: 'Nimbus',
        info: 'Consensus Client',
        minority: true,
      },
      {
        iconId: 'teku',
        title: 'Teku',
        info: 'Consensus Client',
        value: 'prysm',
        label: 'Prysm',
        minority: true,
      },
      {
        iconId: 'lighthouse',
        title: 'Lighthouse',
        value: 'lighthouse',
        label: 'Lighthouse',
        info: 'Consensus Client',
      },
      {
        iconId: 'prysm',
        title: 'Prysm',
        info: 'Consensus Client',
        value: 'prysm',
        label: 'Prysm',
      },
      {
        iconId: 'lodestar',
        title: 'Lodestar',
        value: 'lodestar',
        label: 'Lodestar',
        info: 'Consensus Client',
        minority: true,
      },
    ],
  },
};
