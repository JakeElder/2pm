import { InferSelectModel } from "drizzle-orm";
import { sessions } from "../../db/app/app.schema";

export type Session = InferSelectModel<typeof sessions>;
