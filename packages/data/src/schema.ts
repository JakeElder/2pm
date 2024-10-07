import {
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import {
  AI_USER_CODES,
  ENVIRONMENT_TYPE_CODES,
  PLOT_POINT_TYPES,
  WORLD_ROOM_CODES,
} from "./constants";
import { sql } from "drizzle-orm";

export const userTypeEnum = pgEnum("UserType", ["HUMAN", "AI"]);
export const messageTypeEnum = pgEnum("MessageType", ["HUMAN", "AI"]);
export const plotPointTypeEnum = pgEnum("PlotPointType", PLOT_POINT_TYPES);
export const environmentTypeEnum = pgEnum(
  "EnvironmentType",
  ENVIRONMENT_TYPE_CODES,
);
export const worldRoomCodeEnum = pgEnum("WorldRoomCodeEnum", WORLD_ROOM_CODES);
export const aiUserCodeEnum = pgEnum("AiUserCodeEnum", AI_USER_CODES);
export const aiMessageStateEnum = pgEnum("AiMessageStateEnum", [
  "OUTPUTTING",
  "COMPLETE",
]);

/*
 * Users
 */

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  type: userTypeEnum("type").notNull(),
});

export const humanUsers = pgTable("human_users", {
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.id),
  locationEnvironmentId: integer("location_environment_id")
    .notNull()
    .references(() => environments.id),
});

export const aiUsers = pgTable("ai_users", {
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.id),
  code: aiUserCodeEnum("code").notNull().unique(),
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
  content: text("content").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  environmentId: integer("environment_id")
    .notNull()
    .references(() => environments.id),
});

export const humanMessages = pgTable("human_messages", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id")
    .notNull()
    .references(() => messages.id),
});

export const aiMessages = pgTable("ai_messages", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id")
    .notNull()
    .references(() => messages.id),
  state: aiMessageStateEnum("state").notNull().default("OUTPUTTING"),
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

export const companionOneToOnes = pgTable("companion_one_to_ones", {
  id: serial("id").primaryKey(),
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

export const environmentCompanionOneToOnes = pgTable(
  "environment_companion_one_to_ones",
  {
    environmentId: integer("environment_id").notNull(),
    companionOneToOneId: integer("companion_one_to_one_id").notNull(),
  },
  (table) => {
    return {
      fk_env_comp_o2o_env: foreignKey({
        columns: [table.environmentId],
        foreignColumns: [environments.id],
        name: "fk_env_comp_o2o_env",
      }),
      fk_env_comp_o2o_companion: foreignKey({
        columns: [table.companionOneToOneId],
        foreignColumns: [companionOneToOnes.id],
        name: "fk_env_comp_o2o_companion",
      }),
    };
  },
);
