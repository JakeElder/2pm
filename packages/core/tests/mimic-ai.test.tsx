import { describe, it } from "bun:test";
import mimicAi from "../src/utils/mimic-ai";

describe("mimicAi", () => {
  it.skip("should stream chunks", async () => {
    for await (const chunk of mimicAi(
      "This will be. streamed at random configurable intervals with defaults",
    )) {
      process.stdout.write(chunk);
    }
  });
});
