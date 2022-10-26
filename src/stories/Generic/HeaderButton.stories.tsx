import { ComponentStory, ComponentMeta } from '@storybook/react';

import { HeaderButton } from '../../renderer/Generics/redesign/HeaderButton/HeaderButton';

export default {
  title: 'Generic/HeaderButton',
  component: HeaderButton,
} as ComponentMeta<typeof HeaderButton>;

const Template: ComponentStory<typeof HeaderButton> = (args) => (
  <HeaderButton {...args} />
);

export const Close = Template.bind({});
Close.args = {
  type: 'close',
  onClick: () => {
    console.log('close!');
  },
};

export const Left = Template.bind({});
Left.args = {
  type: 'left',
  onClick: () => {
    console.log('left!');
  },
};

export const Filter = Template.bind({});
Filter.args = {
  type: 'filter',
  onClick: () => {
    console.log('filter!');
  },
};
