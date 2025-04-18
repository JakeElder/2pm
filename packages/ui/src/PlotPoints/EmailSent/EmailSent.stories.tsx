import type { Meta, StoryObj } from "@storybook/react";
import EmailSent from "./EmailSent";
import * as Frame from "../../Components/Frame";

const meta: Meta<typeof EmailSent> = {
  title: "Plot Points/EmailSent",
  component: EmailSent,
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

type Story = StoryObj<typeof EmailSent>;

export const Default: Story = {
  args: {
    reference: 1,
    email: "jake@2pm.io",
  },
};

export default meta;
