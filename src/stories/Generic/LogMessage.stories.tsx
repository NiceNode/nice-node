import { Story, Meta } from '@storybook/react';
import {
  LogMessage,
  LogMessageProps,
} from '../../renderer/Generics/redesign/LogMessage/LogMessage';
import FloatingButton from '../../renderer/Generics/redesign/FloatingButton/FloatingButton';

export default {
  title: 'Generic/LogMessage',
  component: LogMessage,
} as Meta;

const Template: Story<LogMessageProps> = (args) => <LogMessage {...args} />;

export const InfoMessage = Template.bind({});
InfoMessage.args = {
  timestamp: Date.now(),
  level: 'INFO',
  message: 'This is an info message',
};

export const WarningMessage = Template.bind({});
WarningMessage.args = {
  timestamp: Date.now(),
  level: 'WARNING',
  message: 'This is a warning message',
};

export const ErrorMessage = Template.bind({});
ErrorMessage.args = {
  timestamp: Date.now(),
  level: 'ERROR',
  message: 'This is an error message',
};

export const CustomTimestamp = Template.bind({});
CustomTimestamp.args = {
  timestamp: Date.now(),
  level: 'CUSTOM',
  message: 'This is a message with a custom timestamp',
};

export const LongMessage = Template.bind({});
LongMessage.args = {
  timestamp: Date.now(),
  level: 'INFO',
  message:
    'This is a very long message that extends beyond the typical message size. It should wrap and display properly within the component.',
};

export const WithFloatingButton = Template.bind({});
WithFloatingButton.args = {
  timestamp: Date.now(),
  level: 'INFO',
  message: 'This message includes a FloatingButton',
};
WithFloatingButton.decorators = [
  (Story) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Story />
      <div style={{ marginLeft: '10px' }}>
        <FloatingButton
          variant="icon"
          iconId="copy"
          onClick={() => alert('Button Clicked')}
        />
      </div>
    </div>
  ),
];
