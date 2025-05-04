import { z } from "zod";
import { USER_TYPES } from "./user.constants";
import { UserDtoSchema } from "./user.dto";
import { InferSelectModel } from "drizzle-orm";
import { users } from "../../db/core/core.schema";

export type User = InferSelectModel<typeof users>;
export type UserType = (typeof USER_TYPES)[number];
export type UserDto = z.infer<typeof UserDtoSchema>;
