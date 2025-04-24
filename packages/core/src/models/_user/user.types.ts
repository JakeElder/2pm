import { AI_USER_CODES, USER_TYPES } from "./user.constants";

export type UserType = (typeof USER_TYPES)[number];
export type AiUserCode = (typeof AI_USER_CODES)[number];
