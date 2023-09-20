import { ComponentStory, ComponentMeta } from '@storybook/react';

import LabelSettings from '../../renderer/Generics/redesign/LabelSetting/LabelSettings';
import ExternalLink from '../../renderer/Generics/redesign/Link/ExternalLink';
import Select from '../../renderer/Generics/redesign/Select/Select';
import { Toggle } from '../../renderer/Generics/redesign/Toggle/Toggle';

export default {
  title: 'Generic/LabelSettings',
  component: LabelSettings,
  argTypes: {},
} as ComponentMeta<typeof LabelSettings>;

const Template: ComponentStory<typeof LabelSettings> = (args) => (
  <LabelSettings {...args} />
);

export const About = Template.bind({});
About.args = {
  title: 'More resources',
  items: [
    {
      sectionTitle: 'Preferences',
      items: [
        {
          label: 'Launch on startup',
          value: <Toggle checked={true} />,
          description:
            'NiceNode will automatically open when your computer starts up.',
          learnMoreLink: 'https://ethereum.org',
        },
        {
          label: 'Language',
          value: <Select options={[{ value: 'en', label: 'English' }]} />,
          learnMoreLink: 'https://nicenode.xyz',
        },
        {
          label: 'Website',
          value: (
            <ExternalLink url="https://ethereum.org" text="nimbus website" />
          ),
          description: 'this is kind of obvious, just here to test',
        },
        {
          label: 'Website',
          value: (
            <ExternalLink url="https://ethereum.org" text="Ethereum.org" />
          ),
        },
      ],
    },
  ],
};

export const Primary = Template.bind({});
Primary.args = {
  title: 'Node requirements',
  items: [
    {
      sectionTitle: 'cpu',
      items: [
        { label: 'Cores', value: '2' },
        { label: 'Min. clock speed', value: '2.2Ghz' },
      ],
    },
    {
      sectionTitle: 'storage',
      items: [
        { label: 'Type', value: 'SSD' },
        { label: 'IOPS', value: '1000IOPS' },
        { label: 'Capacity', value: '2TB' },
      ],
    },
    {
      sectionTitle: 'memory',
      items: [
        { label: 'Total', value: '8GB' },
        { label: 'Free', value: '4GB' },
      ],
    },
  ],
};
