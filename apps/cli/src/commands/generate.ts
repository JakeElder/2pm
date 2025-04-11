import { Command } from "commander";
import ora from "ora";
import { writeFile } from "fs/promises";
import { generateApi } from "swagger-typescript-api";
import path from "path";
import { generateSpecDocument } from "@2pm/api/utils";

// Create the generate command
const generate = new Command("generate");

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
        disableThrowOnError: true,
      } as any);

      spinner.succeed(`TypeScript fetch client generated at ${options.out}`);
    } catch (e) {
      spinner.fail("Error generating TypeScript fetch client.");
      process.exit(1);
    }
  });

export default generate;