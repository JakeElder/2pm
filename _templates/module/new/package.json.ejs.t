---
to: <%= dir %>/<%= id %>/package.json
sh: cd <%= dir %>/<%= id %> && bun install
---
{
  "name": "@<%= namespace %>/<%= id %>",
  "main": "src/index.ts",
}
