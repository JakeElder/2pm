import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  aiMessages,
  aiUsers,
  environments,
  messages,
  plotPointMessages,
  plotPoints,
  users,
} from "../drizzle/schema";
import type { Z } from "..";

const AiMessageSchema = z.object({
  plotPoint: createSelectSchema(plotPoints),
  message: createSelectSchema(messages),
  aiMessage: createSelectSchema(aiMessages),
  user: createSelectSchema(users),
  aiUser: createSelectSchema(aiUsers),
  environment: createSelectSchema(environments),
});

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

type AiMessage = Z<typeof AiMessageSchema>;
type InsertAiMessageValues = Z<typeof InsertAiMessageValuesSchema>;
type InsertAiMessageResponse = Z<typeof InsertAiMessageResponseSchema>;

export {
  AiMessageSchema,
  InsertAiMessageValuesSchema,
  InsertAiMessageResponseSchema,
  type AiMessage,
  type InsertAiMessageValues,
  type InsertAiMessageResponse,
};
