import type { Meta } from "@storybook/react";

import NodeIcon from "../../renderer/Generics/redesign/NodeIcon/NodeIcon";

export default {
  title: "Generic/NodeIcon",
  component: NodeIcon,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as Meta<typeof NodeIcon>;

export const Default = {
  args: {
    iconId: "ethereum",
    size: "small",
  },
};

export const Small = {
  args: {
    iconId: "ethereum",
    status: "healthy",
    size: "small",
  },
};

export const Medium = {
  args: {
    iconId: "ethereum",
    status: "warning",
    size: "medium",
  },
};

export const Large = {
  args: {
    iconId: "ethereum",
    status: "error",
    size: "large",
  },
};
