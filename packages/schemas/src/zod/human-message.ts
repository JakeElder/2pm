import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  humanMessages,
  humanUsers,
  environments,
  messages,
  plotPointMessages,
  plotPoints,
  users,
} from "../drizzle/schema";
import type { Z } from "..";

const HumanMessageSchema = z.object({
  plotPoint: createSelectSchema(plotPoints),
  message: createSelectSchema(messages),
  humanMessage: createSelectSchema(humanMessages),
  user: createSelectSchema(users),
  humanUser: createSelectSchema(humanUsers),
  environment: createSelectSchema(environments),
});

const InsertHumanMessageValuesSchema = z.object({
  message: createInsertSchema(messages).pick({ content: true }),
  user: createSelectSchema(users).pick({ id: true }),
  environment: createSelectSchema(environments).pick({ id: true }),
});

const InsertHumanMessageResponseSchema = z.object({
  message: createSelectSchema(messages),
  humanMessage: createSelectSchema(humanMessages),
  plotPoint: createSelectSchema(plotPoints),
  plotPointMessage: createSelectSchema(plotPointMessages),
});

type HumanMessage = Z<typeof HumanMessageSchema>;
type InsertHumanMessageValues = Z<typeof InsertHumanMessageValuesSchema>;
type InsertHumanMessageResponse = Z<typeof InsertHumanMessageResponseSchema>;

export {
  HumanMessageSchema,
  InsertHumanMessageValuesSchema,
  InsertHumanMessageResponseSchema,
  type HumanMessage,
  type InsertHumanMessageValues,
  type InsertHumanMessageResponse,
};
