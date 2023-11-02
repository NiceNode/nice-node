import { Meta } from '@storybook/react';

import RemoveNode from '../../renderer/Presentational/RemoveNodeModal/RemoveNode';

export default {
  title: 'Presentational/RemoveNode',
  component: RemoveNode,
} as Meta<typeof RemoveNode>;

export const Primary = {
  args: {
    nodeStorageUsedGBs: 100.543,
  },
};
