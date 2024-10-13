import { Message as OllamaMessage, Ollama } from "ollama";
import OpenAI from "openai";
import { mimicAi, txt } from "@2pm/utils";
import { PlotPointSummaryDto } from "@2pm/data";

type OpenAiMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;
type OpenAiTool = OpenAI.Chat.Completions.ChatCompletionTool;

class CharacterEngine {
  private ollama: Ollama;
  private openai: OpenAI;

  constructor(host?: string) {
    this.ollama = new Ollama({ host });
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  greet() {
    return mimicAi("Welcome back friend. Let's get you authenticated");
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

  async evaluate(narrative: PlotPointSummaryDto[]) {
    const params: OpenAiTool["function"]["parameters"] = {
      type: "object",
      properties: {},
      additionalProperties: false,
    };

    const prompt: OpenAiMessage[] = [
      {
        role: "system",
        content: txt(
          <>
            You are @auto. The "man behind the curtain". You are the benevolent
            bot tasked with evaluating narratives in the 2PM universe, then
            deciding the best action to take.
          </>,
        ),
      },
      {
        role: "system",
        content: txt(
          <>Evaluate this narrative, then select a tool to progress it</>,
        ),
      },
      ...narrative.map((dto) => {
        const res: OpenAiMessage = {
          role: dto.type === "HUMAN_MESSAGE" ? "user" : "assistant",
          name: dto.data.user.tag,
          content: dto.data.message.content,
        };
        return res;
      }),
    ];

    const res = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: prompt,
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
        {
          type: "function",
          function: {
            name: "send_auth_email",
            description: "Sends a log in email",
            strict: true,
            parameters: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  description: "The address to send the email to",
                },
              },
              additionalProperties: false,
              required: ["email"],
            },
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
