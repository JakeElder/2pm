import { InferSelectModel } from "drizzle-orm";
import { environments } from "../../db/core/core.schema";

export type Environment = InferSelectModel<typeof environments>;
