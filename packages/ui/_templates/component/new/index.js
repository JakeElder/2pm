const prompt = ({ prompter }) => {
  const questions = [
    {
      type: "autocomplete",
      name: "type",
      message: "What type of component?",
      initial: 1,
      choices: ["Element", "Component", "Plot Point", "Layout", "Page"],
    },
    {
      type: "input",
      name: "name",
      message: "What's it called?",
    },
  ];

  return prompter.prompt(questions).then((res) => {
    const dirs = {
      Element: "Elements",
      Component: "Components",
      "Plot Point": "PlotPoints",
      Layout: "Layouts",
      Page: "Pages",
    };
    const dir = dirs[res.type];
    return { ...res, dir: `src/${dir}` };
  });
};

module.exports = { prompt };
