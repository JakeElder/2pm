import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users, aiUsers } from "../drizzle/schema";
import type { Z } from "..";

const InsertAiUserDtoSchema = z.object({
  user: createInsertSchema(users).pick({ id: true, tag: true }),
  aiUser: createInsertSchema(aiUsers).pick({ code: true }),
});

const InsertAiUserResponseDtoSchema = z.object({
  user: createSelectSchema(users),
  aiUser: createSelectSchema(aiUsers),
});

type InsertAiUserDto = Z<typeof InsertAiUserDtoSchema>;
type InsertAiUserResponseDto = Z<typeof InsertAiUserResponseDtoSchema>;

export {
  InsertAiUserDtoSchema,
  InsertAiUserResponseDtoSchema,
  type InsertAiUserDto,
  type InsertAiUserResponseDto,
};
