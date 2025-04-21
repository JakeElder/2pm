const prompt = ({ prompter }) => {
  const questions = [
    {
      type: "input",
      name: "name",
      message: "What's it called?",
    },
  ];

  return prompter.prompt(questions).then(async (res) => {
    const { default: slug } = await import("slug");
    const id = slug(res.name);
    return {
      ...res,
      id,
      dir: `src/models/${id}`,
    };
  });
};

module.exports = { prompt };
