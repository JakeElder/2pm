import { InferSelectModel } from "drizzle-orm";
import { userEnvironmentPresences } from "../../db/app/app.schema";

export type UserEnvironmentPresence = InferSelectModel<
  typeof userEnvironmentPresences
>;
