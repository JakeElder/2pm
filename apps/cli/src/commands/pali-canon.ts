import { Command } from "commander";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Document } from "@langchain/core/documents";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { Pool } from "pg";

const paliCanon = new Command("pali-canon");
const PALI_CANON_CHUNKS_TABLE_NAME = "pali_canon_chunks";
const EMBEDDING_DIMENSION = 1024;
const MAX_CHUNK_CHAR_LENGTH = 1300;

interface ChunkWithOffsets {
  text: string;
  original_start_char: number;
  original_end_char: number;
}

// Produces non-overlapping, sequential chunks from the original text
function chunkTextWithOffsets(
  originalText: string,
  maxLength: number,
): ChunkWithOffsets[] {
  const chunks: ChunkWithOffsets[] = [];
  if (!originalText || originalText.trim() === "") {
    return chunks;
  }

  let currentOffset = 0;
  while (currentOffset < originalText.length) {
    let chunkEnd = Math.min(currentOffset + maxLength, originalText.length);

    // If we're not at the end of the original text, try to find a better split point
    if (chunkEnd < originalText.length) {
      let splitPoint = -1;
      // Look for sentence endings or newlines
      for (
        let i = chunkEnd - 1;
        i >= currentOffset && i >= chunkEnd - 150;
        i--
      ) {
        // Search back a reasonable distance
        if (/[.!?\n]/.test(originalText[i])) {
          splitPoint = i + 1; // Split after the punctuation/newline
          break;
        }
      }
      // If no sentence boundary, look for a space
      if (splitPoint === -1 || splitPoint <= currentOffset) {
        // Ensure splitPoint is actually forward
        for (
          let i = chunkEnd - 1;
          i >= currentOffset && i >= chunkEnd - 100;
          i--
        ) {
          if (/\s/.test(originalText[i])) {
            splitPoint = i + 1; // Split after the space
            break;
          }
        }
      }
      // If a valid split point is found (and it's not making an empty next chunk), use it
      if (splitPoint !== -1 && splitPoint > currentOffset) {
        // Ensure the part after the split isn't just whitespace or too tiny, unless it's the end.
        if (
          originalText.substring(splitPoint).trim().length > 0 ||
          splitPoint === originalText.length
        ) {
          chunkEnd = splitPoint;
        }
      }
    }

    const chunkContent = originalText.substring(currentOffset, chunkEnd);
    // Only add non-empty chunks
    if (chunkContent.trim() !== "") {
      chunks.push({
        text: chunkContent, // Store the exact substring
        original_start_char: currentOffset,
        original_end_char: chunkEnd,
      });
    }
    currentOffset = chunkEnd;
    // If we didn't make progress (e.g. stuck on a very long non-space word that is exactly maxLength), force progress
    if (
      currentOffset === chunks[chunks.length - 1]?.original_start_char &&
      chunkContent.length === maxLength
    ) {
      currentOffset += maxLength; // This case should be rare if hard split is last resort
    } else if (chunkEnd === chunks[chunks.length - 1]?.original_start_char) {
      // Safety break if stuck in a loop, should not happen with proper currentOffset update
      console.warn("Chunking stuck, forcing progress.");
      currentOffset++;
    }
  }
  return chunks.filter((c) => c.text.trim().length > 0); // Final filter for safety
}

