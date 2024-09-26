import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  messages,
  plotPointMessages,
  plotPoints,
  userPlotPoints,
  users,
} from "../drizzle/schema";

export const InsertMessageDtoSchema = z.object({
  plotPoint: createInsertSchema(plotPoints).pick({ id: true }).optional(),
  message: createInsertSchema(messages),
  user: createSelectSchema(users).pick({ id: true }),
});

export const InsertMessageResponseDtoSchema = z.object({
  plotPoint: createSelectSchema(plotPoints),
  message: createSelectSchema(messages),
  userPlotPoint: createSelectSchema(userPlotPoints),
  plotPointMessage: createSelectSchema(plotPointMessages),
});
