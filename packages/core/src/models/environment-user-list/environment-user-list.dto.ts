import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { UserDtoSchema } from "../user/user.dto";

/**
 * List
 */
export const EnvironmentUserListDtoSchema = z.object({
  users: z.array(UserDtoSchema),
});

export class EnvironmentUserListDto extends createZodDto(
  EnvironmentUserListDtoSchema,
) {}