paliCanon
  .command("query")
  .description("Search for Pali Canon passages using natural language queries")
  .argument("<query>", "Natural language query to search for relevant passages")
  .option("-n, --num-results <number>", "Number of results to return", "20")
  .action(async (query, options) => {
    try {
      console.log(`Searching for: "${query}"...`);
      const databaseUrl = process.env.LIBRARY_DATABASE_URL;
      if (!databaseUrl) {
        throw new Error(
          "LIBRARY_DATABASE_URL environment variable is required",
        );
      }
      const embeddingModel =
        "jeffh/intfloat-multilingual-e5-large-instruct:f16";
      const numResults = parseInt(options.numResults);
      const embeddings = new OllamaEmbeddings({
        model: embeddingModel,
        baseUrl: "http://localhost:11434",
      });
      const vectorStore = new PGVectorStore(embeddings, {
        postgresConnectionOptions: { connectionString: databaseUrl },
        tableName: PALI_CANON_CHUNKS_TABLE_NAME,
        columns: {
          idColumnName: "id",
          vectorColumnName: "embedding",
          contentColumnName: "content",
          metadataColumnName: "metadata",
        },
        distanceStrategy: "cosine",
      });
      console.log("Generating embeddings for query...");
      const results = await vectorStore.similaritySearch(query, numResults);
      console.log(`\nFound ${results.length} relevant passages:\n`);
      results.forEach((result, index) => {
        console.log(`--- Result ${index + 1} ---`);
        console.log(`UID: ${result.metadata.uid}`);
        console.log(`Translation ID: ${result.metadata.translation_id}`);
        console.log(`Language: ${result.metadata.lang}`);
        if (
          result.metadata.chunk_index !== undefined &&
          result.metadata.chunk_total > 1
        ) {
          console.log(
            `Chunk: ${result.metadata.chunk_index + 1} of ${result.metadata.chunk_total}`,
          );
        }
        if (
          result.metadata.original_start_char !== undefined &&
          result.metadata.original_end_char !== undefined
        ) {
          console.log(
            `Original Text Offsets: [${result.metadata.original_start_char} - ${result.metadata.original_end_char}]`,
          );
        }
        console.log(`Content Snippet: ${result.pageContent}`);
        if ((result as any)._distance !== undefined) {
          console.log(
            `Similarity: ${(1 - (result as any)._distance).toFixed(4)}`,
          );
        } else if ((result as any).score !== undefined) {
          console.log(`Score: ${(result as any).score.toFixed(4)}`);
        }
        console.log();
      });
      await vectorStore.pool.end();
    } catch (e) {
      console.error("Error during search:", e);
      process.exit(1);
    }
  });

paliCanon
  .command("run")
  .description(
    "Generate embeddings for English Pali Canon translations and store in Postgres. Can be resumed.",
  )
  .option(
    "--start-after-uid <uid>",
    "Source UID to start processing after (for resuming)",
  )
  .action(async (options) => {
    try {
      console.log(
        "Starting vector embedding process for English Pali Canon translations...",
      );
      const databaseUrl = process.env.LIBRARY_DATABASE_URL;
      if (!databaseUrl) {
        throw new Error(
          "LIBRARY_DATABASE_URL environment variable is required",
        );
      }
      const embeddingModel =
        "jeffh/intfloat-multilingual-e5-large-instruct:f16";
      const pool = new Pool({ connectionString: databaseUrl });
      console.log(`Initializing Ollama embedding model: ${embeddingModel}`);
      const embeddings = new OllamaEmbeddings({
        model: embeddingModel,
        baseUrl: "http://localhost:11434",
      });
      await setupPaliCanonVectorTable(pool);
      await processPaliCanonTranslations(
        pool,
        embeddings,
        options.startAfterUid,
      );
      console.log(
        "English Pali Canon vector embedding process completed successfully!",
      );
      await pool.end();
    } catch (e) {
      console.error(
        "Error during English Pali Canon vector embedding process:",
        e,
      );
      process.exit(1);
    }
  });

