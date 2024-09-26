import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { humanUsers, rooms, users } from "../drizzle/schema";

export const InsertHumanUserDtoSchema = z.object({
  user: createInsertSchema(users).pick({ id: true, tag: true }),
  location: createSelectSchema(rooms),
});

export const InsertHumanUserResponseDtoSchema = z.object({
  user: createSelectSchema(users),
  humanUser: createSelectSchema(humanUsers),
});
