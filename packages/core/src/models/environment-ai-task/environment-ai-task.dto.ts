import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { environmentAiTasks } from "../../db/app.schema";
import { AiUserDtoSchema } from "../ai-user/ai-user.dto";

/**
 * Create
 */
export const CreateEnvironmentAiTaskDtoSchema =
  createInsertSchema(environmentAiTasks);

export class CreateEnvironmentAiTaskDto extends createZodDto(
  CreateEnvironmentAiTaskDtoSchema,
) {}

/**
 * Read
 */
export const EnvironmentAiTaskDtoSchema = createSelectSchema(environmentAiTasks)
  .omit({ aiUserId: true })
  .extend({
    aiUser: AiUserDtoSchema,
    createdAt: z.coerce.date(),
  });

export class EnvironmentAiTaskDto extends createZodDto(
  EnvironmentAiTaskDtoSchema,
) {}

/**
 * Update
 */
export const UpdateEnvironmentAiTaskDtoSchema = z.object({
  id: createSelectSchema(environmentAiTasks).shape.id,
  state: createInsertSchema(environmentAiTasks).shape.state,
});

export class UpdateEnvironmentAiTaskDto extends createZodDto(
  UpdateEnvironmentAiTaskDtoSchema,
) {}

/**
 * Active
 */
export const ActiveEnvironmentAiTaskDtoSchema =
  EnvironmentAiTaskDtoSchema.extend({
    state: EnvironmentAiTaskDtoSchema.shape.state.exclude([
      "COMPLETE",
      "FAILED",
    ]),
  });

export class ActiveEnvironmentAiTaskDto extends createZodDto(
  ActiveEnvironmentAiTaskDtoSchema,
) {}
