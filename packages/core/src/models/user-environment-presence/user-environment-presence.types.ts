import { InferSelectModel } from "drizzle-orm";
import { userEnvironmentPresences } from "../../db/app.schema";

export type UserEnvironmentPresence = InferSelectModel<
  typeof userEnvironmentPresences
>;
