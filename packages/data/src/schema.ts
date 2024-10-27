import OpenAI from "openai";
import {
  foreignKey,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import {
  AI_USER_CODES,
  ENVIRONMENT_TYPE_CODES,
  MESSAGE_TYPES,
  PLOT_POINT_TYPES,
  TOOL_CODES,
  USER_TYPES,
  WORLD_ROOM_CODES,
} from "./constants";
import { sql } from "drizzle-orm";

export const userTypeEnum = pgEnum("UserType", USER_TYPES);
export const messageTypeEnum = pgEnum("MessageType", MESSAGE_TYPES);
export const plotPointTypeEnum = pgEnum("PlotPointType", PLOT_POINT_TYPES);
export const environmentTypeEnum = pgEnum(
  "EnvironmentType",
  ENVIRONMENT_TYPE_CODES,
);
export const worldRoomCodeEnum = pgEnum("WorldRoomCodeEnum", WORLD_ROOM_CODES);
export const toolCodeEnum = pgEnum("ToolCodeEnum", TOOL_CODES);
export const aiUserCodeEnum = pgEnum("AiUserCodeEnum", AI_USER_CODES);
export const aiUserMessageStateEnum = pgEnum("AiUserMessageStateEnum", [
  "OUTPUTTING",
  "COMPLETE",
]);

/*
 * Users
 */

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  type: userTypeEnum("type").notNull(),
});

export const humanUsers = pgTable("human_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").references(() => users.id),
  locationEnvironmentId: integer("location_environment_id")
    .notNull()
    .references(() => environments.id),
});

export const aiUsers = pgTable("ai_users", {
  id: aiUserCodeEnum("id").primaryKey(),
  tag: text("tag").notNull(),
  userId: integer("user_id").references(() => users.id),
  bio: text("bio").notNull(),
});

/**
 * Session
 */

export const sessions = pgTable("sessions", {
  id: uuid("id").notNull().defaultRandom(),
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.id),
});

/**
 * Plot Points
 */

export const plotPoints = pgTable("plot_points", {
  id: serial("id").primaryKey(),
  environmentId: integer("environment_id")
    .notNull()
    .references(() => environments.id),
  type: plotPointTypeEnum("type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, precision: 3 })
    .defaultNow()
    .notNull(),
});

/**
 * Messages
 */

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  type: messageTypeEnum("type").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  environmentId: integer("environment_id")
    .notNull()
    .references(() => environments.id),
});

export const humanUserMessages = pgTable("human_user_messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  messageId: integer("message_id")
    .notNull()
    .references(() => messages.id),
});

export const aiUserMessages = pgTable("ai_user_messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  messageId: integer("message_id")
    .notNull()
    .references(() => messages.id),
  state: aiUserMessageStateEnum("state").notNull().default("OUTPUTTING"),
});

/**
 * Environments
 */

export const environments = pgTable("environments", {
  id: serial("id").primaryKey(),
  type: environmentTypeEnum("type").notNull(),
});

export const worldRoomEnvironments = pgTable("world_room_environments", {
  id: worldRoomCodeEnum("id").primaryKey(),
  environmentId: integer("environment_id")
    .notNull()
    .references(() => environments.id),
});

export const companionOneToOneEnvironments = pgTable(
  "companion_one_to_one_environments",
  {
    id: serial("id").primaryKey(),
    environmentId: integer("environment_id").notNull(),
    userId: integer("user_id").notNull(),
    companionUserId: integer("companion_user_id").notNull(),
  },
  (table) => {
    return {
      fk_o2o_env: foreignKey({
        columns: [table.environmentId],
        foreignColumns: [environments.id],
        name: "fk_o2o_env",
      }),
      fk_o2o_user: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "fk_o2o_user",
      }),
      fk_o2o_companion: foreignKey({
        columns: [table.companionUserId],
        foreignColumns: [users.id],
        name: "fk_o2o_companion",
      }),
      uniqueUserConstraint: unique().on(table.userId),
    };
  },
);

/**
 * Tools
 */

export const tools = pgTable("tools", {
  id: toolCodeEnum("id").primaryKey(),
  definition: jsonb("definition")
    .$type<OpenAI.Chat.Completions.ChatCompletionTool>()
    .notNull(),
});

/**
 * Evaluations
 */

export const evaluations = pgTable("evaluations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  plotPointId: integer("plot_point_id")
    .notNull()
    .references(() => plotPoints.id),
  toolId: toolCodeEnum("tool_id")
    .notNull()
    .references(() => tools.id),
  args: jsonb("args").$type<any>(),
});

/**
 * Auth Emails
 */

export const authEmails = pgTable("auth_emails", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  plotPointId: integer("plot_point_id")
    .notNull()
    .references(() => plotPoints.id),
  email: text("email").notNull(),
  code: text("code").notNull(),
});

/*
 * Join Tables
 */

export const userEnvironmentPresences = pgTable("user_environment_presences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  environmentId: integer("environment_id")
    .notNull()
    .references(() => environments.id),
  expired: timestamp("deleted_at")
    .default(sql`null`)
    .$type<Date | null>(),
});

export const plotPointMessages = pgTable("plot_point_messages", {
  plotPointId: integer("plot_point_id")
    .notNull()
    .references(() => plotPoints.id),
  messageId: integer("message_id")
    .notNull()
    .references(() => messages.id),
});

export const plotPointEvaluations = pgTable("plot_point_evaluations", {
  plotPointId: integer("plot_point_id")
    .notNull()
    .references(() => plotPoints.id),
  evaluationId: integer("evaluation_id")
    .notNull()
    .references(() => evaluations.id),
});

export const plotPointAuthEmails = pgTable("plot_point_auth_emails", {
  plotPointId: integer("plot_point_id")
    .notNull()
    .references(() => plotPoints.id),
  authEmailId: integer("auth_email_id")
    .notNull()
    .references(() => authEmails.id),
});

export const plotPointEnvironmentPresences = pgTable(
  "plot_point_environment_presences",
  {
    plotPointId: integer("plot_point_id").notNull(),
    userEnvironmentPresenceId: integer(
      "user_environment_presence_id",
    ).notNull(),
  },
  (table) => {
    return {
      fk_plot_env_pres_plot: foreignKey({
        columns: [table.plotPointId],
        foreignColumns: [plotPoints.id],
        name: "fk_plot_env_pres_plot",
      }),
      fk_plot_env_pres_user_env: foreignKey({
        columns: [table.userEnvironmentPresenceId],
        foreignColumns: [userEnvironmentPresences.id],
        name: "fk_plot_env_pres_user_env",
      }),
    };
  },
);
