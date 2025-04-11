import { Command } from "commander";
import ora from "ora";
import DBService from "@2pm/db";

// Create the db command
const db = new Command("db");

db.command("drop")
  .description("Drop DB")
  .action(async () => {
    const spinner = ora("Dropping database").start();

    try {
      const url = new URL(process.env.DATABASE_URL!);
      url.pathname = "/";

      const db = new DBService(url.toString());
      await db.pg`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '2pm'
        AND pid <> pg_backend_pid();
      `;
      await db.pg`DROP DATABASE IF EXISTS "2pm"`;
      await db.end();

      spinner.succeed(`Dropped database`);
    } catch (e) {
      spinner.fail("Error dropping database");
      console.error(e);
      process.exit(1);
    }
  });

db.command("create")
  .description("Creating DB")
  .action(async () => {
    const spinner = ora("Creating database").start();

    try {
      const url = new URL(process.env.DATABASE_URL!);
      url.pathname = "/";

      const db = new DBService(url.toString());
      await db.pg`CREATE DATABASE "2pm"`;
      await db.end();

      spinner.succeed(`Created database`);
    } catch (e) {
      spinner.fail("Error creating database");
      console.error(e);
      process.exit(1);
    }
  });

db.command("seed")
  .description("Seed DB")
  .action(async () => {
    const spinner = ora("Seeding database").start();

    try {
      const db = new DBService(process.env.DATABASE_URL!);
      await db.utils.seed();
      await db.end();
      spinner.succeed(`Seeded database`);
    } catch (e) {
      spinner.fail("Error seeding database");
      console.error(e);
      process.exit(1);
    }
  });

db.command("clear")
  .description("Clears all tables")
  .action(async () => {
    const spinner = ora("Clearing DB").start();

    try {
      const db = new DBService(process.env.DATABASE_URL!);
      await db.utils.clear();
      await db.end();
      spinner.succeed(`Cleared DB`);
    } catch (e) {
      spinner.fail("Error clearing DB");
      console.error(e);
      process.exit(1);
    }
  });

export default db;