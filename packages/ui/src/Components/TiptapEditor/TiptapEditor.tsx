"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import css from "./TiptapEditor.module.css";

const SubmitShortcut = Extension.create({
  name: "submitShortcut",
  addOptions() {
    return {
      onSubmit: () => {},
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Enter": () => {
        this.options.onSubmit();
        return true;
      },
    };
  },
});

type Props = {};

const TiptapEditor = ({}: Props) => {
  const handleSubmit = React.useCallback(() => {
    if (!editor) {
      console.log("no editor");
      return;
    }
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
    editorProps: {
      attributes: {
        class: css["input"],
      },
    },
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
};

export default TiptapEditor;
