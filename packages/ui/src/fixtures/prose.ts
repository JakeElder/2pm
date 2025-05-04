import { ProseDto } from "@2pm/core";

export const WITH_BOLD: ProseDto = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        { type: "text", text: "thank " },
        { type: "text", marks: [{ type: "bold" }], text: "you" },
        { type: "text", text: " sir" },
      ],
    },
  ],
};
