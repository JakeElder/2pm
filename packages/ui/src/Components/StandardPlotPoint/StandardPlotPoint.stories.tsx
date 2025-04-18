import type { Meta, StoryObj } from "@storybook/react";
import * as StandardPlotPoint from "./StandardPlotPoint";
import * as Frame from "../Frame";

const meta: Meta<typeof StandardPlotPoint> = {
  title: "Components/StandardPlotPoint",
  component: StandardPlotPoint.Root,
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

type Story = StoryObj<typeof StandardPlotPoint>;

export const Default: Story = {
  render() {
    return (
      <StandardPlotPoint.Root>
        <StandardPlotPoint.Header>
          <StandardPlotPoint.HeadingAndReference>
            <StandardPlotPoint.Heading> Plot Point</StandardPlotPoint.Heading>
            <StandardPlotPoint.Reference>1</StandardPlotPoint.Reference>
          </StandardPlotPoint.HeadingAndReference>
        </StandardPlotPoint.Header>
        <StandardPlotPoint.Body>
          A time to weep, and a time to laugh; a time to mourn, and a time to
          dance; A time to cast away stones, and a time to gather stones
          together; a time to embrace, and a time to refrain from embracing; A
          time to get, and a time to lose; a time to keep, and a time to cast
          away; A time to rend, and a time to sew; a time to keep silence, and a
          time to speak; A time to love, and a time to hate; a time of war, and
          a time of peace.
        </StandardPlotPoint.Body>
      </StandardPlotPoint.Root>
    );
  },
};

export default meta;
