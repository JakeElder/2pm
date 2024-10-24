import {
  CreateAiUserDtoSchema,
  CreateAuthenticatedUserDtoSchema,
} from "./entities/user";
import { z, ZodType } from "zod";
import type { CreateWorldRoomEnvironmentDtoSchema } from "./entities/environment";

type Z<T extends ZodType<any>> = z.infer<T>;
type Seed<T extends ZodType<any>> = Omit<Required<Z<T>>, "type">;

type WorldRoomEnvironmentSeed = Seed<
  typeof CreateWorldRoomEnvironmentDtoSchema
>;
type AiUserSeed = Seed<typeof CreateAiUserDtoSchema>;
type AuthenticatedUserSeed = Seed<typeof CreateAuthenticatedUserDtoSchema>;

/**
 * World Room Environments
 */
const WORLD_ROOM_ENVIRONMENTS: WorldRoomEnvironmentSeed[] = [
  {
    id: 1,
    code: "UNIVERSE",
  },
];

/**
 * Ai Users
 */
const AI_USERS: AiUserSeed[] = [
  { id: 1, tag: "g", code: "G" },
  { id: 2, tag: "ivan", code: "IVAN" },
  { id: 3, tag: "the_hostess", code: "THE_HOSTESS" },
];

/**
 * Authenticated Users
 */

const universe = WORLD_ROOM_ENVIRONMENTS[0];
const AUTHENTICATED_USERS: AuthenticatedUserSeed[] = [
  {
    id: 4,
    tag: "jake",
    locationEnvironmentId: universe.id,
  },
];

export { WORLD_ROOM_ENVIRONMENTS, AI_USERS, AUTHENTICATED_USERS };
