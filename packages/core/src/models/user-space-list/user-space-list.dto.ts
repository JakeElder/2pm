import { createSelectSchema } from "drizzle-zod";
import { humanUserRoomEnvironments } from "../../db/app.schema";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { HumanUserDtoSchema } from "../user/user.dto";

/**
 * Space
 */
export const UserSpaceListSpaceDtoSchema = createSelectSchema(
  humanUserRoomEnvironments,
).extend({
  userCount: z.number(),
});

export class UserSpaceListSpaceDto extends createZodDto(
  UserSpaceListSpaceDtoSchema,
) {}

/**
 * List
 */
export const UserSpaceListDtoSchema = z.array(
  z.object({
    humanUser: HumanUserDtoSchema,
    spaces: z.array(createSelectSchema(humanUserRoomEnvironments)),
  }),
);

export class UserSpaceListDto extends createZodDto(UserSpaceListDtoSchema) {}