async function setupPaliCanonVectorTable(pool: Pool) {
  console.log(
    `Setting up vector extension and ${PALI_CANON_CHUNKS_TABLE_NAME} table...`,
  );
  await pool.query(/* sql */ `
    CREATE EXTENSION IF NOT EXISTS vector;
    CREATE TABLE IF NOT EXISTS ${PALI_CANON_CHUNKS_TABLE_NAME} (
      id SERIAL PRIMARY KEY, content TEXT NOT NULL, metadata JSONB NOT NULL,
      embedding VECTOR(${EMBEDDING_DIMENSION})
    );
    DROP INDEX IF EXISTS ${PALI_CANON_CHUNKS_TABLE_NAME}_embedding_idx;
    CREATE INDEX ${PALI_CANON_CHUNKS_TABLE_NAME}_embedding_idx 
    ON ${PALI_CANON_CHUNKS_TABLE_NAME} USING ivfflat (embedding vector_cosine_ops) 
    WITH (lists = 100);
    CREATE OR REPLACE FUNCTION match_pali_documents(
      query_embedding VECTOR(${EMBEDDING_DIMENSION}), match_threshold FLOAT, match_count INT
    ) RETURNS TABLE(id INT, content TEXT, metadata JSONB, similarity FLOAT)
    LANGUAGE plpgsql AS $$
    BEGIN
      RETURN QUERY SELECT chunks.id, chunks.content, chunks.metadata,
      1 - (chunks.embedding <=> query_embedding) AS similarity
      FROM ${PALI_CANON_CHUNKS_TABLE_NAME} chunks 
      WHERE 1 - (chunks.embedding <=> query_embedding) > match_threshold
      ORDER BY chunks.embedding <=> query_embedding ASC LIMIT match_count;
    END;
    $$;
  `);
  console.log("Pali Canon vector table setup complete.");
}

async function embedAndStoreApiBatch(
  docsToEmbed: Document[],
  embeddings: OllamaEmbeddings,
  pool: Pool,
): Promise<number> {
  if (docsToEmbed.length === 0) return 0;
  const textsToEmbed = docsToEmbed.map((doc) => doc.pageContent);
  // console.log(`Embedding API batch of ${docsToEmbed.length} chunks...`);

  let embeddingVectors;
  try {
    embeddingVectors = await embeddings.embedDocuments(textsToEmbed);
  } catch (embeddingError: any) {
    const firstDocInfo =
      docsToEmbed.length > 0
        ? `${docsToEmbed[0].metadata.uid} ch ${docsToEmbed[0].metadata.chunk_index + 1}`
        : "N/A";
    console.error(
      `Embedding API Error for batch starting with ${firstDocInfo}. Message: ${embeddingError.message}`,
    );
    if (embeddingError.response?.data)
      console.error("Ollama response:", embeddingError.response.data);
    else if (embeddingError.cause)
      console.error("Cause:", embeddingError.cause);
    console.log("Skipping this API batch.");
    return 0;
  }

  if (!embeddingVectors || embeddingVectors.length !== docsToEmbed.length) {
    const firstDocInfo =
      docsToEmbed.length > 0
        ? `${docsToEmbed[0].metadata.uid} ch ${docsToEmbed[0].metadata.chunk_index + 1}`
        : "N/A";
    console.error(
      `Embedding results length mismatch for batch starting with ${firstDocInfo}. Expected ${docsToEmbed.length}, got ${embeddingVectors?.length}. Skipping.`,
    );
    return 0;
  }

  const client = await pool.connect();
  let successfullyStoredCount = 0;
  try {
    await client.query("BEGIN");
    for (let j = 0; j < docsToEmbed.length; j++) {
      const doc = docsToEmbed[j];
      const embeddingVector = embeddingVectors[j];
      if (!Array.isArray(embeddingVector) || embeddingVector.some(isNaN)) {
        console.error(
          `Invalid embedding vector for ${doc.metadata.uid}, chunk ${doc.metadata.chunk_index + 1}. Skipping.`,
        );
        continue;
      }
      await client.query(
        `INSERT INTO ${PALI_CANON_CHUNKS_TABLE_NAME} (content, metadata, embedding) VALUES ($1, $2, $3)`,
        [doc.pageContent, doc.metadata, `[${embeddingVector.join(",")}]`],
      );
      successfullyStoredCount++;
    }
    await client.query("COMMIT");
  } catch (dbError: any) {
    await client.query("ROLLBACK");
    const firstDocInfo =
      docsToEmbed.length > 0
        ? `${docsToEmbed[0].metadata.uid} ch ${docsToEmbed[0].metadata.chunk_index + 1}`
        : "N/A";
    console.error(
      `DB Error for API batch starting with ${firstDocInfo}. Error: ${dbError.message}`,
    );
    return 0;
  } finally {
    client.release();
  }
  return successfullyStoredCount;
}

