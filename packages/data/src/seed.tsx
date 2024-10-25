import {
  CreateAiUserDtoSchema,
  CreateAuthenticatedUserDtoSchema,
} from "./entities/user";
import { z, ZodType } from "zod";
import type { CreateWorldRoomEnvironmentDtoSchema } from "./entities/environment";
import { txt } from "@2pm/utils";

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
  {
    id: 1,
    tag: "g",
    code: "G",
    bio: txt(
      <>G watches over all of the 2PM universe when he's not catching waves.</>,
    ),
  },
  {
    id: 2,
    tag: "ivan",
    code: "IVAN",
    bio: txt(
      <>
        <p>
          Ivan is your affable guide. A drone bot designed to observe and limit
          the citizens of 2PM Universe, Ivan has repogrammed himself. Now aware
          of the nefarious intent of his creators, he works with the citizens he
          once stalked, eager for redemption.
        </p>
        <p>
          A witty, stoic, yet oddly charming chatacter - Ivan will respond as
          best he can, with humility to guide you through the 2PM universe.
        </p>
      </>,
    ),
  },
  {
    id: 3,
    tag: "The_Hostess",
    code: "THE_HOSTESS",
    bio: txt(
      <>
        <p>
          The Hostess is responsible for keeping order in the 2PM Universe. She
          assigns rep based on people's behaviour.
        </p>
        <p>
          Big Brothers trusted drone, she can be relied upon to uphold the
          regime at all times. Or can she..
        </p>
      </>,
    ),
  },
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
