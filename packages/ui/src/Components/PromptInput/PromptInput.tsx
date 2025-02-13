"use client";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import css from "./PromptInput.module.css";
import classNames from "classnames";
import { useEditor, EditorContent, Extension } from "@tiptap/react";
import Mention from "@tiptap/extension-mention";
import suggestionMentionHandler from "../../lib/mention-suggestion-handler";

type Props = {
  onSubmit?: (content: string) => void;
};

const PromptInput = ({ onSubmit }: Props) => {
  const DisableEnter = Extension.create({
    addKeyboardShortcuts() {
      return {
        "Shift-Enter": ({ editor }) => {
          return editor.commands.first(({ commands }) => [
            () => commands.newlineInCode(),
            () => commands.createParagraphNear(),
            () => commands.liftEmptyBlock(),
            () => commands.splitBlock(),
          ]);
        },
        Enter: ({ editor }) => {
          onSubmit?.(JSON.stringify(editor.getJSON()));
          return this.editor.commands.clearContent();
        },
      };
    },
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Document,
      Paragraph,
      Text,
      DisableEnter,
      Mention.configure({
        HTMLAttributes: { class: css["mention"] },
        suggestion: suggestionMentionHandler,
      }),
    ],
    content: "",
  });

  return (
    <div className={css["root"]}>
      <EditorContent
        editor={editor}
        className={classNames("reset", css["input"])}
      />
    </div>
  );
};

export default PromptInput;
