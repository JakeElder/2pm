import { createSelectSchema } from "drizzle-zod";
import {
  users,
  userEnvironmentPresences,
  environments,
} from "../drizzle/schema";
import { z } from "zod";
import type { Z } from "..";

const InsertUserEnvironmentPresenceDtoSchema = z.object({
  user: createSelectSchema(users).pick({ id: true }),
  environment: createSelectSchema(environments).pick({ id: true }),
});

const InsertUserEnvironmentPresenceResponseDtoSchema = z.object({
  userEnvironmentPresence: createSelectSchema(userEnvironmentPresences),
});

type InsertUserEnvironmentPresenceDto = Z<
  typeof InsertUserEnvironmentPresenceDtoSchema
>;
type InsertUserEnvironmentPresenceResponseDto = Z<
  typeof InsertUserEnvironmentPresenceResponseDtoSchema
>;

export {
  InsertUserEnvironmentPresenceDtoSchema,
  InsertUserEnvironmentPresenceResponseDtoSchema,
  type InsertUserEnvironmentPresenceDto,
  type InsertUserEnvironmentPresenceResponseDto,
};
