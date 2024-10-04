import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { companionOneToOnes, environments } from "../drizzle/schema";
import { createZodDto } from "@anatine/zod-nestjs";

const CompanionOneToOneDtoSchema = z.object({
  companionOneToOne: createSelectSchema(companionOneToOnes),
  environment: createSelectSchema(environments),
});

const CreateCompanionOneToOneDtoSchema = z.object({
  id: createInsertSchema(companionOneToOnes).shape.id,
});

class CompanionOneToOneDto extends createZodDto(CompanionOneToOneDtoSchema) {}
class CreateCompanionOneToOneDto extends createZodDto(
  CreateCompanionOneToOneDtoSchema,
) {}

export {
  CompanionOneToOneDtoSchema,
  CompanionOneToOneDto,
  CreateCompanionOneToOneDto,
  CreateCompanionOneToOneDtoSchema,
};
