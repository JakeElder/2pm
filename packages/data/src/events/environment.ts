import { createSelectSchema } from "drizzle-zod";
import { environments, users } from "../schema";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";

const EnvironmentRoomJoinedEventSchema = z.object({
  user: createSelectSchema(users),
  environment: createSelectSchema(environments),
});

export class EnvironmentRoomJoinedEvent extends createZodDto(
  EnvironmentRoomJoinedEventSchema,
) {}
