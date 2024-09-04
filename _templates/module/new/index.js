const prompt = ({ prompter }) => {
  const questions = [
    {
      type: "autocomplete",
      name: "type",
      message: "What type of module?",
      initial: 0,
      choices: ["Package", "App"],
    },
    {
      type: "input",
      name: "name",
      message: "What's it called?",
    },
  ];

  return prompter.prompt(questions).then(async (res) => {
    const { default: slug } = await import("slug");
    return {
      ...res,
      id: slug(res.name),
      namespace: "2pm",
      dir: `${res.type.toLowerCase()}s`,
    };
  });
};

module.exports = { prompt };
