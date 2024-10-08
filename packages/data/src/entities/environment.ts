import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { environments, users } from "../schema";
import { createZodDto } from "@anatine/zod-nestjs";

export const EnvironmentRoomJoinedEventSchema = z.object({
  user: createSelectSchema(users),
  environment: createSelectSchema(environments),
});

export class EnvironmentRoomJoinedEventDto extends createZodDto(
  EnvironmentRoomJoinedEventSchema,
) {}
