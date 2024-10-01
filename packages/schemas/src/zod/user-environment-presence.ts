import { createSelectSchema } from "drizzle-zod";
import {
  users,
  userEnvironmentPresences,
  environments,
  plotPointEnvironmentPresences,
  plotPoints,
} from "../drizzle/schema";
import { z } from "zod";
import type { Z } from "..";

const InsertUserEnvironmentPresenceValuesSchema = z.object({
  user: createSelectSchema(users).pick({ id: true }),
  environment: createSelectSchema(environments).pick({ id: true }),
});

const InsertUserEnvironmentPresenceResponseSchema = z.object({
  userEnvironmentPresence: createSelectSchema(userEnvironmentPresences),
  plotPoint: createSelectSchema(plotPoints),
  plotPointEnvironmentPresence: createSelectSchema(
    plotPointEnvironmentPresences,
  ),
});

type InsertUserEnvironmentPresenceValues = Z<
  typeof InsertUserEnvironmentPresenceValuesSchema
>;
type InsertUserEnvironmentPresenceResponse = Z<
  typeof InsertUserEnvironmentPresenceResponseSchema
>;

export {
  InsertUserEnvironmentPresenceValuesSchema,
  InsertUserEnvironmentPresenceResponseSchema,
  type InsertUserEnvironmentPresenceValues,
  type InsertUserEnvironmentPresenceResponse,
};
