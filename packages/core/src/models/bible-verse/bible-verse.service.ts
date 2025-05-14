import { DBServiceModule } from "../../db/db-service-module";
import { BibleVerseDto } from "./bible-verse.dto";
import { kjvVerses } from "../../db/library.schema";
import { DBContexts } from "../../db/db.types";
import { OllamaEmbeddings } from "@langchain/ollama";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { inArray } from "drizzle-orm";

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

  async findAll(): Promise<BibleVerseDto[]> {
    const res = await this.library.drizzle.select().from(kjvVerses).limit(20);
    return res;
  }

  async vectorQuery(query: string): Promise<BibleVerseDto[]> {
    const res = await this.vector.similaritySearch(query, 3);

    const dtos = await this.library.drizzle
      .select()
      .from(kjvVerses)
      .where(
        inArray(
          kjvVerses.id,
          res.map((d) => d.metadata.id),
        ),
      );

    return dtos;
  }
}
