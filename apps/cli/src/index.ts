#!/usr/bin/env bun

import { Command } from "commander";
import ora from "ora";
import { writeFile } from "fs/promises";
import { generateApi } from "swagger-typescript-api";
import ivanAscii from "./ivan";
import path from "path";
import { generateSpecDocument } from "@2pm/api/utils";
import DBService from "@2pm/db";
const ivan = new Command("ivan").description(ivanAscii);
const generate = new Command("generate");
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
      spinner.fail("Error dropping database");
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

generate
  .command("api-spec")
  .description("Generate OpenAPI specification")
  .requiredOption("--out <path>", "Output file path")
  .option("--server <url>", "Server URL to include in the OpenAPI spec")
  .action(async (options) => {
    const spinner = ora("Generating OpenAPI specification").start();

    try {
      const document = await generateSpecDocument(options.server);
      const output = JSON.stringify(document, null, 2);
      await writeFile(options.out, output, "utf8");
      spinner.succeed(`OpenAPI specification generated successfully`);
    } catch (e) {
      spinner.fail("Error generating OpenAPI specification.");
      console.error(e);
      process.exit(1);
    }
  });

generate
  .command("client")
  .description("Generate TypeScript fetch client from OpenAPI spec")
  .requiredOption("--out <file>", "Output file")
  .action(async (options) => {
    const spinner = ora("Generating TypeScript fetch client").start();

    try {
      const document = await generateSpecDocument();
      const dir = path.dirname(options.out);
      const name = path.basename(options.out);

      await generateApi({
        spec: document as any,
        output: path.resolve(process.cwd(), dir),
        name,
        silent: true,
      });

      spinner.succeed(`TypeScript fetch client generated at ${options.out}`);
    } catch (e) {
      spinner.fail("Error generating TypeScript fetch client.");
      process.exit(1);
    }
  });

ivan.addCommand(generate);
ivan.addCommand(db);
ivan.parse(process.argv);
