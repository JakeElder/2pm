import {
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";
import {
  AI_USER_CODES,
  ENVIRONMENT_TYPE_CODES,
  WORLD_ROOM_CODES,
} from "../constants";

export const userTypeEnum = pgEnum("UserType", ["HUMAN", "AI"]);
export const plotPointTypeEnum = pgEnum("PlotPointType", ["MESSAGE"]);
export const environmentTypeEnum = pgEnum(
  "EnvironmentType",
  ENVIRONMENT_TYPE_CODES,
);
export const worldRoomCodeEnum = pgEnum("WorldRoomCodeEnum", WORLD_ROOM_CODES);
export const aiUserCodeEnum = pgEnum("AiUserCodeEnum", AI_USER_CODES);

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
    .references(() => users.id, { onDelete: "restrict" }),
  locationEnvironmentId: integer("location_environment_id")
    .notNull()
    .references(() => environments.id, { onDelete: "restrict" }),
});

export const aiUsers = pgTable("ai_users", {
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "restrict" }),
  code: aiUserCodeEnum("code").notNull().unique(),
});

/**
 * Plot Points
 */

export const plotPoints = pgTable("plot_points", {
  id: serial("id").primaryKey(),
  type: plotPointTypeEnum("type").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  environmentId: integer("environment_id")
    .notNull()
    .references(() => environments.id, { onDelete: "restrict" }),
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

export const userPlotPoints = pgTable("user_plot_points", {
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  plotPointId: integer("plot_point_id")
    .notNull()
    .references(() => plotPoints.id, { onDelete: "restrict" }),
});

export const plotPointMessages = pgTable("plot_point_messages", {
  plotPointId: integer("plot_point_id")
    .notNull()
    .references(() => plotPoints.id, { onDelete: "restrict" }),
  messageId: integer("message_id")
    .notNull()
    .references(() => messages.id, { onDelete: "restrict" }),
});

export const userEnvironmentPresences = pgTable("user_environment_presences", {
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  environmentId: integer("environment_id")
    .notNull()
    .references(() => environments.id, { onDelete: "restrict" }),
});

export const environmentWorldRooms = pgTable("environment_world_rooms", {
  environmentId: integer("environment_id")
    .notNull()
    .references(() => environments.id, { onDelete: "restrict" }),
  worldRoomId: integer("world_room_id")
    .notNull()
    .references(() => worldRooms.id, { onDelete: "restrict" }),
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
