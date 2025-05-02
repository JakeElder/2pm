import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/core/core.schema.ts",
  out: "./drizzle/core",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.CORE_DATABASE_URL!,
  },
});
