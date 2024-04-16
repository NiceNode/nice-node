import type { Meta } from "@storybook/react";

import ExternalLink from "../../renderer/Generics/redesign/Link/ExternalLink";

export default {
  title: "Generic/ExternalLink",
  component: ExternalLink,
} as Meta<typeof ExternalLink>;

export const Primary = {
  args: {
    text: "Docker Install Guide",
    url: "https://docs.docker.com/desktop/#download-and-install",
  },
};
