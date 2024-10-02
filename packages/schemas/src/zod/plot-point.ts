import { createSelectSchema } from "drizzle-zod";
import { plotPoints } from "../drizzle/schema";
import type { Z } from "..";

const PlotPointSchema = createSelectSchema(plotPoints);

type PlotPoint = Z<typeof PlotPointSchema>;

export { PlotPointSchema, type PlotPoint };
