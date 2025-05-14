import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/library.schema.ts",
  out: "./drizzle/library",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.LIBRARY_DATABASE_URL!,
  },
});
