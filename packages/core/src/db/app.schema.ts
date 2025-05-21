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
import { WORLD_ROOM_CODES } from "../models/world-room-environment/world-room-environment.constants";
import { AI_MESSAGE_STATES } from "../models/ai-message/ai-message.constants";
import { Prose } from "../models/prose/prose.dto";
import { THEME_KEYS } from "../models/theme/theme.constants";
import {
  ENVIRONMENT_AI_TASK_STATE,
  ENVIRONMENT_TYPE_CODES,
} from "../models/environment/environment.constants";
import { Operation } from "fast-json-patch";

export const userTypeEnum = pgEnum("user_type", USER_TYPES);
export const messageTypeEnum = pgEnum("message_type", MESSAGE_TYPES);
export const plotPointTypeEnum = pgEnum("plot_point_type", PLOT_POINT_TYPES);
export const worldRoomCodeEnum = pgEnum("world_room_code", WORLD_ROOM_CODES);
export const aiUserCodeEnum = pgEnum("ai_user_code", AI_USER_CODES);
export const aiMessageStateEnum = pgEnum("ai_message_state", AI_MESSAGE_STATES);
export const themeKeyEnum = pgEnum("theme_key", THEME_KEYS);
export const sidebarStateEnum = pgEnum("sidebar_state", ["OPEN", "CLOSED"]);
export const environmentTypeEnum = pgEnum(
  "environment_type",
  ENVIRONMENT_TYPE_CODES,
);
export const environmentAiTaskStateEnum = pgEnum(
  "environment_ai_task_state",
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
 * Config
 */

export const humanUserConfigs = pgTable("human_user_configs", {
  id: serial("id").primaryKey(),
  humanUserId: uuid("human_user_id")
    .notNull()
    .references(() => humanUsers.id),
  siteMapSidebarState: sidebarStateEnum("site_map_sidebar_state")
    .notNull()
    .default("OPEN"),
  usersSidebarState: sidebarStateEnum("users_sidebar_state")
    .notNull()
    .default("OPEN"),
});

/**
 * Session
 */

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  humanUserId: uuid("human_user_id")
    .notNull()
    .references(() => humanUsers.id),
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
    state: environmentAiTaskStateEnum("state").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("unique_active_task_per_environment_idx")
      .on(table.environmentId)
      .where(sql`${table.state} NOT IN ('COMPLETE', 'FAILED')`),
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

export const humanUserRoomEnvironments = pgTable(
  "human_user_room_environments",
  {
    id: serial("id").primaryKey(),
    environmentId: integer("environment_id")
      .notNull()
      .references(() => environments.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    slug: varchar("slug").notNull(),
    order: integer("order").notNull(),
  },
  (table) => [uniqueIndex("user_slug_idx").on(table.userId, table.slug)],
);

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

/**
 * Pali Canon References
 */

export const paliCanonReferences = pgTable("pali_canon_references", {
  id: serial("id").primaryKey(),
  paliCanonChunkId: integer("pali_canon_chunk_id").notNull(),
});

/**
 * Themes
 */

export const themes = pgTable("themes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),

  // Core
  base: text("base").notNull(),
  mantle: text("mantle").notNull(),
  crust: text("crust").notNull(),
  text: text("text").notNull(),
  subtext0: text("subtext0").notNull(),
  subtext1: text("subtext1").notNull(),
  overlay0: text("overlay0").notNull(),
  overlay1: text("overlay1").notNull(),
  overlay2: text("overlay2").notNull(),
  surface0: text("surface0").notNull(),
  surface1: text("surface1").notNull(),
  surface2: text("surface2").notNull(),

  // Named
  rosewater: text("rosewater").notNull(),
  flamingo: text("flamingo").notNull(),
  pink: text("pink").notNull(),
  mauve: text("mauve").notNull(),
  red: text("red").notNull(),
  maroon: text("maroon").notNull(),
  peach: text("peach").notNull(),
  yellow: text("yellow").notNull(),
  green: text("green").notNull(),
  teal: text("teal").notNull(),
  sky: text("sky").notNull(),
  sapphire: text("sapphire").notNull(),
  blue: text("blue").notNull(),
  lavender: text("lavender").notNull(),

  // Alias
  separatorAlias: themeKeyEnum("separator_alias").default("mantle"),
  aiAlias: themeKeyEnum("ai_alias").default("pink"),
  authenticatedAlias: themeKeyEnum("authenticated_alias").default("yellow"),
  anonymousAlias: themeKeyEnum("anonymous_alias").default("maroon"),
  activeChannelAlias: themeKeyEnum("active_channel_alias").default("peach"),
});

/**
 * Theme Lists
 */

export const themeLists = pgTable("theme_lists", {
  id: serial("id").primaryKey(),
  plotPointId: integer("plot_point_id")
    .notNull()
    .references(() => plotPoints.id),
});

/**
 * Theme Updates
 */

export const themeUpdates = pgTable("theme_updates", {
  id: serial("id").primaryKey(),
  plotPointId: integer("plot_point_id")
    .notNull()
    .references(() => plotPoints.id),
  themeId: integer("theme_id")
    .notNull()
    .references(() => themes.id),
  patch: jsonb("patch").notNull().$type<Operation[]>(),
});

/**
 * Join: Theme List Themes
 */

export const themeListThemes = pgTable("theme_list_themes", {
  id: serial("id").primaryKey(),
  themeListId: integer("theme_list_id")
    .notNull()
    .references(() => themeLists.id),
  themeId: integer("theme_id")
    .notNull()
    .references(() => themes.id),
});

/**
 * Join: Plot Point Theme Lists
 */

export const plotPointThemeLists = pgTable("plot_point_theme_lists", {
  id: serial("id").primaryKey(),
  plotPointId: integer("plot_point_id")
    .notNull()
    .references(() => plotPoints.id),
  themeListId: integer("theme_list_id")
    .notNull()
    .references(() => themeLists.id),
});

/**
 * Join: Plot Point Theme Switches
 */

export const plotPointThemeSwitches = pgTable("plot_point_theme_switches", {
  id: serial("id").primaryKey(),
  plotPointId: integer("plot_point_id")
    .notNull()
    .references(() => plotPoints.id),
  fromThemeId: integer("from_theme_id")
    .notNull()
    .references(() => themes.id),
  toThemeId: integer("to_theme_id")
    .notNull()
    .references(() => themes.id),
});

/**
 * Join: Plot Point Created Themes
 */

export const plotPointCreatedThemes = pgTable("plot_point_created_themes", {
  id: serial("id").primaryKey(),
  plotPointId: integer("plot_point_id")
    .notNull()
    .references(() => plotPoints.id),
  themeId: integer("theme_id")
    .notNull()
    .references(() => themes.id),
});

/**
 * Join: HumanUser Themes
 */

export const humanUserThemes = pgTable("human_user_themes", {
  id: serial("id").primaryKey(),
  humanUserId: uuid("human_user_id")
    .notNull()
    .unique()
    .references(() => humanUsers.id),
  themeId: integer("theme_id")
    .notNull()
    .references(() => themes.id),
});

/*
 * Join: User EnvironmentPresences
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
      .on(table.userId, table.environmentId)
      .where(sql`${table.expired} IS NULL`),
  ],
);
/*
 * Join: PlotPoint EnvironmentPresences
 */

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

/*
 * Join: PlotPoint BibleVerseReferences
 */

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

/*
 * Join: PlotPoint PaliCanonReferences
 */

export const plotPointPaliCanonReferences = pgTable(
  "plot_point_pali_canon_references",
  {
    plotPointId: integer("plot_point_id")
      .notNull()
      .references(() => plotPoints.id),
    paliCanonReferenceId: integer("pali_canon_reference_id")
      .notNull()
      .references(() => paliCanonReferences.id),
  },
);
