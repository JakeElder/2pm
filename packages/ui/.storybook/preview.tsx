import type { Preview } from "@storybook/react";
import "reset-css";
import Theme from "../src/Components/Theme";
import "../src/globals.css";

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Theme>
          <Story />
        </Theme>
      );
    },
  ],
};

export default preview;
