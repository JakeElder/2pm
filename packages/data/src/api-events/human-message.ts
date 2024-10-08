import type { Z } from "..";
import { HumanMessageHydratedPlotPointDtoSchema } from "../dtos";

type HumanMessageCreatedEvent = Z<
  typeof HumanMessageHydratedPlotPointDtoSchema
>;

export { type HumanMessageCreatedEvent };
