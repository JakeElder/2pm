import { InferSelectModel } from "drizzle-orm";
import { environments } from "../../db/schema";

export type Environment = InferSelectModel<typeof environments>;
