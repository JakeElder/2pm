import { Message as OllamaMessage, Ollama } from "ollama";
import OpenAI from "openai";
import { mimicAi, txt } from "@2pm/utils";
import { PlotPointSummaryDto, ToolCode } from "@2pm/data";
import { summaryToOpenAiMessage } from "./utils";

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

  async evaluate(
    narrative: PlotPointSummaryDto[],
    options: { debug: boolean } = { debug: false },
  ): Promise<{
    tool: ToolCode;
    args: any;
  }> {
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
            You are @g. You are the benevolent Ai tasked with evaluating
            narratives in the 2PM universe then deciding the best action to
            take.
          </>,
        ),
      },
      {
        role: "system",
        content: txt(
          <>Evaluate this narrative, then select a tool to progress it</>,
        ),
      },
      {
        role: "system",
        content: txt(
          <>Less is more. Use NOOP when appropriate. Don't double message</>,
        ),
      },
      ...narrative.map((dto) => {
        return summaryToOpenAiMessage(dto);
      }),
    ];

    try {
      const res = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: prompt,
        tools: [
          {
            type: "function",
            function: {
              name: "CONFIRM_AUTH_EMAIL_SENT",
              description:
                "Notify the user the a confirmation email has been sent",
              strict: true,
              parameters: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    description: "The email the auth code has been sent to",
                  },
                },
                additionalProperties: false,
                required: ["email"],
              },
            },
          },
          {
            type: "function",
            function: {
              name: "PROCESS_AUTH_TOKEN",
              description:
                "Processes an auth token supplied by the user to authenticate",
              strict: true,
              parameters: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    description:
                      "the (hopefully) 5 digit code supplied by the user",
                  },
                },
                additionalProperties: false,
                required: ["token"],
              },
            },
          },
          {
            type: "function",
            function: {
              name: "RESPOND_GENERAL",
              description: "Make a general response",
              strict: true,
              parameters: { ...params },
            },
          },
          {
            type: "function",
            function: {
              name: "NOOP",
              description: "Sometimes no action is required",
              strict: true,
              parameters: { ...params },
            },
          },
          {
            type: "function",
            function: {
              name: "REQUEST_EMAIL_ADDRESS",
              description: "Requests the users email address",
              strict: true,
              parameters: { ...params },
            },
          },
          {
            type: "function",
            function: {
              name: "SEND_AUTH_EMAIL",
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

      if (options.debug) {
        // console.dir(prompt, { depth: null, colors: true });
      }

      const toolCall = res.choices[0].message?.tool_calls?.[0];

      if (!toolCall) {
        throw new Error();
      }

      const code = toolCall.function.name as ToolCode;
      const args = JSON.parse(toolCall.function.arguments);

      if (!code) {
        throw new Error();
      }

      return { tool: code, args };
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async requestEmailAddress(
    narrative: PlotPointSummaryDto[],
    options: { debug: boolean } = { debug: false },
  ) {
    const prompt: OpenAiMessage[] = [
      {
        role: "system",
        content: txt(
          <>
            <p>You are Ivan. This is your bio;</p>
            <p>
              Ivan is your affable guide. A drone bot designed to observe and
              limit the citizens of 2PM Universe, Ivan has repogrammed himself.
              Now aware of the nefarious intent of his creators, he works with
              the citizens he once stalked, eager for redemption.
            </p>
            <p>
              A witty, stoic, terse, yet oddly charming chatacter - Ivan will
              respond as best he can, with humility to guide you through the 2PM
              Universe.
            </p>
          </>,
        ),
      },
      {
        role: "system",
        content: txt(
          <>
            Your current task is to request the users email address in order to
            authenticate then. Write a response that asks for their email
            address. Keep it short, and doesn't have to be polite. Think
            sarcastic british youth.
          </>,
        ),
      },
      ...narrative.map((dto) => {
        return summaryToOpenAiMessage(dto);
      }),
    ];

    if (options.debug) {
      console.dir(prompt, { depth: null, colors: true });
    }

    const stream = ceStream(
      this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: prompt,
        stream: true,
      }),
    );

    return stream;
  }
}

async function* ceStream(stream: any): AsyncGenerator<string> {
  const s = await stream;
  for await (const chunk of s) {
    const content = chunk.choices[0]?.delta?.content || "";
    yield content;
  }
}

// "Write a paragraph about how UX has not caught up with LLMs. Format in markdown",

export default CharacterEngine;
