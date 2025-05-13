"use client";

import React, { useCallback } from "react";
import { useEditor, EditorContent, UseEditorOptions } from "@tiptap/react";
import { Editor, Extension, Extensions } from "@tiptap/core";
import { generateHTML } from "@tiptap/html";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Italic from "@tiptap/extension-italic";
import Mention, { MentionOptions } from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import { ProseDto } from "@2pm/core";
import css from "./Prose.module.css";
import suggestion from "./suggestion";

type SubmitShortcutExtensionOptions = {
  onSubmit: (editor: Editor) => void;
};

const SubmitShortcut = Extension.create<SubmitShortcutExtensionOptions>({
  name: "submitShortcut",
  addKeyboardShortcuts() {
    return {
      "Mod-Enter": () => {
        this.options.onSubmit(this.editor);
        return true;
      },
    };
  },
});

type Props = {
  content?: ProseDto;
  editable?: UseEditorOptions["editable"];
  onSubmit?: (editor: Editor) => void;
  suggestionItems?: MentionOptions["suggestion"]["items"];
};

const Prose = ({
  content,
  editable = true,
  onSubmit,
  suggestionItems,
}: Props) => {
  const handleSubmit = useCallback(
    (editor: Editor) => onSubmit?.(editor),
    [onSubmit],
  );

  const extensions: Extensions = [
    Document,
    Paragraph,
    Text,
    Bold,
    Underline,
    Italic,
    Code,
    History,
    SubmitShortcut.configure({
      onSubmit: handleSubmit,
    }),
    Mention.configure({
      HTMLAttributes: { class: css["mention"] },
      suggestion: { ...suggestion, items: suggestionItems },
    }),
  ];

  const editor = useEditor({
    immediatelyRender: false,
    content,
    editable,
    extensions,
  });

  const __html = generateHTML(
    content || { type: "doc", content: [] },
    extensions,
  );

  if (!editable) {
    return (
      <div className={css["root"]}>
        <div className={css["view"]} dangerouslySetInnerHTML={{ __html }} />
      </div>
    );
  }

  if (!editor) {
    return (
      <div className={css["root"]}>
        <div
          className={css["input"]}
          dangerouslySetInnerHTML={{ __html: __html || "&nbsp;" }}
        />
      </div>
    );
  }

  return (
    <div className={css["root"]}>
      <div className={css["input"]}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Prose;
