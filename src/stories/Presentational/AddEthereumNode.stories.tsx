import type { Meta, StoryObj } from "@storybook/react";

import AddNodeConfiguration from "../../renderer/Presentational/AddNodeConfiguration/AddNodeConfiguration";

export default {
  title: "Presentational/AddNodeConfiguration",
  component: AddNodeConfiguration,
} as Meta<typeof AddNodeConfiguration>;

export const Primary: StoryObj<typeof AddNodeConfiguration> = {
  args: {
    onChange: (newValue) => console.log(newValue),
  },
};
