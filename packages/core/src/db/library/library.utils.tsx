import { reset } from "drizzle-seed";
import * as schema from "./library.schema";
import { LibraryDBService } from "./library.service";

export async function clear(db: LibraryDBService) {
  await reset(db.drizzle, schema);
}

export async function seed(db: LibraryDBService) {
  await clear(db);
}
