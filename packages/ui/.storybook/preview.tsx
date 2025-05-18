import type { Preview } from "@storybook/react";
import "reset-css";
import "../src/globals.css";
import ThemeProvider from "../src/Components/ThemeProvider";
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
        <ThemeProvider theme={DEFAULT_THEMES.dark}>
          <div data-root>
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
