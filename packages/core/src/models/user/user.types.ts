import { z } from "zod";
import { USER_TYPES } from "./user.constants";
import { UserDtoSchema } from "./user.dto";

export type UserType = (typeof USER_TYPES)[number];
export type UserDto = z.infer<typeof UserDtoSchema>;
