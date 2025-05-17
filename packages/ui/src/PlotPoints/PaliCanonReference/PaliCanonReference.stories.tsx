import type { Meta, StoryObj } from "@storybook/react";
import PaliCanonReference from "./PaliCanonReference";
import * as Frame from "../../Components/Frame";

const meta: Meta<typeof PaliCanonReference> = {
  title: "Plot Points/PaliCanonReference",
  component: PaliCanonReference,
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

type Story = StoryObj<typeof PaliCanonReference>;

export const Default: Story = {
  args: {
    basket: "sutta",
    author: "sujato",
    children: (
      <>
        Others will have wrong thought, but here we will have right thought.’
        ‘Others will have wrong speech, but here we will have right speech.’
        ‘Others will have wrong action, but here we will have right action.’
        ‘Others will have wrong livelihood, but here we will have right
        livelihood.’ ‘Others will have wrong effort, but here we will have right
        effort.’ ‘Others will have wrong mindfulness, but here we will have
        right mindfulness.’ ‘Others will have wrong immersion, but here we will
        have right immersion.’ ‘Others will have wrong knowledge, but here we
        will have right knowledge.’ ‘Others will have wrong freedom, but here we
        will have right freedom.’ ‘Others will be overcome with dullness and
        drowsiness, but here we will be rid of dullness and drowsiness.’ ‘Others
        will be restless, but here we will not be restless.’ ‘Others will have
        doubts, but here we will have gone beyond doubt.’ ‘Others will be
        irritable, but here we will be without anger.’ ‘Others will be
        acrimonious, but here we will be without acrimony.’ ‘Others will be
        offensive, but here we will be inoffensive.’ ‘Others will be
        contemptuous, but here we will be without contempt.’ ‘Others will be
        jealous, but here we will be without jealousy.’ ‘Others will be stingy,
        but here we will be without stinginess.
      </>
    ),
  },
};

export default meta;
