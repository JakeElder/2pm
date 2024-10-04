import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  environments,
  humanMessages,
  humanUsers,
  messages,
  plotPoints,
  users,
} from "../drizzle/schema";
import { createZodDto } from "@anatine/zod-nestjs";

const HumanMessageDtoSchema = z.object({
  plotPoint: createSelectSchema(plotPoints),
  message: createSelectSchema(messages),
  humanMessage: createSelectSchema(humanMessages),
  user: createSelectSchema(users),
  humanUser: createSelectSchema(humanUsers),
  environment: createSelectSchema(environments),
});

const CreateHumanMessageDtoSchema = z.object({
  userId: createSelectSchema(users).shape.id,
  environmentId: createSelectSchema(environments).shape.id,
  content: createSelectSchema(messages).shape.content,
});

class HumanMessageDto extends createZodDto(HumanMessageDtoSchema) {}
class CreateHumanMessageDto extends createZodDto(CreateHumanMessageDtoSchema) {}

export {
  HumanMessageDtoSchema,
  HumanMessageDto,
  CreateHumanMessageDtoSchema,
  CreateHumanMessageDto,
};
