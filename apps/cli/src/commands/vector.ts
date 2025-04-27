import { Command } from "commander";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Document } from "@langchain/core/documents";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { Pool } from "pg";

const vector = new Command("vector");

vector
  .command("query")
  .description("Search for Bible passages using natural language queries")
  .argument("<query>", "Natural language query to search for relevant passages")
  .option("-n, --num-results <number>", "Number of results to return", "3")
  .action(async (query, options) => {
    try {
      console.log(`Searching for: "${query}"...`);

      // Get database URL from environment variable
      const databaseUrl = process.env.LIBRARY_DATABASE_URL;
      if (!databaseUrl) {
        throw new Error(
          "LIBRARY_DATABASE_URL environment variable is required",
        );
      }

      const embeddingModel =
        "jeffh/intfloat-multilingual-e5-large-instruct:f16";

      const numResults = parseInt(options.numResults);

      // Initialize database connection using the URL
      // const pool = new Pool({ connectionString: databaseUrl });

      // Initialize the embedding model using Ollama
      const embeddings = new OllamaEmbeddings({
        model: embeddingModel,
        baseUrl: "http://localhost:11434",
      });

      // Initialize the vector store with the right dimension size
      const vectorStore = new PGVectorStore(embeddings, {
        postgresConnectionOptions: {
          connectionString: databaseUrl,
        },
        tableName: "book_chunks",
        columns: {
          idColumnName: "id",
          vectorColumnName: "embedding",
          contentColumnName: "content",
          metadataColumnName: "metadata",
        },
        distanceStrategy: "cosine",
      });

      // Perform similarity search
      console.log("Generating embeddings for query...");
      const results = await vectorStore.similaritySearch(query, numResults);

      // Display results
      console.log(`\nFound ${results.length} relevant passages:\n`);

      results.forEach((result, index) => {
        console.log(`--- Result ${index + 1} ---`);
        console.log(
          `Location: ${result.metadata.book} ${result.metadata.chapter}:${result.metadata.verse}`,
        );
        console.log(`Passage: ${result.pageContent}`);
        console.log();
      });

      vectorStore.pool.end();
    } catch (e) {
      console.error("Error during search:", e);
      process.exit(1);
    }
  });

vector
  .command("run")
  .description("Generate embeddings for Bible verses and store in Postgres")
  .action(async () => {
    try {
      console.log("Starting vector embedding process for Bible verses...");

      // Get database URL from environment variable
      const databaseUrl = process.env.LIBRARY_DATABASE_URL;
      if (!databaseUrl) {
        throw new Error(
          "LIBRARY_DATABASE_URL environment variable is required",
        );
      }

      const embeddingModel =
        "jeffh/intfloat-multilingual-e5-large-instruct:f16";

      // Initialize database connection using the URL
      const pool = new Pool({ connectionString: databaseUrl });

      console.log(`Initializing Ollama embedding model: ${embeddingModel}`);
      const embeddings = new OllamaEmbeddings({
        model: embeddingModel,
        baseUrl: "http://localhost:11434",
      });

      await setupVectorTable(pool);
      await processVerses(pool, embeddings);

      console.log("Vector embedding process completed successfully!");
      await pool.end();
    } catch (e) {
      console.error("Error during vector embedding process:", e);
      process.exit(1);
    }
  });

