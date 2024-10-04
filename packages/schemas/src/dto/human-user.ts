import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { environments, humanUsers, users } from "../drizzle/schema";
import { createZodDto } from "@anatine/zod-nestjs";

const HumanUserDtoSchema = z.object({
  user: createSelectSchema(users),
  humanUser: createSelectSchema(humanUsers),
});

const CreateHumanUserDtoSchema = z.object({
  id: createInsertSchema(users).shape.id,
  tag: createInsertSchema(users).shape.tag,
  locationEnvironmentId: createSelectSchema(environments).shape.id,
});

class HumanUserDto extends createZodDto(HumanUserDtoSchema) {}
class CreateHumanUserDto extends createZodDto(CreateHumanUserDtoSchema) {}

export {
  HumanUserDtoSchema,
  HumanUserDto,
  CreateHumanUserDto,
  CreateHumanUserDtoSchema,
};
