import { InferSelectModel } from "drizzle-orm";
import { humanUsers } from "../../db/app/app.schema";
import { HumanUserDtoSchema } from "../user";
import { z } from "zod";

export type HumanUser = InferSelectModel<typeof humanUsers>;
export type HumanUserDto = z.infer<typeof HumanUserDtoSchema>;
