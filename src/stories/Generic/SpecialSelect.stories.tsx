import { ComponentStory, ComponentMeta } from '@storybook/react';

import SpecialSelect from '../../renderer/Generics/redesign/SpecialSelect/SpecialSelect';

export default {
  title: 'Generic/SpecialSelect',
  component: SpecialSelect,
} as ComponentMeta<typeof SpecialSelect>;

const Template: ComponentStory<typeof SpecialSelect> = (args) => <SpecialSelect {...args} />;

export const Primary = Template.bind({});
Primary.args = {
};
