import { pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";
// import { relations } from "drizzle-orm";

export const actorTypeEnum = pgEnum("ActorType", ["HUMAN", "AI"]);
// export const plotPointTypeEnum = pgEnum("PlotPointType", [
//   "MESSAGE",
//   "ENTRANCE",
//   "EXIT",
// ]);
// export const roomTypeEnum = pgEnum("roomType", ["WORLD", "DM"]);

export const actors = pgTable("actors", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  type: actorTypeEnum("type").notNull(),
});

// export const plotPoints = pgTable("plot_points", {
//   id: serial("id").primaryKey(),
//   type: plotPointTypeEnum("type").notNull(),
//   roomId: integer("roomId").notNull(),
// });

// export const messages = pgTable("messages", {
//   id: serial("id").primaryKey(),
//   content: text("content").notNull(),
//   actorId: integer("actorId").notNull(),
// });

// export const rooms = pgTable("rooms", {
//   id: serial("id").primaryKey(),
//   name: text("name").notNull(),
//   type: roomTypeEnum("type").notNull(),
//   targetId: integer("targetId").notNull(),
// });

// export const worldRooms = pgTable("world_rooms", {
//   id: serial("id").primaryKey(),
//   code: text("code").notNull(),
// });

// export const actorsRelations = relations(actors, (helpers) => ({
//   messages: helpers.many(messages, { relationName: "ActorToMessage" }),
// }));

// export const plotPointsRelations = relations(plotPoints, (helpers) => ({
//   room: helpers.one(rooms, {
//     relationName: "roomToPlotPoint",
//     fields: [plotPoints.roomId],
//     references: [rooms.id],
//   }),
// }));

// export const messagesRelations = relations(messages, (helpers) => ({
//   actor: helpers.one(actors, {
//     relationName: "ActorToMessage",
//     fields: [messages.actorId],
//     references: [actors.id],
//   }),
// }));

// export const roomsRelations = relations(rooms, (helpers) => ({
//   plotPoints: helpers.many(plotPoints, {
//     relationName: "roomToPlotPoint",
//   }),
// }));
