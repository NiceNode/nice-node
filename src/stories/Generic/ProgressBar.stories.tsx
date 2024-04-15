import type { Meta, StoryFn } from "@storybook/react";

import ProgressBar from "../../renderer/Generics/redesign/ProgressBar/ProgressBar";
import TimedProgressBar from "../../renderer/Generics/redesign/ProgressBar/TimedProgressBar";

export default {
  title: "Generic/ProgressBar",
  component: ProgressBar,
  argTypes: {
    progress: { control: "number" },
    color: { control: "color" },
  },
} as Meta<typeof ProgressBar>;

export const Primary = {
  args: {
    title: "A task is taking place...",
    caption: "Parent component controls the progress :)",
    progress: 23,
  },
};

export const Card = {
  args: {
    card: true,
    color: "green",
    progress: 23,
    caption: "Initial sync in progress. Around 2 days remaining...",
  },
};

const TimedTemplate: StoryFn<typeof TimedProgressBar> = (args) => (
  <TimedProgressBar {...args} />
);

export const TimedWithNoExtraProps = {
  render: TimedTemplate,

  args: {
    title: "A one minute progress bar",
    totalTimeSeconds: 60,
  },
};

export const Timed = {
  render: TimedTemplate,

  args: {
    title: "A one minute progress bar",
    caption:
      "Sometimes we can only estimate only long something might take and we don't know intermediate progress.",
    totalTimeSeconds: 60,
  },
};
