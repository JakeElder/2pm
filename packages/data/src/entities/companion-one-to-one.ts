import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { companionOneToOnes, environments } from "../schema";

export const CompanionOneToOneDtoSchema = z.object({
  companionOneToOne: createSelectSchema(companionOneToOnes),
  environment: createSelectSchema(environments),
});

export const CreateCompanionOneToOneDtoSchema = z.object({
  id: createInsertSchema(companionOneToOnes).shape.id,
});

export class CompanionOneToOneDto extends createZodDto(
  CompanionOneToOneDtoSchema,
) {}

export class CreateCompanionOneToOneDto extends createZodDto(
  CreateCompanionOneToOneDtoSchema,
) {}
