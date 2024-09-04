const prompt = ({ prompter }) => {
  const questions = [
    {
      type: "autocomplete",
      name: "type",
      message: "What type of component?",
      initial: 0,
      choices: ["Client", "Server"],
    },
    {
      type: "input",
      name: "name",
      message: "What's it called?",
    },
  ];

  return prompter.prompt(questions).then((res) => {
    return { ...res, type: res.type.toLowerCase() };
  });
};

module.exports = { prompt };
