import { PlotPointSummaryDto, PlotPointType } from "@2pm/data";
import OpenAI from "openai";
import short from "short-uuid";

const translator = short();

type SummarisablePlotPointType = Exclude<
  PlotPointType,
  "ENVIRONMENT_ENTERED" | "ENVIRONMENT_LEFT"
>;

type OpenAiMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export default function summaryToOpenAiMessage(
  plotPoint: PlotPointSummaryDto,
): OpenAiMessage {
  const adapters: Record<
    SummarisablePlotPointType,
    (plotPoint: PlotPointSummaryDto) => OpenAiMessage
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
        name: plotPoint.data.aiUser.code,
        content: plotPoint.data.aiUserMessage.content,
      };
    },
    AUTHENTICATED_USER_MESSAGE: (plotPoint) => {
      if (plotPoint.type !== "AUTHENTICATED_USER_MESSAGE") {
        throw new Error();
      }
      return {
        role: "user",
        name: plotPoint.data.authenticatedUser.tag,
        content: plotPoint.data.authenticatedUserMessage.content,
      };
    },
    ANONYMOUS_USER_MESSAGE: (plotPoint) => {
      if (plotPoint.type !== "ANONYMOUS_USER_MESSAGE") {
        throw new Error();
      }
      return {
        role: "user",
        name: `anon${translator.fromUUID(plotPoint.data.anonymousUser.id)}`,
        content: plotPoint.data.anonymousUserMessage.content,
      };
    },
  };

  const adapter = adapters[plotPoint.type];

  if (!adapter) {
    throw new Error();
  }

  return adapter(plotPoint);
}
