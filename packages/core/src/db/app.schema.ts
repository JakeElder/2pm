import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { USER_TYPES } from "../models/user/user.constants";
import { AI_USER_CODES } from "../models/ai-user/ai-user.constants";
import { PLOT_POINT_TYPES } from "../models/plot-point/plot-point.constants";
import { MESSAGE_TYPES } from "../models/message/message.constants";
import {
  ENVIRONMENT_AI_TASK_STATE,
  ENVIRONMENT_TYPE_CODES,
} from "../models/environment/environment.constants";
import { WORLD_ROOM_CODES } from "../models/world-room-environment/world-room-environment.constants";
import { AI_MESSAGE_STATES } from "../models/ai-message/ai-message.constants";
import { Prose } from "../models/prose/prose.dto";

export const userTypeEnum = pgEnum("UserType", USER_TYPES);
export const messageTypeEnum = pgEnum("MessageType", MESSAGE_TYPES);
export const plotPointTypeEnum = pgEnum("PlotPointType", PLOT_POINT_TYPES);
export const environmentTypeEnum = pgEnum(
  "EnvironmentType",
  ENVIRONMENT_TYPE_CODES,
);
export const worldRoomCodeEnum = pgEnum("WorldRoomCodeEnum", WORLD_ROOM_CODES);
export const aiUserCodeEnum = pgEnum("AiUserCodeEnum", AI_USER_CODES);
export const aiMessageStateEnum = pgEnum(
  "AiMessageStateEnum",
  AI_MESSAGE_STATES,
);
export const environmentAiTaskState = pgEnum(
  "EnvironmentAiTaskState",
  ENVIRONMENT_AI_TASK_STATE,
);

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
  id: uuid("id").primaryKey().defaultRandom(),
  humanUserId: uuid("human_user_id").references(() => humanUsers.id),
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
  json: jsonb("json").notNull().$type<Prose>(),
  text: text("text").notNull(),
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
  state: aiMessageStateEnum("state").notNull(),
});

/**
 * Environments
 */

export const environments = pgTable("environments", {
  id: serial("id").primaryKey(),
  type: environmentTypeEnum("type").notNull(),
});

export const environmentAiTasks = pgTable(
  "environment_ai_tasks",
  {
    id: serial("id").primaryKey(),
    environmentId: integer("environment_id")
      .notNull()
      .references(() => environments.id),
    aiUserId: aiUserCodeEnum("ai_user_id")
      .notNull()
      .references(() => aiUsers.id),
    state: environmentAiTaskState("state").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("unique_active_task_per_environment_idx")
      .on(table.environmentId)
      .where(sql`${table.state} != 'COMPLETE'`),
  ],
);

export const worldRoomEnvironments = pgTable("world_room_environments", {
  id: worldRoomCodeEnum("id").primaryKey(),
  environmentId: integer("environment_id")
    .notNull()
    .references(() => environments.id),
  slug: varchar("slug").notNull().unique(),
  order: integer("order").notNull(),
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

/**
 * Bible Verse References
 */

export const bibleVerseReferences = pgTable("bible_verse_references", {
  id: serial("id").primaryKey(),
  bibleChunkId: integer("bible_chunk_id").notNull(),
  bibleVerseId: integer("bible_verse_id").notNull(),
});

/*
 * Join Tables
 */

export const userEnvironmentPresences = pgTable(
  "user_environment_presences",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    environmentId: integer("environment_id")
      .notNull()
      .references(() => environments.id),
    expired: timestamp("expired").$type<Date | null>(),
  },
  (table) => [
    uniqueIndex("user_presence_idx")
      .on(table.userId)
      .where(sql`${table.expired} IS NULL`),
  ],
);

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

export const plotPointBibleVerseReferences = pgTable(
  "plot_point_bible_verse_references",
  {
    plotPointId: integer("plot_point_id")
      .notNull()
      .references(() => plotPoints.id),
    bibleVerseReferenceId: integer("bible_verse_reference_id")
      .notNull()
      .references(() => bibleVerseReferences.id),
  },
);
