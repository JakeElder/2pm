import reactElementToJSXString from "react-element-to-jsx-string";
import { NodeHtmlMarkdown } from "node-html-markdown";

const txt = (node: React.ReactNode) => {
  const jsx = reactElementToJSXString(node)
    .replace(/\s+(?=<)/g, "")
    .replace(/(?<=>)\s+/g, "")
    .replaceAll("{' '}", " ");

  return NodeHtmlMarkdown.translate(jsx);
};

export default txt;
