import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  companionOneToOnes,
  environments,
  environmentCompanionOneToOnes,
} from "../drizzle/schema";
import type { Z } from "..";

const InsertCompanionOneToOneSchema = z.object({
  environment: createInsertSchema(environments).pick({ id: true }).optional(),
  companionOneToOne: createInsertSchema(companionOneToOnes),
});

const InsertCompanionOneToOneResponseSchema = z.object({
  environment: createSelectSchema(environments),
  companionOneToOne: createSelectSchema(companionOneToOnes),
  environmentCompanionOneToOne: createSelectSchema(
    environmentCompanionOneToOnes,
  ),
});

type InsertCompanionOneToOneValues = Z<typeof InsertCompanionOneToOneSchema>;
type InsertCompanionOneToOneResponse = Z<
  typeof InsertCompanionOneToOneResponseSchema
>;

export {
  InsertCompanionOneToOneSchema,
  InsertCompanionOneToOneResponseSchema,
  type InsertCompanionOneToOneValues,
  type InsertCompanionOneToOneResponse,
};
