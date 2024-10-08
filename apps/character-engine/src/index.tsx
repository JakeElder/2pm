import { Message as OllamaMessage, Ollama } from "ollama";
import OpenAI from "openai";
import { txt } from "@2pm/utils";

type OpenAiMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;
type OpenAiTool = OpenAI.Chat.Completions.ChatCompletionTool;

class CharacterEngine {
  private ollama: Ollama;
  private openai: OpenAI;

  constructor(host?: string) {
    this.ollama = new Ollama({ host });
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async greet() {
    const messages: OpenAiMessage[] = [
      {
        role: "system",
        content: txt(
          <>
            Repeat the following message, exactly "Welcome back friend. Let's
            get you authenticated"
          </>,
        ),
      },
    ];

    const res = await this.openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      messages,
    });

    return res;
  }

  async chat(content: string) {
    const messages: OllamaMessage[] = [{ role: "user", content }];

    const res = this.ollama.chat({
      model: "llama3.1:8b",
      messages,
      stream: true,
    });

    return res;
  }

  async evaluate(messages: OpenAiMessage[]) {
    const params: OpenAiTool["function"]["parameters"] = {
      type: "object",
      properties: {},
      additionalProperties: false,
    };

    const res = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [],
      tools: [
        {
          type: "function",
          function: {
            name: "respond_general",
            description: "Make a general response",
            strict: true,
            parameters: { ...params },
          },
        },
        {
          type: "function",
          function: {
            name: "noop",
            description: "Sometimes no action is required",
            strict: true,
            parameters: { ...params },
          },
        },
        {
          type: "function",
          function: {
            name: "report_abuse",
            description: "If someone is being abusive",
            strict: true,
            parameters: { ...params },
          },
        },
      ],
      tool_choice: "required",
    });

    return res;
  }
}

// "Write a paragraph about how UX has not caught up with LLMs. Format in markdown",

export default CharacterEngine;
