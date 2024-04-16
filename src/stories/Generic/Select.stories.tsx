import type { Meta } from "@storybook/react";

import Select from "../../renderer/Generics/redesign/Select/Select";

export default {
  title: "Generic/Select",
  component: Select,
} as Meta<typeof Select>;

export const Single = {
  args: {
    value: "dark",
    options: [
      {
        value: "auto",
        label: "Auto (Follows computer settings)",
      },
      { value: "light", label: "Light mode" },
      { value: "dark", label: "Dark mode" },
    ],
  },
};
