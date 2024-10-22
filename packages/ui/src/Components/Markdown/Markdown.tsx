import React from "react";
import ReactMarkdown, { Options } from "react-markdown";
import css from "./Markdown.module.css";
import classNames from "classnames";

const Markdown = (props: Options) => {
  return (
    <ReactMarkdown
      {...props}
      allowedElements={["a"]}
      unwrapDisallowed={true}
      components={{
        a({ className, node, ref, children, ...rest }) {
          const cn = classNames(className, {
            [css["email"]]: rest.href?.startsWith("mailto:"),
          });
          return (
            <a className={cn} {...rest}>
              {children as any}
            </a>
          );
        },
      }}
    />
  );
};

export default Markdown;
