import { InferSelectModel } from "drizzle-orm";
import { humanUsers } from "../../db/core/core.schema";

export type HumanUser = InferSelectModel<typeof humanUsers>;
