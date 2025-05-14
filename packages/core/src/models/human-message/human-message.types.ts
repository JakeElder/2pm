import { InferSelectModel } from "drizzle-orm";
import { humanMessages } from "../../db/app.schema";

export type HumanMessage = InferSelectModel<typeof humanMessages>;
