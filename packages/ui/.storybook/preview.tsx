import type { Preview } from "@storybook/react";
import "reset-css";
import "../src/globals.css";
import Theme from "../src/Components/Theme";
import { DEFAULT_THEMES } from "@2pm/core";

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
        <Theme theme={DEFAULT_THEMES.dark}>
          <div data-root>
            <Story />
          </div>
        </Theme>
      );
    },
  ],
};

export default preview;
