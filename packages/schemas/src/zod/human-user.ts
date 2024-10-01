import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { humanUsers, environments, users } from "../drizzle/schema";
import type { Z } from "..";

const InsertHumanUserValuesSchema = z.object({
  user: createInsertSchema(users).pick({ id: true, tag: true }),
  location: createSelectSchema(environments).pick({ id: true }),
});

const InsertHumanUserResponseSchema = z.object({
  user: createSelectSchema(users),
  humanUser: createSelectSchema(humanUsers),
});

type InsertHumanUserValues = Z<typeof InsertHumanUserValuesSchema>;
type InsertHumanUserResponse = Z<typeof InsertHumanUserResponseSchema>;

export {
  InsertHumanUserValuesSchema,
  InsertHumanUserResponseSchema,
  type InsertHumanUserValues,
  type InsertHumanUserResponse,
};
