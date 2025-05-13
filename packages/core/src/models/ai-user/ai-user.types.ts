import { InferSelectModel } from "drizzle-orm";
import { aiUsers } from "../../db/app/app.schema";
import { AI_USER_CODES } from "./ai-user.constants";

export type AiUser = InferSelectModel<typeof aiUsers>;
export type AiUserId = (typeof AI_USER_CODES)[number];

export type CharacterThinkingEvent = {
  type: "THINKING";
};

export type CharacterRespondingEvent = {
  type: "RESPONDING";
};

export type CharacterChunkEvent = {
  type: "CHUNK";
  chunk: string;
};

export type CharacterCompleteEvent = {
  type: "COMPLETE";
};

export type CharacterResponseEvent =
  | CharacterThinkingEvent
  | CharacterRespondingEvent
  | CharacterChunkEvent
  | CharacterCompleteEvent;
