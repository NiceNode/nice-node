import type { Meta } from '@storybook/react';

import { Checklist } from '../../renderer/Generics/redesign/Checklist/Checklist';

export default {
  title: 'Generic/Checklist',
  component: Checklist,
} as Meta<typeof Checklist>;

export const Primary = {
  args: {
    title: 'Node requirements',
    items: [
      {
        status: 'loading',
        checkTitle: 'Processor supported by clients',
      },
      {
        status: 'complete',
        checkTitle: 'At least 4GB of system memory (RAM)',
        valueText: 'System memory: 32GB',
      },
      {
        status: 'incomplete',
        checkTitle: 'Storage disk type is SSD',
        valueText: 'Disk type: Hard Disk Drive (HDD).',
        captionText:
          'While SSD is recommended you are still able to run a node with a HDD if you have 8GB or more of system memory (RAM) available.',
      },
      {
        status: 'error',
        checkTitle: 'Available disk space for fast sync is 500GB or more',
        valueText:
          'Selected disk: Macintosh HD with only 126GB free disk space.',
        captionText:
          ' Additional storage capacity is require to run this node type! Consider adding an external SSD.',
      },
    ],
  },
};
