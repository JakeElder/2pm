import { createSelectSchema } from "drizzle-zod";
import { environments } from "../schema";
import type { Z } from "..";

const EnvironmentSchema = createSelectSchema(environments);
type Environment = Z<typeof EnvironmentSchema>;

export { EnvironmentSchema, type Environment };
