---
to: <%= dir %>/<%= name %>/<%= name %>.tsx
---
import React from "react";
import css from "./<%= name %>.module.css";

type Props = {};

const <%= name %> = ({}: Props) => {
  return <div className={css["root"]}><%= name %></div>;
};

export default <%= name %>;
