import { InferSelectModel } from "drizzle-orm";
import { sessions } from "../../db/core/core.schema";

export type Session = InferSelectModel<typeof sessions>;
