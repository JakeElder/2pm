import type { Meta, StoryObj } from "@storybook/react";
import BibleVerse from "./BibleVerse";
import * as Frame from "../../Components/Frame";

const meta: Meta<typeof BibleVerse> = {
  title: "Plot Points/BibleVerse",
  component: BibleVerse,
  decorators: [
    (Story) => {
      return (
        <Frame.PlotPoint>
          <Story />
        </Frame.PlotPoint>
      );
    },
  ],
};

type Story = StoryObj<typeof BibleVerse>;

export const Default: Story = {
  args: {
    verse: "Ecclesiastes 3:6",
    reference: 1,
    children: (
      <>
        A time to weep, and a time to laugh; a time to mourn, and a time to
        dance; A time to cast away stones, and a time to gather stones together;
        a time to embrace, and a time to refrain from embracing; A time to get,
        and a time to lose; a time to keep, and a time to cast away; A time to
        rend, and a time to sew; a time to keep silence, and a time to speak; A
        time to love, and a time to hate; a time of war, and a time of peace.
      </>
    ),
  },
};

export default meta;
