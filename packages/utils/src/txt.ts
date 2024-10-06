import { NodeHtmlMarkdown } from "node-html-markdown";

const txt = (node: React.ReactNode) => {
  const { renderToStaticMarkup } = require("react-dom/server");
  return NodeHtmlMarkdown.translate(renderToStaticMarkup(node));
};

export default txt;
