import {
  users,
  plotPoints,
  rooms,
  worldRooms,
  roomWorldRooms,
  userPlotPoints,
  plotPointMessages,
  messages,
} from "../src/drizzle/schema";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const pg = postgres(process.env.DATABASE_URL!);
const db = drizzle(pg);

async function seed() {
  // Clear
  await db.delete(roomWorldRooms);
  await db.delete(userPlotPoints);
  await db.delete(plotPointMessages);
  await db.delete(messages);
  await db.delete(users);
  await db.delete(plotPoints);
  await db.delete(rooms);
  await db.delete(worldRooms);

  // Users
  const [g] = await db
    .insert(users)
    .values([
      { id: 1, tag: "g", type: "AI" },
      { id: 2, tag: "jake", type: "HUMAN" },
    ])
    .returning();

  // Insert UNIVERSE
  const universe = await db.transaction(async (tx) => {
    const [room] = await tx.insert(rooms).values({ type: "WORLD" }).returning();
    const [universe] = await tx
      .insert(worldRooms)
      .values({ code: "UNIVERSE" })
      .returning();
    await tx.insert(roomWorldRooms).values({
      roomId: room.id,
      worldRoomId: universe.id,
    });

    return room;
  });

  // Insert message
  await db.transaction(async (tx) => {
    const [plotPoint] = await tx
      .insert(plotPoints)
      .values({ type: "MESSAGE" })
      .returning();

    const [message] = await tx
      .insert(messages)
      .values({
        content: "Standby for G stuff",
        userId: g.id,
        roomId: universe.id,
      })
      .returning();

    await tx.insert(userPlotPoints).values({
      userId: g.id,
      plotPointId: plotPoint.id,
    });

    await tx.insert(plotPointMessages).values({
      plotPointId: plotPoint.id,
      messageId: message.id,
    });
  });
}

async function main() {
  try {
    await seed();
  } finally {
    await pg.end();
  }
}

main().catch(console.error);
