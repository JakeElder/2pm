import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users, aiUsers } from "../drizzle/schema";
import type { Z } from "..";

const InsertAiUserValuesSchema = z.object({
  user: createInsertSchema(users).pick({ id: true, tag: true }),
  aiUser: createInsertSchema(aiUsers).pick({ code: true }),
});

const InsertAiUserResponseSchema = z.object({
  user: createSelectSchema(users),
  aiUser: createSelectSchema(aiUsers),
});

type InsertAiUserValues = Z<typeof InsertAiUserValuesSchema>;
type InsertAiUserResponse = Z<typeof InsertAiUserResponseSchema>;

export {
  InsertAiUserValuesSchema,
  InsertAiUserResponseSchema,
  type InsertAiUserValues,
  type InsertAiUserResponse,
};
