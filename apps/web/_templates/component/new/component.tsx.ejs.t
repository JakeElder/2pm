---
to: src/components/<%= type %>/<%= name %>.tsx
---
<% if (type === 'client') { -%>
"use client";

<% } -%>
type Props = {};

const <%= name %> = <%= type  === 'client' ? '' : 'async ' %>({}: Props) => {
  return <><%= name %></>;
};

export default <%= name %>;
