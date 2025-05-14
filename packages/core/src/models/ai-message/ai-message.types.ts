import { InferSelectModel } from "drizzle-orm";
import { aiMessages } from "../../db/app.schema";

export type AiMessage = InferSelectModel<typeof aiMessages>;