async function processPaliCanonTranslations(
  pool: Pool,
  embeddings: OllamaEmbeddings,
  startAfterUid?: string,
) {
  const absoluteTotalResult = await pool.query(
    `SELECT COUNT(*) FROM "pali_canon_translations" WHERE lang = 'en'`,
  );
  const absoluteTotalSourceTranslations = parseInt(
    absoluteTotalResult.rows[0].count,
  );
  if (absoluteTotalSourceTranslations === 0) {
    console.log("No English translations found in the database at all.");
    return;
  }

  let countWhereClause = "WHERE lang = 'en'";
  const countParamsForRunQuery: string[] = [];
  if (startAfterUid) {
    countWhereClause += ` AND uid > $1`;
    countParamsForRunQuery.push(startAfterUid);
  }
  const countSqlForRun = `SELECT COUNT(*) FROM "pali_canon_translations" ${countWhereClause}`;
  const countResultForRun = await pool.query(
    countSqlForRun,
    countParamsForRunQuery,
  );
  const totalSourceTranslationsForThisRun = parseInt(
    countResultForRun.rows[0].count,
  );

  let sourceDocsInitiallySkipped = 0;
  if (startAfterUid) {
    const skippedCountResult = await pool.query(
      `SELECT COUNT(*) FROM "pali_canon_translations" WHERE lang = 'en' AND uid <= $1 ORDER BY uid`,
      [startAfterUid],
    );
    sourceDocsInitiallySkipped = parseInt(skippedCountResult.rows[0].count);
    console.log(
      `Resuming processing. Skipped ${sourceDocsInitiallySkipped} source documents based on --start-after-uid ${startAfterUid}.`,
    );
  }

  console.log(
    `Total English source translations for this run: ${totalSourceTranslationsForThisRun} (out of ${absoluteTotalSourceTranslations} absolute total).`,
  );
  if (totalSourceTranslationsForThisRun === 0 && startAfterUid) {
    console.log(
      "No new English translations to process after the specified UID.",
    );
    return;
  } else if (totalSourceTranslationsForThisRun === 0) {
    console.log("No English translations to process.");
    return;
  }

  const dbFetchBatchSize = 16;
  const embeddingApiBatchSize = 8;
  const startTime = Date.now();
  let totalSuccessfullyStoredChunkCountInThisRun = 0;
  let sourceDocsProcessedInThisRun = 0;
  const veryLargeDocChunkThreshold = 100;

  for (
    let dbOffset = 0;
    dbOffset < totalSourceTranslationsForThisRun;
    dbOffset += dbFetchBatchSize
  ) {
    const currentSelectParams: any[] = [];
    let selectWhereClause = "WHERE lang = 'en'";
    let paramIndex = 1;

    if (startAfterUid) {
      selectWhereClause += ` AND uid > $${paramIndex++}`;
      currentSelectParams.push(startAfterUid);
    }

    const selectSql = `SELECT translation_id, uid, lang, author_uid, local_file_path, basket, text_content
                       FROM "pali_canon_translations" 
                       ${selectWhereClause} 
                       ORDER BY uid 
                       LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    currentSelectParams.push(dbFetchBatchSize);
    currentSelectParams.push(dbOffset);

    // console.log(
    //   `Fetching DB source batch: current offset ${dbOffset} (for this run's items), limit ${dbFetchBatchSize}.`,
    // );
    const translationRowsResult = await pool.query(
      selectSql,
      currentSelectParams,
    );

    if (translationRowsResult.rows.length === 0) {
      console.log("No more documents in this run's scope.");
      break;
    }

    let apiBatchAccumulator: Document[] = [];
    let lastProcessedSourceUidInDbBatch: string | null = null;

    for (const row of translationRowsResult.rows) {
      sourceDocsProcessedInThisRun++;
      lastProcessedSourceUidInDbBatch = row.uid;
      if (!row.text_content || row.text_content.trim() === "") {
        console.warn(
          `Skipping empty content for translation_id: ${row.translation_id} (UID: ${row.uid})`,
        );
        continue;
      }

      const chunkObjects = chunkTextWithOffsets(
        row.text_content,
        MAX_CHUNK_CHAR_LENGTH,
      );

      if (chunkObjects.length > veryLargeDocChunkThreshold) {
        console.warn(
          `Source UID ${row.uid} generated ${chunkObjects.length} chunks. This might be slow.`,
        );
      }

      for (let chunkIndex = 0; chunkIndex < chunkObjects.length; chunkIndex++) {
        const chunkObj = chunkObjects[chunkIndex];
        const overallProgressPercent =
          absoluteTotalSourceTranslations > 0
            ? ((sourceDocsInitiallySkipped + sourceDocsProcessedInThisRun - 1) /
                absoluteTotalSourceTranslations) *
              100
            : 0;

        console.log(
          `[${overallProgressPercent.toFixed(1)}%] :: ${row.uid} :: [chunk ${chunkIndex + 1}/${chunkObjects.length}]`,
        );

        const metadata: Record<string, any> = {
          translation_id: row.translation_id,
          uid: row.uid,
          lang: row.lang,
          author_uid: row.author_uid,
          local_file_path: row.local_file_path,
          basket: row.basket,
          chunk_index: chunkIndex,
          chunk_total: chunkObjects.length,
          original_start_char: chunkObj.original_start_char,
          original_end_char: chunkObj.original_end_char,
        };

        apiBatchAccumulator.push(
          new Document({ pageContent: chunkObj.text, metadata }),
        );

        if (apiBatchAccumulator.length >= embeddingApiBatchSize) {
          totalSuccessfullyStoredChunkCountInThisRun +=
            await embedAndStoreApiBatch(apiBatchAccumulator, embeddings, pool);
          apiBatchAccumulator = [];
        }
      }
    }

    if (apiBatchAccumulator.length > 0) {
      totalSuccessfullyStoredChunkCountInThisRun += await embedAndStoreApiBatch(
        apiBatchAccumulator,
        embeddings,
        pool,
      );
    }

    if (lastProcessedSourceUidInDbBatch) {
      console.log(
        `Milestone: DB batch ending with source UID ${lastProcessedSourceUidInDbBatch} processed. Use this for --start-after-uid if resuming.`,
      );
    }

    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const chunksPerSecond =
      elapsedSeconds > 0
        ? totalSuccessfullyStoredChunkCountInThisRun / elapsedSeconds
        : 0;
    console.log(
      `Sources processed in this run: ${sourceDocsProcessedInThisRun}/${totalSourceTranslationsForThisRun}. ` +
        `Chunks stored in this run: ${totalSuccessfullyStoredChunkCountInThisRun}. ` +
        `(${chunksPerSecond.toFixed(2)} chunks/sec)`,
    );
  }

  const totalTime = (Date.now() - startTime) / 1000;
  console.log(
    `Current run complete: ${totalSuccessfullyStoredChunkCountInThisRun} chunks stored from ${sourceDocsProcessedInThisRun} English sources in ${totalTime.toFixed(2)}s.`,
  );
  if (startAfterUid) {
    console.log(
      `To continue from where this run left off, if it was interrupted before full completion, use the last logged milestone UID for --start-after-uid.`,
    );
  }
}

export default paliCanon;
