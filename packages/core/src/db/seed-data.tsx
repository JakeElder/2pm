import { z, ZodType } from "zod";
import type { InferInsertModel } from "drizzle-orm";
import { CreateAiUserDtoSchema } from "../models/user/user.dto";
import type { CreateWorldRoomEnvironmentDtoSchema } from "../models/environment/environment.dto";
import { txt } from "../utils";
import type { tools } from "./schema";

type Z<T extends ZodType<any>> = z.infer<T>;
type Seed<T extends ZodType<any>> = Omit<Required<Z<T>>, "type">;

type WorldRoomEnvironmentSeed = Seed<
  typeof CreateWorldRoomEnvironmentDtoSchema
>;
type AiUserSeed = Seed<typeof CreateAiUserDtoSchema>;
type ToolSeed = InferInsertModel<typeof tools>;

/**
 * World Room Environments
 */
const WORLD_ROOM_ENVIRONMENTS: WorldRoomEnvironmentSeed[] = [
  { id: "UNIVERSE" },
];

/**
 * Ai Users
 */
const AI_USERS: AiUserSeed[] = [
  {
    id: "NIKO",
    tag: "niko",
    bio: txt(<>Niko is our host.</>),
  },
];

/**
 * Tools
 */

const TOOLS: ToolSeed[] = [
  {
    id: "NOOP",
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
    id: "RESPOND_GENERAL",
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
    id: "SEND_AUTH_EMAIL",
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
  {
    id: "REQUEST_EMAIL_ADDRESS",
    definition: {
      type: "function",
      function: {
        name: "REQUEST_EMAIL_ADDRESS",
        description: "Requests the users email address",
        strict: true,
        parameters: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
      },
    },
  },
];

export { WORLD_ROOM_ENVIRONMENTS, AI_USERS, TOOLS };
