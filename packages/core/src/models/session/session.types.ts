import { InferSelectModel } from "drizzle-orm";
import { sessions } from "../../db/schema";

export type Session = InferSelectModel<typeof sessions>;
