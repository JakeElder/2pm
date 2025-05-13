import { InferSelectModel } from "drizzle-orm";
import { aiMessages } from "../../db/core/core.schema";

export type AiMessage = InferSelectModel<typeof aiMessages>;
