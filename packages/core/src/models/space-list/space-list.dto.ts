import { createSelectSchema } from "drizzle-zod";
import { worldRoomEnvironments } from "../../db/app/app.schema";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";

/**
 * Space
 */
export const SpaceListSpaceDtoSchema = createSelectSchema(
  worldRoomEnvironments,
).extend({
  userCount: z.number(),
});

export class SpaceListSpaceDto extends createZodDto(SpaceListSpaceDtoSchema) {}

/**
 * List
 */
export const SpaceListDtoSchema = z.object({
  spaces: z.array(SpaceListSpaceDtoSchema),
});

export class SpaceListDto extends createZodDto(SpaceListDtoSchema) {}
