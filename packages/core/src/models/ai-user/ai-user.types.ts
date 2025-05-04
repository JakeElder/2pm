import { InferSelectModel } from "drizzle-orm";
import { aiUsers } from "../../db/core/core.schema";

export type AiUser = InferSelectModel<typeof aiUsers>;
