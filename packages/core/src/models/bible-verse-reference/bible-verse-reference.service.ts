import { eq } from "drizzle-orm";
import {
  bibleVerseReferences,
  environments,
  plotPointBibleVerseReferences,
  plotPoints,
} from "../../db/app.schema";
import { DBServiceModule } from "../../db/db-service-module";
import {
  BibleVerseReferenceDto,
  CreateBibleVerseReferenceDto,
} from "./bible-verse-reference.dto";

export default class BibleVerseReferences extends DBServiceModule {
  public async create({
    userId,
    environmentId,
    bibleVerseId,
    bibleChunkId,
  }: CreateBibleVerseReferenceDto): Promise<BibleVerseReferenceDto | null> {
    const [environment] = await this.app.drizzle
      .select()
      .from(environments)
      .where(eq(environments.id, environmentId))
      .limit(1);

    if (!environment) {
      throw new Error();
    }

    const res: BibleVerseReferenceDto = await this.app.drizzle.transaction(
      async (tx) => {
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

        return bibleVerseReference;
      },
    );

    return res;
  }
}
