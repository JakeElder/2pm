---
to: src/components/<%= type %>/<%= name %>.tsx
---
<% if (type === 'client') { -%>
'use client';
<% } -%>
interface Props {}

const <%= name %> = ({}: Props) => {
  return <><%= name %></>;
};

export default <%= name %>;
