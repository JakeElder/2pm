import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  aiMessages,
  environments,
  messages,
  plotPointMessages,
  plotPoints,
  users,
} from "../drizzle/schema";
import type { Z } from "..";

const InsertAiMessageValuesSchema = z.object({
  message: createInsertSchema(messages).pick({ content: true }),
  user: createSelectSchema(users).pick({ id: true }),
  environment: createSelectSchema(environments).pick({ id: true }),
});

const InsertAiMessageResponseSchema = z.object({
  message: createSelectSchema(messages),
  aiMessage: createSelectSchema(aiMessages),
  plotPoint: createSelectSchema(plotPoints),
  plotPointMessage: createSelectSchema(plotPointMessages),
});

type InsertAiMessageValues = Z<typeof InsertAiMessageValuesSchema>;
type InsertAiMessageResponse = Z<typeof InsertAiMessageResponseSchema>;

export {
  InsertAiMessageValuesSchema,
  InsertAiMessageResponseSchema,
  type InsertAiMessageValues,
  type InsertAiMessageResponse,
};
