"use client";

import React, { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Editor, Extension } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import css from "./TiptapEditor.module.css";

const SubmitShortcut = Extension.create<{ onSubmit: (editor: Editor) => void }>(
  {
    name: "submitShortcut",
    addKeyboardShortcuts() {
      return {
        "Mod-Enter": () => {
          this.options.onSubmit(this.editor);
          return true;
        },
      };
    },
  },
);

type Props = {};

const TiptapEditor = ({}: Props) => {
  const handleSubmit = useCallback((editor: Editor) => {
    const json = editor.getJSON();
    console.log(json);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
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
    ],
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [],
        },
      ],
    },
  });

  return (
    <div className={css["input"]}>
      {editor ? <EditorContent editor={editor} /> : <>&nbsp;</>}
    </div>
  );
};

export default TiptapEditor;
