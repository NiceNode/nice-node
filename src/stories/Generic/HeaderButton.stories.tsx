import type { Meta } from "@storybook/react";

import { HeaderButton } from "../../renderer/Generics/redesign/HeaderButton/HeaderButton";

export default {
  title: "Generic/HeaderButton",
  component: HeaderButton,
} as Meta<typeof HeaderButton>;

export const Close = {
  args: {
    type: "close",
    onClick: () => {
      console.log("close!");
    },
  },
};

export const Left = {
  args: {
    type: "left",
    onClick: () => {
      console.log("left!");
    },
  },
};

export const Filter = {
  args: {
    type: "filter",
    onClick: () => {
      console.log("filter!");
    },
  },
};
