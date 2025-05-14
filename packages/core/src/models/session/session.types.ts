import { InferSelectModel } from "drizzle-orm";
import { sessions } from "../../db/app.schema";

export type Session = InferSelectModel<typeof sessions>;
