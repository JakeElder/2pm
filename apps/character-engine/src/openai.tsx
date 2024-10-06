import OpenAI from "openai";

type Message = OpenAI.Chat.Completions.ChatCompletionMessageParam;
type Tool = OpenAI.Chat.Completions.ChatCompletionTool;

const evaluate = async () => {
  const messages: Message[] = [
    {
      role: "system",
      content:
        "You are responsible for assesing context and choosing an appropriate action",
    },
    {
      role: "system",
      content:
        "You can do nothing if it seems the user doesn't require an immediate action",
    },
    {
      role: "user",
      content: "Ok, I'm going to say some things",
    },
    {
      role: "user",
      content: "Are you going to listen?",
    },
    {
      role: "assistant",
      content: "Yep. Go ahead.",
    },
  ];

  // for await (const chunk of res) {
  //   process.stdout.write(chunk.choices[0]?.delta?.content || "");
  // }
};
