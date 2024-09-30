import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  messages,
  plotPointMessages,
  plotPoints,
  userPlotPoints,
  users,
} from "../drizzle/schema";
import type { Z } from "..";

const InsertMessageSchema = z.object({
  plotPoint: createInsertSchema(plotPoints),
  message: createInsertSchema(messages),
  user: createSelectSchema(users).pick({ id: true }),
});

const InsertMessageResponseSchema = z.object({
  plotPoint: createSelectSchema(plotPoints),
  message: createSelectSchema(messages),
  userPlotPoint: createSelectSchema(userPlotPoints),
  plotPointMessage: createSelectSchema(plotPointMessages),
});

type InsertMessageValues = Z<typeof InsertMessageSchema>;
type InsertMessageResponse = Z<typeof InsertMessageResponseSchema>;

export {
  InsertMessageSchema,
  InsertMessageResponseSchema,
  type InsertMessageValues,
  type InsertMessageResponse,
};
