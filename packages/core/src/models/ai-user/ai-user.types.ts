import { InferSelectModel } from "drizzle-orm";
import { aiUsers } from "../../db/app.schema";
import { AI_USER_CODES } from "./ai-user.constants";
import { PlotPointDto } from "../plot-point/plot-point.dto";

export type AiUser = InferSelectModel<typeof aiUsers>;
export type AiUserId = (typeof AI_USER_CODES)[number];

export type CharacterIdentifyingToolsEvent = {
  type: "IDENTIFYING_TOOLS";
};

export type CharacterActingEvent = {
  type: "ACTING";
};

export type CharacterPlotPointCreatedEvent = {
  type: "PLOT_POINT_CREATED";
  data: PlotPointDto;
};

export type CharacterGeneratingResponseEvent = {
  type: "GENERATING_RESPONSE";
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
  | CharacterIdentifyingToolsEvent
  | CharacterActingEvent
  | CharacterPlotPointCreatedEvent
  | CharacterGeneratingResponseEvent
  | CharacterRespondingEvent
  | CharacterChunkEvent
  | CharacterCompleteEvent;
