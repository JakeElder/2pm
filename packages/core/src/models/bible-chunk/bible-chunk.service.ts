import { eq } from "drizzle-orm";
import { DBServiceModule } from "../../db/db-service-module";
import { BibleChunkDto } from "./bible-chunk.dto";
import { kjvChunks } from "../../db/library.schema";
import { BibleChunk } from "./bible-chunk.types";

export default class BibleChunks extends DBServiceModule {
  async find(id: BibleChunk["id"]): Promise<BibleChunkDto | null> {
    const [res] = await this.library.drizzle
      .select()
      .from(kjvChunks)
      .where(eq(kjvChunks.id, id))
      .limit(1);

    return res ? res : null;
  }
}
