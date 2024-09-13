import { createSelectSchema } from "drizzle-zod";
import { actors } from "../drizzle.ts";

export const ActorSchema = createSelectSchema(actors);
