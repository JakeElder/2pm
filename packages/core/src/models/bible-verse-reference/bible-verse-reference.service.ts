import { eq } from "drizzle-orm";
import {
  bibleVerseReferences,
  environments,
  plotPointBibleVerseReferences,
  plotPoints,
} from "../../db/app.schema";
import { DBServiceModule } from "../../db/db-service-module";
import { CreateBibleVerseReferenceDto } from "./bible-verse-reference.dto";
import { BibleVerseReferencePlotPointDto } from "../plot-point";
import { kjvBooks, kjvChunks, kjvVerses } from "../../db/library.schema";

export default class BibleVerseReferences extends DBServiceModule {
  public async create({
    userId,
    environmentId,
    bibleVerseId,
    bibleChunkId,
  }: CreateBibleVerseReferenceDto): Promise<
    BibleVerseReferencePlotPointDto["data"]
  > {
    const [environment] = await this.app.drizzle
      .select()
      .from(environments)
      .where(eq(environments.id, environmentId))
      .limit(1);

    const [bibleChunk] = await this.library.drizzle
      .select()
      .from(kjvChunks)
      .where(eq(kjvChunks.id, bibleChunkId));

    const [{ bibleBook, bibleVerse }] = await this.library.drizzle
      .select({
        bibleVerse: kjvVerses,
        bibleBook: kjvBooks,
      })
      .from(kjvVerses)
      .innerJoin(kjvBooks, eq(kjvBooks.id, kjvVerses.bookId))
      .where(eq(kjvVerses.id, bibleVerseId));

    if (!environment || !bibleBook || !bibleVerse) {
      throw new Error();
    }

    const { plotPoint } = await this.app.drizzle.transaction(async (tx) => {
      const [plotPoint] = await tx
        .insert(plotPoints)
        .values({ type: "BIBLE_VERSE_REFERENCE", environmentId, userId })
        .returning();

      const [bibleVerseReference] = await tx
        .insert(bibleVerseReferences)
        .values({ bibleVerseId, bibleChunkId })
        .returning();

      await tx.insert(plotPointBibleVerseReferences).values({
        bibleVerseReferenceId: bibleVerseReference.id,
        plotPointId: plotPoint.id,
      });

      return { plotPoint };
    });

    return {
      bibleChunk,
      bibleBook,
      bibleVerse,
      environment,
      plotPoint,
    };
  }
}
