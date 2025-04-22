import { PlotPointDto, PlotPointType } from "@2pm/core";
import OpenAI from "openai";
import short from "short-uuid";

const translator = short();

type SummarisablePlotPointType = Exclude<
  PlotPointType,
  "ENVIRONMENT_ENTERED" | "ENVIRONMENT_LEFT"
>;

type OpenAiMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export default function plotPointToOpenAiMessage(
  plotPoint: PlotPointDto,
): OpenAiMessage {
  const adapters: Record<
    SummarisablePlotPointType,
    (plotPoint: PlotPointDto) => OpenAiMessage
  > = {
    AUTH_EMAIL_SENT: (plotPoint) => {
      if (plotPoint.type !== "AUTH_EMAIL_SENT") {
        throw new Error();
      }
      return {
        role: "system",
        content: JSON.stringify({ plotPoint }),
      };
    },
    EVALUATION: (plotPoint) => {
      if (plotPoint.type !== "EVALUATION") {
        throw new Error();
      }
      return {
        role: "system",
        content: JSON.stringify({ plotPoint }),
      };
    },
    AI_USER_MESSAGE: (plotPoint) => {
      if (plotPoint.type !== "AI_USER_MESSAGE") {
        throw new Error();
      }
      return {
        role: "assistant",
        name: plotPoint.data.aiUser.id,
        content: plotPoint.data.aiUserMessage.content,
      };
    },
    HUMAN_USER_MESSAGE: (plotPoint) => {
      if (plotPoint.type !== "HUMAN_USER_MESSAGE") {
        throw new Error();
      }
      return {
        role: "user",
        name: `anon${translator.fromUUID(plotPoint.data.humanUser.id)}`,
        content: JSON.stringify(plotPoint.data.humanUserMessage.content),
      };
    },
  };

  const adapter = adapters[plotPoint.type];

  if (!adapter) {
    throw new Error();
  }

  return adapter(plotPoint);
}
