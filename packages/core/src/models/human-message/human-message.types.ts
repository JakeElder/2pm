import { InferSelectModel } from "drizzle-orm";
import { humanMessages } from "../../db/app/app.schema";

export type HumanMessage = InferSelectModel<typeof humanMessages>;
