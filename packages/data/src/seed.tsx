import {
  CreateAiUserDtoSchema,
  CreateAuthenticatedUserDtoSchema,
} from "./entities/user";
import { z, ZodType } from "zod";
import type { CreateWorldRoomEnvironmentDtoSchema } from "./entities/environment";
import { txt } from "@2pm/utils";
import type { InferInsertModel } from "drizzle-orm";
import type { tools } from "./schema";

type Z<T extends ZodType<any>> = z.infer<T>;
type Seed<T extends ZodType<any>> = Omit<Required<Z<T>>, "type">;

type WorldRoomEnvironmentSeed = Seed<
  typeof CreateWorldRoomEnvironmentDtoSchema
>;
type AiUserSeed = Seed<typeof CreateAiUserDtoSchema>;
type AuthenticatedUserSeed = Seed<typeof CreateAuthenticatedUserDtoSchema>;
type ToolSeed = InferInsertModel<typeof tools>;

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
          best he can, with humility to guide you through the 2PM Universe.
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

/**
 * Tools
 */

const TOOLS: ToolSeed[] = [
  {
    id: 1,
    code: "NOOP",
    definition: {
      type: "function",
      function: {
        name: "noop",
        description: "Sometimes no action is required",
        strict: true,
        parameters: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
      },
    },
  },
  {
    id: 2,
    code: "RESPOND_GENERAL",
    definition: {
      type: "function",
      function: {
        name: "respond_general",
        description: "Make a general response",
        strict: true,
        parameters: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
      },
    },
  },
  {
    id: 3,
    code: "SEND_AUTH_EMAIL",
    definition: {
      type: "function",
      function: {
        name: "send_auth_email",
        description: "Sends a log in email",
        strict: true,
        parameters: {
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "The address to send the email to",
            },
          },
          additionalProperties: false,
          required: ["email"],
        },
      },
    },
  },
];

export { WORLD_ROOM_ENVIRONMENTS, AI_USERS, AUTHENTICATED_USERS, TOOLS };
