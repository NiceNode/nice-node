import type { Meta, StoryObj } from "@storybook/react";
import FloatingButton from "../../renderer/Generics/redesign/FloatingButton/FloatingButton";
import { LogMessage } from "../../renderer/Generics/redesign/LogMessage/LogMessage";

export default {
  title: "Generic/LogMessage",
  component: LogMessage,
} as Meta;

export const InfoMessage = {
  args: {
    timestamp: Date.now(),
    level: "INFO",
    message: "This is an info message",
  },
};

export const WarningMessage = {
  args: {
    timestamp: Date.now(),
    level: "WARNING",
    message: "This is a warning message",
  },
};

export const ErrorMessage = {
  args: {
    timestamp: Date.now(),
    level: "ERROR",
    message: "This is an error message",
  },
};

export const CustomTimestamp = {
  args: {
    timestamp: Date.now(),
    level: "CUSTOM",
    message: "This is a message with a custom timestamp",
  },
};

export const LongMessage = {
  args: {
    timestamp: Date.now(),
    level: "INFO",
    message:
      "This is a very long message that extends beyond the typical message size. It should wrap and display properly within the component.",
  },
};

export const WithFloatingButton: StoryObj = {
  args: {
    timestamp: Date.now(),
    level: "INFO",
    message: "This message includes a FloatingButton",
  },

  decorators: [
    (Story) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Story />
        <div style={{ marginLeft: "10px" }}>
          <FloatingButton
            variant="icon"
            iconId="copy"
            onClick={() => alert("Button Clicked")}
          />
        </div>
      </div>
    ),
  ],
};
