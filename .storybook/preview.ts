import type { Preview } from "@storybook/react-vite";

// @ts-expect-error - CSS import works at runtime despite TS error
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    layout: "centered",

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: "todo",
    },
  },
};

export default preview;
