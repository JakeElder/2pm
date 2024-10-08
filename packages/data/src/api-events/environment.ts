import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { environments, users } from "../schema";

const EnvironmentRoomJoinedEventSchema = z.object({
  user: createSelectSchema(users),
  environment: createSelectSchema(environments),
});

type EnvironmentRoomJoinedEvent = z.infer<
  typeof EnvironmentRoomJoinedEventSchema
>;

export { type EnvironmentRoomJoinedEvent };
