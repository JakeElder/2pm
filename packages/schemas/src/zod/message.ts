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

const InsertMessageDtoSchema = z.object({
  plotPoint: createInsertSchema(plotPoints).pick({ id: true }).optional(),
  message: createInsertSchema(messages),
  user: createSelectSchema(users).pick({ id: true }),
});

type InsertMessageDto = Z<typeof InsertMessageDtoSchema>;
type InsertMessageResponseDto = Z<typeof InsertMessageResponseDtoSchema>;

const InsertMessageResponseDtoSchema = z.object({
  plotPoint: createSelectSchema(plotPoints),
  message: createSelectSchema(messages),
  userPlotPoint: createSelectSchema(userPlotPoints),
  plotPointMessage: createSelectSchema(plotPointMessages),
});

export {
  InsertMessageDtoSchema,
  InsertMessageResponseDtoSchema,
  type InsertMessageDto,
  type InsertMessageResponseDto,
};
