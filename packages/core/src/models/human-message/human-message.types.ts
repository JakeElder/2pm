import { InferSelectModel } from "drizzle-orm";
import { humanMessages } from "../../db/core/core.schema";

export type HumanMessage = InferSelectModel<typeof humanMessages>;
