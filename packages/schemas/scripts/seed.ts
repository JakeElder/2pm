import {
  users,
  plotPoints,
  rooms,
  worldRooms,
  roomWorldRooms,
  userPlotPoints,
  plotPointMessages,
  messages,
  userRoomPresence,
  humanUsers,
  aiUsers,
  aiUserRoomPresence,
} from "../src/drizzle/schema";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const pg = postgres(process.env.DATABASE_URL!);
const db = drizzle(pg);

async function seed() {
  // Clear relations
  await db.delete(roomWorldRooms);
  await db.delete(userPlotPoints);
  await db.delete(plotPointMessages);
  await db.delete(userRoomPresence);
  await db.delete(aiUserRoomPresence);
  await db.delete(aiUsers);
  await db.delete(humanUsers);

  // Clear entities
  await db.delete(messages);
  await db.delete(users);
  await db.delete(plotPoints);
  await db.delete(rooms);
  await db.delete(worldRooms);

  // Insert UNIVERSE
  const universe = await db.transaction(async (tx) => {
    const [room] = await tx
      .insert(rooms)
      .values({ id: 1, type: "WORLD" })
      .returning();

    const [universe] = await tx
      .insert(worldRooms)
      .values({ id: 1, code: "UNIVERSE" })
      .returning();

    await tx.insert(roomWorldRooms).values({
      roomId: room.id,
      worldRoomId: universe.id,
    });

    return room;
  });

  // Users
  const [g, jake] = await db.transaction(async (tx) => {
    const [g, jake] = await tx
      .insert(users)
      .values([
        { id: 1, tag: "g", type: "AI" },
        { id: 2, tag: "jake", type: "HUMAN" },
      ])
      .returning();

    await tx.insert(humanUsers).values({
      userId: jake.id,
      locationRoomId: universe.id,
    });

    await tx.insert(aiUsers).values({
      code: "G",
      userId: g.id,
    });

    await tx
      .insert(aiUserRoomPresence)
      .values([{ userId: g.id, roomId: universe.id }]);

    return [g, jake];
  });

  // Insert message
  await db.transaction(async (tx) => {
    const [plotPoint] = await tx
      .insert(plotPoints)
      .values({ id: 1, type: "MESSAGE" })
      .returning();

    const [message] = await tx
      .insert(messages)
      .values({
        id: 1,
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
