import type { Meta } from "@storybook/react";

import { NotificationItem } from "../../renderer/Generics/redesign/NotificationItem/NotificationItem";

export default {
  title: "Generic/NotificationItem",
  component: NotificationItem,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as Meta<typeof NotificationItem>;

export const Completed = {
  args: {
    unread: true,
    status: "completed",
    title: "Client successfuly updated",
    description: "Lodestar consensus client",
    timestamp: 1673384953,
  },
};
