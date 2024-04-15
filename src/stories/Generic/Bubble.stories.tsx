import type { Meta } from "@storybook/react";

import { Bubble } from "../../renderer/Generics/redesign/Bubble/Bubble";

export default {
  title: "Generic/Bubble",
  component: Bubble,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as Meta<typeof Bubble>;

export const Primary = {
  args: {
    count: 23,
  },
};
