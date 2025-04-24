import { reset } from "drizzle-seed";
import * as schema from "./schema";
import { txt } from "../utils";
import { DBService } from "./db-service";

export async function clear(db: DBService) {
  await reset(db.drizzle, schema);
}

export async function seed(db: DBService) {
  await clear(db);

  // Environments
  const [universe] = await Promise.all([
    db.worldRoomEnvironments.create({ id: "UNIVERSE" }),
  ]);

  // Ai Users
  const [niko] = await Promise.all([
    db.aiUsers.create({
      id: "NIKO",
      tag: "niko",
      bio: txt(<>Niko is our host.</>),
    }),
  ]);

  // Environment Presences
  await Promise.all([
    db.userEnvironmentPresences.insert({
      environmentId: universe.environmentId,
      userId: niko.userId,
    }),
  ]);

  // Plot Points
  await db.aiMessages.create({
    userId: niko.userId,
    environmentId: universe.environmentId,
    content: "Welcome to 2PM",
    state: "COMPLETE",
  });
}
