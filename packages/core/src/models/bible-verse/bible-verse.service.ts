import { eq } from "drizzle-orm";
import { DBServiceModule } from "../../db/db-service-module";
import {
  BibleVerseDto,
  BibleVerseVectorQueryResultDto,
} from "./bible-verse.dto";
import { kjvBooks, kjvVerses } from "../../db/library.schema";
import { DBContexts } from "../../db/db.types";
import { OllamaEmbeddings } from "@langchain/ollama";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { inArray } from "drizzle-orm";
import { BibleVerse } from "./bible-verse.types";

export default class BibleVerses extends DBServiceModule {
  private vector: PGVectorStore;

  constructor(context: DBContexts) {
    super(context);

    const embeddings = new OllamaEmbeddings({
      model: "jeffh/intfloat-multilingual-e5-large-instruct:f16",
      baseUrl: "http://localhost:11434",
    });

    this.vector = new PGVectorStore(embeddings, {
      pool: this.library.pool,
      tableName: "kjv_chunks",
      columns: {
        idColumnName: "id",
        vectorColumnName: "embedding",
        contentColumnName: "content",
        metadataColumnName: "metadata",
      },
      distanceStrategy: "cosine",
    });
  }

  async find(id: BibleVerse["id"]): Promise<BibleVerseDto | null> {
    const [res] = await this.library.drizzle
      .select({
        bibleVerse: kjvVerses,
        bibleBook: kjvBooks,
      })
      .from(kjvVerses)
      .innerJoin(kjvBooks, eq(kjvVerses.bookId, kjvBooks.id))
      .where(eq(kjvVerses.id, id))
      .limit(1);

    if (!res) {
      return null;
    }

    return res;
  }

  async findAll(): Promise<BibleVerseDto[]> {
    const res = await this.library.drizzle
      .select({
        bibleVerse: kjvVerses,
        bibleBook: kjvBooks,
      })
      .from(kjvVerses)
      .innerJoin(kjvBooks, eq(kjvVerses.bookId, kjvBooks.id))
      .limit(20);

    return res;
  }

  async vectorQuery(
    query: string,
    results: number = 1,
  ): Promise<BibleVerseVectorQueryResultDto> {
    const res = await this.vector.similaritySearch(query, results);

    const verseIdToChunkIdMap = new Map(
      res.map((d) => [d.metadata.id, parseInt(d.id!)]),
    );

    const dtos = await this.library.drizzle
      .select({
        kjvVerse: kjvVerses,
        kjvBook: kjvBooks,
      })
      .from(kjvVerses)
      .innerJoin(kjvBooks, eq(kjvVerses.bookId, kjvBooks.id))
      .where(
        inArray(
          kjvVerses.id,
          res.map((d) => d.metadata.id),
        ),
      );

    return {
      query,
      results: dtos.map((dto) => {
        const chunkId = verseIdToChunkIdMap.get(dto.kjvVerse.id);

        if (!chunkId) {
          throw new Error();
        }

        return {
          book: dto.kjvBook,
          verse: dto.kjvVerse,
          chunkId,
        };
      }),
    };
  }
}
