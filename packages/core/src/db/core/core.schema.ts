import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { USER_TYPES } from "../../models/user/user.constants";
import { AI_USER_CODES } from "../../models/ai-user/ai-user.constants";
import { PLOT_POINT_TYPES } from "../../models/plot-point/plot-point.constants";
import { MESSAGE_TYPES } from "../../models/message/message.constants";
import { ENVIRONMENT_TYPE_CODES } from "../../models/environment/environment.constants";
import { WORLD_ROOM_CODES } from "../../models/world-room-environment/world-room-environment.constants";
import { Prose } from "../../models/prose/prose.dto";

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

export const humanUsers = pgTable("human_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  tag: text("tag"),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  locationEnvironmentId: integer("location_environment_id")
    .notNull()
    .references(() => environments.id),
});

export const aiUsers = pgTable("ai_users", {
  id: aiUserCodeEnum("id").primaryKey(),
  tag: text("tag").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
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
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
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
  plotPointId: integer("plot_point_id")
    .notNull()
    .references(() => plotPoints.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  environmentId: integer("environment_id")
    .notNull()
    .references(() => environments.id),
});

export const humanMessages = pgTable("human_messages", {
  id: serial("id").primaryKey(),
  content: jsonb("content").notNull().$type<Prose>(),
  messageId: integer("message_id")
    .notNull()
    .references(() => messages.id),
});

export const aiMessages = pgTable("ai_messages", {
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
  slug: varchar("slug").notNull().unique(),
});

export const companionEnvironments = pgTable("companion_environments", {
  id: serial("id").primaryKey(),
  environmentId: integer("environment_id")
    .notNull()
    .references(() => environments.id),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  companionUserId: integer("companion_user_id")
    .notNull()
    .references(() => users.id),
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
  expired: timestamp("expired")
    .default(sql`null`)
    .$type<Date | null>(),
});

export const plotPointEnvironmentPresences = pgTable(
  "plot_point_environment_presences",
  {
    plotPointId: integer("plot_point_id")
      .notNull()
      .references(() => plotPoints.id),
    userEnvironmentPresenceId: integer("user_environment_presence_id")
      .notNull()
      .references(() => userEnvironmentPresences.id),
  },
);
