import { InferSelectModel } from "drizzle-orm";
import { userEnvironmentPresences } from "../../db/core/core.schema";

export type UserEnvironmentPresence = InferSelectModel<
  typeof userEnvironmentPresences
>;
