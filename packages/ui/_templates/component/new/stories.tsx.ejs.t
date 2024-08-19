---
to: src/<%= type %>s/<%= name %>/<%= name %>.stories.tsx
---
import type { Meta, StoryObj } from "@storybook/react";
import <%= name %> from "./<%= name %>";

const meta: Meta<typeof <%= name %>> = {
  title: "<%= type %>s/<%= name %>",
  component: <%= name %>
};

type Story = StoryObj<typeof <%= name %>>;

export const Default: Story = {
  args: {}
};

export default meta;
