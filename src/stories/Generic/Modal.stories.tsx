import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Modal } from '../../renderer/Generics/redesign/Modal/Modal';

export default {
  title: 'Generic/Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  screen: {
    route: 'addNode',
    type: 'modal',
  },
};
