import { createSelectSchema } from "drizzle-zod";
import {
  users,
  userEnvironmentPresences,
  environments,
} from "../drizzle/schema";
import { z } from "zod";
import type { Z } from "..";

const InsertUserEnvironmentPresenceSchema = z.object({
  user: createSelectSchema(users).pick({ id: true }),
  environment: createSelectSchema(environments).pick({ id: true }),
});

const InsertUserEnvironmentPresenceResponseSchema = z.object({
  userEnvironmentPresence: createSelectSchema(userEnvironmentPresences),
});

type InsertUserEnvironmentPresenceValues = Z<
  typeof InsertUserEnvironmentPresenceSchema
>;
type InsertUserEnvironmentPresenceResponse = Z<
  typeof InsertUserEnvironmentPresenceResponseSchema
>;

export {
  InsertUserEnvironmentPresenceSchema,
  InsertUserEnvironmentPresenceResponseSchema,
  type InsertUserEnvironmentPresenceValues,
  type InsertUserEnvironmentPresenceResponse,
};
