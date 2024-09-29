import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { humanUsers, environments, users } from "../drizzle/schema";
import type { Z } from "..";

const InsertHumanUserDtoSchema = z.object({
  user: createInsertSchema(users).pick({ id: true, tag: true }),
  location: createSelectSchema(environments).pick({ id: true }),
});

const InsertHumanUserResponseDtoSchema = z.object({
  user: createSelectSchema(users),
  humanUser: createSelectSchema(humanUsers),
});

type InsertHumanUserDto = Z<typeof InsertHumanUserDtoSchema>;
type InsertHumanUserResponseDto = Z<typeof InsertHumanUserResponseDtoSchema>;

export {
  InsertHumanUserDtoSchema,
  InsertHumanUserResponseDtoSchema,
  type InsertHumanUserDto,
  type InsertHumanUserResponseDto,
};
