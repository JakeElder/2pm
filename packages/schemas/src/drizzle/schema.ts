import { integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";
import { AI_USER_CODES } from "../constants";

export const userTypeEnum = pgEnum("UserType", ["HUMAN", "AI"]);
export const plotPointTypeEnum = pgEnum("PlotPointType", ["MESSAGE"]);
export const roomTypeEnum = pgEnum("RoomType", ["WORLD"]);
export const worldRoomCodeEnum = pgEnum("WorldRoomCodeEnum", ["UNIVERSE"]);
export const aiUserCodeEnum = pgEnum("AiUserCodeEnum", AI_USER_CODES);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  type: userTypeEnum("type").notNull(),
});

export const humanUsers = pgTable("human_users", {
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "restrict" }),
  locationRoomId: integer("location_room_id")
    .notNull()
    .references(() => rooms.id, {
      onDelete: "restrict",
    }),
});

export const aiUsers = pgTable("ai_users", {
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "restrict" }),
  code: aiUserCodeEnum("code").notNull(),
});

export const plotPoints = pgTable("plot_points", {
  id: serial("id").primaryKey(),
  type: plotPointTypeEnum("type").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "restrict",
    }),
  roomId: integer("room_id")
    .notNull()
    .references(() => rooms.id, {
      onDelete: "restrict",
    }),
});

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

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  type: roomTypeEnum("type").notNull(),
});

export const worldRooms = pgTable("world_rooms", {
  id: serial("id").primaryKey(),
  code: worldRoomCodeEnum("code").notNull(),
});

export const roomWorldRooms = pgTable("room_world_rooms", {
  roomId: integer("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "restrict" }),
  worldRoomId: integer("world_room_id")
    .notNull()
    .references(() => worldRooms.id, { onDelete: "restrict" }),
});

export const userRoomPresences = pgTable("user_room_presences", {
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  roomId: integer("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "restrict" }),
});

export const aiUserRoomPresences = pgTable("ai_user_room_presences", {
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  roomId: integer("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "restrict" }),
});
