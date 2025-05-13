import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/app/app.schema.ts",
  out: "./drizzle/app",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.APP_DATABASE_URL!,
  },
});
