---
to: <%= dir %>/<%= id %>/.tmuxinator.yml
---
name: "<%= name %>"
tmux_options: -L <%= namespace %>
attach: false

windows:
  - Vim: vim
  - Terminal:
