import type { Meta } from "@storybook/react";

import { Checkbox } from "../../renderer/Generics/redesign/Checkbox/Checkbox";

export default {
  title: "Generic/Checkbox",
  component: Checkbox,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as Meta<typeof Checkbox>;

export const Primary = {
  args: {},
};
