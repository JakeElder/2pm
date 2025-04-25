import { InferSelectModel } from "drizzle-orm";
import { humanUsers } from "../../db/schema";

export type HumanUser = InferSelectModel<typeof humanUsers>;
