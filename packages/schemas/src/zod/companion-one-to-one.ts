import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  companionOneToOnes,
  environments,
  environmentCompanionOneToOnes,
} from "../drizzle/schema";
import type { Z } from "..";

const InsertCompanionOneToOneValuesSchema = z.undefined();

const InsertCompanionOneToOneResponseSchema = z.object({
  environment: createSelectSchema(environments),
  companionOneToOne: createSelectSchema(companionOneToOnes),
  environmentCompanionOneToOne: createSelectSchema(
    environmentCompanionOneToOnes,
  ),
});

type InsertCompanionOneToOneValues = Z<
  typeof InsertCompanionOneToOneValuesSchema
>;
type InsertCompanionOneToOneResponse = Z<
  typeof InsertCompanionOneToOneResponseSchema
>;

export {
  InsertCompanionOneToOneValuesSchema,
  InsertCompanionOneToOneResponseSchema,
  type InsertCompanionOneToOneValues,
  type InsertCompanionOneToOneResponse,
};
