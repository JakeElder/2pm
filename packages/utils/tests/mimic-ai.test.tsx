import { describe, it } from "bun:test";
import mimicAi from "../src/mimic-ai";

describe("mimicAi function", () => {
  it.skip("should convert a React node to markdown", async () => {
    for await (const chunk of mimicAi(
      "This will be. streamed at random configurable intervals with defaults",
    )) {
      process.stdout.write(chunk);
    }
  });
});
