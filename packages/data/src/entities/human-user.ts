import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { environments, humanUsers, users } from "../schema";
import { createZodDto } from "@anatine/zod-nestjs";

export const HumanUserDtoSchema = z.object({
  user: createSelectSchema(users),
  humanUser: createSelectSchema(humanUsers),
});

export const CreateHumanUserDtoSchema = z.object({
  id: createInsertSchema(users).shape.id,
  tag: createInsertSchema(users).shape.tag,
  locationEnvironmentId: createSelectSchema(environments).shape.id,
});

export class HumanUserDto extends createZodDto(HumanUserDtoSchema) {}

export class CreateHumanUserDto extends createZodDto(
  CreateHumanUserDtoSchema,
) {}
