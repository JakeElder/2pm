import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  companionOneToOnes,
  environments,
  environmentCompanionOneToOnes,
} from "../drizzle/schema";
import type { Z } from "..";

const InsertCompanionOneToOneDtoSchema = z.object({
  environment: createInsertSchema(environments).pick({ id: true }).optional(),
  companionOneToOne: createInsertSchema(companionOneToOnes),
});

const InsertCompanionOneToOneResponseDtoSchema = z.object({
  environment: createSelectSchema(environments),
  companionOneToOne: createSelectSchema(companionOneToOnes),
  environmentCompanionOneToOne: createSelectSchema(
    environmentCompanionOneToOnes,
  ),
});

type InsertCompanionOneToOneDto = Z<typeof InsertCompanionOneToOneDtoSchema>;
type InsertCompanionOneToOneResponseDto = Z<
  typeof InsertCompanionOneToOneResponseDtoSchema
>;

export {
  InsertCompanionOneToOneDtoSchema,
  InsertCompanionOneToOneResponseDtoSchema,
  type InsertCompanionOneToOneDto,
  type InsertCompanionOneToOneResponseDto,
};
