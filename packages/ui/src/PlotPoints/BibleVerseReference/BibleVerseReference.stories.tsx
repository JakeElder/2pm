import type { Meta, StoryObj } from "@storybook/react";
import BibleVerseReference from "./BibleVerseReference";
import * as Frame from "../../Components/Frame";

const meta: Meta<typeof BibleVerseReference> = {
  title: "Plot Points/BibleVerse",
  component: BibleVerseReference,
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

type Story = StoryObj<typeof BibleVerseReference>;

export const Default: Story = {
  args: {
    verse: "Job 11:18",
    children: (
      <>
        Because thou shalt forget thy misery, and remember it as waters that
        pass away: And thine age shall be clearer than the noonday; thou shalt
        shine forth, thou shalt be as the morning. And thou shalt be secure,
        because there is hope; yea, thou shalt dig about thee, and thou shalt
        take thy rest in safety. Also thou shalt lie down, and none shall make
        thee afraid; yea, many sh all make suit unto thee. But the eyes of the
        wicked shall fail, and they shall not escape, and their hope shall be as
        the giving up of the ghost.
      </>
    ),
  },
};

export default meta;