async function setupVectorTable(pool: Pool) {
  console.log("Setting up vector extension and book_chunks table...");

  await pool.query(/* sql */ `
    -- Enable the vector extension
    CREATE EXTENSION IF NOT EXISTS vector;
    
    -- Create table for book chunks with vector embeddings
    CREATE TABLE IF NOT EXISTS book_chunks (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      metadata JSONB NOT NULL,
      embedding VECTOR(1024) -- Dimension for multilingual-e5-large-instruct
    );
    
    -- Create an index for faster vector similarity search
    CREATE INDEX IF NOT EXISTS book_chunks_embedding_idx 
    ON book_chunks USING ivfflat (embedding vector_l2_ops) 
    WITH (lists = 100);
    
    -- Create a function for vector similarity search
    CREATE OR REPLACE FUNCTION match_documents(
      query_embedding VECTOR(1024),
      match_threshold FLOAT,
      match_count INT
    )
    RETURNS TABLE(
      id INT,
      content TEXT,
      metadata JSONB,
      similarity FLOAT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RETURN QUERY
      SELECT
        book_chunks.id,
        book_chunks.content,
        book_chunks.metadata,
        1 - (book_chunks.embedding <-> query_embedding) AS similarity
      FROM book_chunks
      WHERE 1 - (book_chunks.embedding <-> query_embedding) > match_threshold
      ORDER BY book_chunks.embedding <-> query_embedding
      LIMIT match_count;
    END;
    $$;
  `);

  console.log("Vector table setup complete.");
}

/**
 * Process Bible verses in batches
 */
async function processVerses(pool: Pool, embeddings: OllamaEmbeddings) {
  // Get total number of verses
  const countResult = await pool.query(
    /* sql */ ` SELECT COUNT(*) FROM "KJV_verses"`,
  );
  const totalVerses = parseInt(countResult.rows[0].count);
  console.log(`Total verses to process: ${totalVerses}`);

  // Process in batches
  const batchSize = 32;
  const startTime = Date.now();
  let processedCount = 0;

  // Add context to each verse by combining with adjacent verses
  for (let offset = 0; offset < totalVerses; offset += batchSize) {
    // Get a batch of verses
    const versesResult = await pool.query(
      /* sql */ `
      SELECT v.id, b.name as book_name, v.chapter, v.verse, v.text
      FROM "KJV_verses" v
      JOIN "KJV_books" b ON v.book_id = b.id
      ORDER BY v.book_id, v.chapter, v.verse
      LIMIT $1 OFFSET $2
    `,
      [batchSize, offset],
    );

    const verseDocuments = [];

    // Process each verse
    for (const verse of versesResult.rows) {
      // Get context (preceding and following verses)
      const contextResult = await pool.query(
        /* sql */ `
        SELECT v.id, v.text
        FROM "KJV_verses" v
        WHERE v.book_id = (SELECT book_id FROM "KJV_verses" WHERE id = $1)
          AND v.chapter = (SELECT chapter FROM "KJV_verses" WHERE id = $1)
          AND v.verse BETWEEN 
            (SELECT GREATEST(1, verse - 2) FROM "KJV_verses" WHERE id = $1)
            AND
            (SELECT verse + 2 FROM "KJV_verses" WHERE id = $1)
        ORDER BY v.verse
      `,
        [verse.id],
      );

      // Combine verse with context
      const contextText = contextResult.rows.map((v) => v.text).join(" ");

      // Create document with metadata
      const doc = new Document({
        pageContent: contextText,
        metadata: {
          book: verse.book_name,
          chapter: verse.chapter,
          verse: verse.verse,
          range: [0, verse.text.length],
          id: verse.id,
        },
      });

      verseDocuments.push(doc);
    }

    // Generate embeddings for the batch
    const texts = verseDocuments.map((doc) => doc.pageContent);
    const embeddingResults = await embeddings.embedDocuments(texts);

    // Store embeddings in the database
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      for (let i = 0; i < verseDocuments.length; i++) {
        const doc = verseDocuments[i];
        const embedding = embeddingResults[i];

        await client.query(
          /* sql */
          `INSERT INTO book_chunks (content, metadata, embedding) VALUES ($1, $2, $3)`,
          [doc.pageContent, doc.metadata, `[${embedding.join(",")}]`],
        );
      }

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    // Update progress
    processedCount += verseDocuments.length;
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const versesPerSecond = processedCount / elapsedSeconds;
    console.log(
      `Progress: ${processedCount}/${totalVerses} verses (${versesPerSecond.toFixed(2)} verses/sec)`,
    );
  }

  // Final progress report
  const totalTime = (Date.now() - startTime) / 1000;
  console.log(
    `Processing complete: ${processedCount} verses in ${totalTime.toFixed(2)} seconds`,
  );
}

export default vector;
