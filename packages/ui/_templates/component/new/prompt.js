module.exports = [
  {
    type: "autocomplete",
    name: "type",
    message: "What type of component?",
    initial: 1,
    choices: ["Element", "Component", "Layout", "Page"]
  },
  {
    type: "input",
    name: "name",
    message: "What's it called?"
  }
];
