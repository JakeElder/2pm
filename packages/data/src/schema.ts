import {
  foreignKey,
  integer,
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

export const anonymousUsers = pgTable("anonymous_users", {
  id: uuid("id").notNull().defaultRandom(),
  userId: integer("user_id").references(() => users.id),
  locationEnvironmentId: integer("location_environment_id")
    .notNull()
    .references(() => environments.id),
});

export const authenticatedUsers = pgTable("authenticated_users", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  userId: integer("user_id").references(() => users.id),
  locationEnvironmentId: integer("location_environment_id")
    .notNull()
    .references(() => environments.id),
});

export const aiUsers = pgTable("ai_users", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  userId: integer("user_id").references(() => users.id),
  code: aiUserCodeEnum("code").notNull().unique(),
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

export const authenticatedUserMessages = pgTable(
  "authenticated_user_messages",
  {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    messageId: integer("message_id")
      .notNull()
      .references(() => messages.id),
  },
);

export const aiUserMessages = pgTable("ai_messages", {
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

export const worldRooms = pgTable("world_rooms", {
  id: serial("id").primaryKey(),
  code: worldRoomCodeEnum("code").notNull().unique(),
});

export const companionOneToOneEnvironments = pgTable(
  "companion_one_to_one_environments",
  {
    environmentId: integer("environment_id").notNull(),
    id: serial("id").primaryKey(),
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

export const environmentWorldRooms = pgTable("environment_world_rooms", {
  environmentId: integer("environment_id")
    .notNull()
    .references(() => environments.id),
  worldRoomId: integer("world_room_id")
    .notNull()
    .references(() => worldRooms.id),
});
