import { DBServiceModule } from "../../db/db-service-module";
import { DBContexts } from "../../db/db.types";
import { OllamaEmbeddings } from "@langchain/ollama";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";

export default class PaliCanonPassages extends DBServiceModule {
  private vector: PGVectorStore;

  constructor(context: DBContexts) {
    super(context);

    const embeddings = new OllamaEmbeddings({
      model: "jeffh/intfloat-multilingual-e5-large-instruct:f16",
      baseUrl: "http://localhost:11434",
    });

    this.vector = new PGVectorStore(embeddings, {
      pool: this.library.pool,
      tableName: "pali_canon_chunks",
      columns: {
        idColumnName: "id",
        vectorColumnName: "embedding",
        contentColumnName: "content",
        metadataColumnName: "metadata",
      },
      distanceStrategy: "cosine",
    });
  }

  async vectorQuery(query: string) {
    const res = await this.vector.similaritySearch(query, 10);
    return res.map((r) => {
      if (!r.id) {
        throw new Error();
      }
      return { ...r, id: parseInt(r.id) };
    });
  }
}
