"use client";

import React, { useCallback } from "react";
import { useEditor, EditorContent, UseEditorOptions } from "@tiptap/react";
import { Editor, Extension, JSONContent } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import css from "./TiptapEditor.module.css";
import classNames from "classnames";

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
  content: JSONContent | undefined;
  editable: UseEditorOptions["editable"];
};

const TiptapEditor = ({ content, editable = true }: Props) => {
  const handleSubmit = useCallback((editor: Editor) => {
    const json = editor.getJSON();
    console.log(JSON.stringify(json));
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    content,
    editable,
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
  });

  return (
    <div className={css["root"]}>
      <div
        className={classNames({
          [css["input"]]: editable,
          [css["view"]]: !editable,
        })}
      >
        {editor ? <EditorContent editor={editor} /> : <>&nbsp;</>}
      </div>
    </div>
  );
};

export default TiptapEditor;
