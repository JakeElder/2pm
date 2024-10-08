import type { Z } from "..";
import { AiMessageHydratedPlotPointDtoSchema } from "../dtos";

type AiMessageCreatedEvent = Z<typeof AiMessageHydratedPlotPointDtoSchema>;

export { type AiMessageCreatedEvent };
